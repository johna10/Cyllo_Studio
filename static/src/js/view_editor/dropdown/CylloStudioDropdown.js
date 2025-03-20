/** @odoo-module */
import {Component, useState, useRef, onMounted, onWillUnmount, onWillUpdateProps, xml } from "@odoo/owl";
import {usePosition} from "@web/core/position_hook";


export class CylloStudioDropdown extends Component {
    static template = xml`<div class="custom-dropdown o-autocomplete" t-attf-class="{ state.isOpen? 'dropdown':'' }" t-ref="dropdown"
             t-att-style="'width: ' + props.width">
            <div t-on-click.stop="toggleDropdown" class="d-flex">
                <t t-if="props.searchable">
                    <input
                            t-if="props.searchable"
                            type="text"
                            class="o-autocomplete--input o_input"
                            t-model="state.searchTerm"
                            t-att-placeholder="displayValue"
                            t-on-input="onInput"
                            t-att-readonly="!state.isOpen"
                            t-ref="input"
                            t-att-disabled="props.disabled"
                    />
                </t>
                <t t-else="" t-on-click.stop="toggleDropdown">
                    <span class="selected-text">
                        <t t-esc="displayValue"/>
                    </span>
                </t>
                <i t-att-class="state.isOpen ? 'fa fa-chevron-up' : 'fa fa-chevron-down'" class="cy-dropdown-icon"/>
            </div>
            <t t-if="state.isOpen  and !props.disabled">
                <ul class="o-autocomplete--dropdown-menu ui-widget show"
                    t-att-style="'width: ' + props.width and !props.searchable ? 'margin-top: 13%;margin-left: 0;' : '' "
                    t-att-class="ulDropdownClass"
                    t-ref="recordList">
                    <li t-foreach="filteredOptions" t-as="option" t-key="option.value"
                        t-att-class="o_m2o_dropdown_option"
                        t-on-click.stop="() => this.selectOption(option)"
                        class="o-autocomplete--dropdown-item ui-menu-item d-block "
                    >
                        <a
                                class="dropdown-item ui-menu-item-wrapper text-truncate"
                                t-att-class="{ 'ui-state-active': checkActive(option) }"
                        >
                            <span>
                                <t t-esc="option.label"/>
                            </span>
                        </a>
                    </li>
                    <li t-if="filteredOptions.length === 0" class="no-results">No results found</li>
                </ul>
            </t>

        </div>`
    static props = {
        options: {type: Array},
        defaultValue: { optional: true},
        onChange: {type: Function, optional: true},
        placeholder: {type: String, optional: true, default: "Select..."},
        searchable: {type: Boolean, optional: true, default: false},
        width: {type: String, optional: true, default: "250px"},
        maxHeight: {type: String, optional: true, default: "200px"},
        disabled: {type: Boolean, optional: true, default: false},
        noChange: {type: Boolean, optional: true, default: false},
    };

    setup() {
        this.state = useState({
            isOpen: false,
            options: this.props.options,
            selectedOption: this.props.options.find(option => option.value === this.props.defaultValue) || null,
            searchTerm: "",
        });
        this.dropdown = useRef("dropdown");

        onMounted(() => {
            document.addEventListener('click', this.handleOutsideClick, { capture: true });
        });

        onWillUnmount(() => {
            document.removeEventListener('click', this.handleOutsideClick, { capture: true });
        });

        this.inputRef = useRef("input");

        usePosition("recordList", () => this.targetDropdown, this.dropdownOptions);

        onWillUpdateProps((props) => {
            console.log(props, 'CylloStudioDropdown', this)
            if (!props.noChange)
                this.state.selectedOption = props.options?.find(option => option.value === props.defaultValue) || null;
        })
    }

    get getIsOpen(){
        return this.state.isOpen;
    }

    get targetDropdown() {
        return this.inputRef.el;
    }

    get dropdownOptions() {
        return {
            position: "bottom-start",
        };
    }

    handleOutsideClick = (event) => {
        if (this.dropdown.el && !this.dropdown.el.contains(event.target)) {
            this.state.isOpen = false;
        }
    }

    toggleDropdown() {
        this.state.isOpen = !this.state.isOpen;
    }
    checkActive(option) {
        return option.value === this.state.selectedOption?.value
    }

    selectOption(option) {
        this.state.selectedOption = option;
        this.state.isOpen = false;
        this.state.searchTerm = "";
        if (this.props.onChange) {
            this.props.onChange(option.value);
        }
    }

    onInput() {
        if (!this.state.isOpen) {
            this.state.isOpen = true;
        }
    }

    get displayValue() {
            return this.state.selectedOption ? this.state.selectedOption.label : this.props.placeholder;
    }

    get ulDropdownClass() {
        let classList = "";
        if (this.state.isOpen) {
            classList += " dropdown-menu ui-autocomplete";
        } else {
            classList += " list-group";
        }
        return classList;
    }


    get filteredOptions() {
        if (!this.props.searchable || !this.state.searchTerm) {
            return this.props.options;
        }
        const searchTerm = this.state.searchTerm.toLowerCase();
        return this.props.options.filter(option =>
            option.label?.toLowerCase().includes(searchTerm)
        );
    }
}