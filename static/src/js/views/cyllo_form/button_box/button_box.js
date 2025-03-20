/** @odoo-module  */
import {ButtonBox} from "@web/views/form/button_box/button_box";
import {patch} from '@web/core/utils/patch';
import {useService} from "@web/core/utils/hooks";
import {onWillUnmount} from "@odoo/owl";
import {_t} from "@web/core/l10n/translation";

const {useRef, useState, onWillRender, onMounted} = owl;

patch(ButtonBox.prototype, {
//    setup() {
//        this.ref = useRef('cy-ButtonBox')
//        onMounted(this.onMounted)
//        this.action = useService("action");
//        this.rpc = useService("rpc");
//        this.state = useState({
//            addSmartButtonIcon: true,
//            clicked: false,
//            isX2Many: sessionStorage.getItem('CyX2ManyPath')
//        });
//        this.effect = useService("effect");
////        onWillRender(() => {
////            this.state.isX2Many = sessionStorage.getItem('CyX2ManyPath')
////            this.visibleButtons = Object.entries(this.props.slots)
////                .filter(([_, slot]) => this.isSlotVisible(slot))
////                .map(([slotName]) => slotName)
////            this.additionalButtons = [];
////            this.isFull = true;
////        });
//        this.handleAutoSave = async (ev) => await this.AutoSave(ev);
//        onMounted(() => {
//            this.handleListener()
//            const sheet = document?.querySelector('.o_form_sheet')?.getAttribute('sheet')
//            if (sheet) {
//                this.state.addSmartButtonIcon = false
//            }
//        });
//        onWillUnmount(() => this.handleListener(false))
//    },
//    handleListener(isAdd = true) {
//        if (isAdd) {
//            document.addEventListener("click", this.handleAutoSave, {capture: true});
//            document.addEventListener("mousedown", this.handleAutoSave, {capture: true});
//        } else {
//            document.removeEventListener("click", this.handleAutoSave, {capture: true});
//            document.removeEventListener("mousedown", this.handleAutoSave, {capture: true});
//        }
//    },
//    AutoSave(ev) {
//        const dialog = document.querySelector(".o_technical_modal") || document.querySelector(".o_error_dialog");
//        const view = document.querySelector(".o_form_view")
//        if (this.state.clicked && view.contains(ev.target) && !dialog) {
//            ev.stopPropagation();
//            return this.effect.add({
//                title: _t("Validation Error"),
//                message: "Unable to save the smart button.",
//                description: "Please click save or cancel before making another changes",
//                type: "notification_panel",
//                notificationType: "warning",
//            });
//        }
//    },
//
//    onMounted() {
//        const self = this
//        const smart_button = this.ref.el
//        var drake = dragula([smart_button], {
//            revertOnSpill: true,
//            moves: (el, container, handle) => {
//                return !el.classList.contains('cy-add-smart-button');
//            },
//            accepts: (el, target, source, sibling) => {
//                return sibling
//            }
//        }).on('drop', function (el, target, source, sibling) {
//            const view_id = self.env.config.viewId;
//            const smartButtonPath = el.getAttribute('cy-xpath');
//            const siblingPath = sibling.getAttribute('cy-xpath');
//            const sourcePath = source.getAttribute('cy-xpath');
//
//            const path = siblingPath || sourcePath;
//            const position = siblingPath ? 'before' : 'inside';
//            self.env.services.ui.block();
//            const response = self.rpc("cyllo_studio/move/smart_button", {
//                model: self.action.currentController.action.res_model,
//                view_id: self.env.config.viewId,
//                view_type: 'form',
//                kwargs: {
//                    path,
//                    position,
//                    smartButtonPath,
//                    model: self.action.currentController.action.res_model,
//                    view_id: view_id ? view_id : null,
//                    viewType: 'form'
//                }
//            }).then((response) => {
//                if (response) {
//                    let storedArray = JSON.parse(sessionStorage.getItem('UndoRedo')) || [];
//                    let cleanedStr = response.replace(/\s+/g, ' ').trim();
//                    storedArray.push(cleanedStr)
//                    sessionStorage.setItem('UndoRedo', JSON.stringify(storedArray));
//                    sessionStorage.setItem('ReDO', JSON.stringify([]));
//                }
//                self.env.services.ui.unblock();
//                self.action.doAction('studio_reload')
//                self.env.bus.trigger('resetProperties');
//            })
//        });
//    },
//
    async addSmartButton(e) {
        const buttonBoxExists = document.querySelector('.button-box-container') !== null;
        const pathElement = document.querySelector('.oe_stat_button');
        const path = pathElement?.getAttribute('cy-xpath');
        const parent = e.target.closest(".oe_stat_button");

        if (parent) {
            parent.insertAdjacentHTML('beforebegin', `
                <button class="btn oe_stat_button btn-outline-secondary flex-grow-1 flex-lg-grow-0">
                    <i class="o_button_icon fa fa-fw fa-file-text-o me-1"></i>
                    <div class="o_field_widget o_readonly_modifier o_field_statinfo">
                        <span class="o_stat_info o_stat_value">0</span>
                        <span class="o_stat_text">Smart Button</span>
                    </div>
                </button>
            `);
        }

        this.env.bus.trigger('SMART_BUTTON_DETAILS', {
            properties: { new_button: true },
            addButtonBox: buttonBoxExists,
            path,
            type: "smartbuttonProperties"
        });
    },
});

ButtonBox.props = {
    ...ButtonBox.props,
    cyXpath: {type: String, optional: true},
    striped: {type: Boolean, optional: true}, // Add the `striped` prop
}
ButtonBox.template = 'cyllo_studio.ButtonBox'
