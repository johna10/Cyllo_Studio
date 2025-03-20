/** @odoo-module **/
import { Component, useState, useEffect, useRef } from "@odoo/owl";
import { useService, useOwnedDialogs } from "@web/core/utils/hooks";
import { Dialog } from "@web/core/dialog/dialog";
import { MultiRecordSelector } from "@web/core/record_selectors/multi_record_selector";
import { ExpressionEditorDialog } from "@web/core/expression_editor_dialog/expression_editor_dialog";
import { TagsList } from "@web/core/tags_list/tags_list";
import { DropdownItem } from "@web/core/dropdown/dropdown_item";
import { Dropdown } from "@web/core/dropdown/dropdown";
import { _t } from "@web/core/l10n/translation";
import { CylloStudioDropdown } from "@cyllo_studio/js/view_editor/dropdown/CylloStudioDropdown";


export class StatusBarDialog extends Component {
    static template = "cyllo_studio.StatusBarDialog";
    static components = {
        Dialog,
        MultiRecordSelector,
        TagsList,
        Dropdown,
        DropdownItem,
        CylloStudioDropdown,
    };
    setup() {
       console.log("kddddddddd",this)
        this.rpc = useService('rpc');
        this.action = useService('action');
        this.dialog = useService('dialog');
        this.addDialog = useOwnedDialogs();
        this.state = useState({
            field: "existing",
            selectedField:'',
            values:[],
            isManualField:'',
        })
        this.StatusBarValues = useState({
            clickable: false,
            foldField: '',
            statusbarVisible: '',
            group_ids: [],
            invisible: 'False',
            defaultValue: 'True',
        })
        this.selectionValuesRef  = useRef('cy-SelectionValues')
        this.existingSelectionRef  = useRef('cy-existingSelection')

        useEffect(()=> {
            if(this.state.selectedField){
                console.log("bbbbbbbbbbbbbbbbbbbbbb")
                const field = this.props.fields[this.state.selectedField]
                console.log("sdfghj",field.selection)
                this.state.values = [ ...field.selection ] || []
                const manual = field?.manual

            }
        }, ()=> [this.state.selectedField])
    }

    ExistingField(array){
        console.log("array",array)
        const result = array.map(item => ({ value: item.name, label:item.string }));
        return result
    }
     handleExistingFieldChange(value) {
        this.state.selectedField = value;
        console.log("asdasdasdasd",this.state.selectedField)
    }

    invisibleDomain() {
    const filteredObj = {};
    for (const key in this.props.fields) {
        if (this.props.activeFields[key]) {
            filteredObj[key] = this.props.fields[key];
        }
    }
    this.addDialog(ExpressionEditorDialog, {
        resModel: this.props.model,
        fields: filteredObj,
        expression: this.StatusBarValues.invisible,
        onConfirm: (domain) => this.StatusBarValues.invisible = domain,
    });
  }
  async onConfirm() {
        let values = {
            path: this.props.path,
            view_id: this.props.viewId,
            is_new: false,
            model: this.props.model,
            view_type: 'form',
            header: this.props.header,
//            activeFields: this.props.activeFields,
            field:this.state.selectedField,
        }
        let kwargs = {...this.StatusBarValues}
        this.env.services.ui.block();
        try{
          const response =   await this.rpc("cyllo_studio/add/statusbar", {
               args:{ ...values},
               kwargs
            })
             if(response){
                    let storedArray = JSON.parse(sessionStorage.getItem('UndoRedo')) || [];
                    let cleanedStr = response.replace(/\s+/g, ' ').trim();
                    storedArray.push(cleanedStr);
                    sessionStorage.setItem('UndoRedo', JSON.stringify(storedArray));
                    sessionStorage.setItem('ReDO', JSON.stringify([]));
                }
        } finally {
            this.env.services.ui.unblock();
        }
        this.action.doAction('studio_reload')
        this.props.close()
    }





















    get existingFields() {
        const selectionFields = Object.entries(this.props.fields)
            .filter(([key, field]) => field.type === "selection" && field.store)
            .map(([key, field]) => ({ name: field.name, string: field.string }));
        return selectionFields
    }



     onInputLabel(ev) {
        if (!this.state.newFieldTechName || this.state.newFieldTechName == this.processTechName(this.state.newFieldLabel)) {
            this.onInputTechName(ev)
        }
        this.state.newFieldLabel = ev.target.value
    }

    onInputTechName(ev) {
        let inputValue = ev.target.value;
        this.state.newFieldTechName = this.processTechName(inputValue);
    }

    processTechName(inputValue) {
        inputValue = inputValue.replace(/ /g, "_");
        inputValue = inputValue.replace(/[^a-zA-Z0-9_]/g, "");
        return inputValue.toLowerCase()
    }


    DefaultValueExistingField(array){
        const result = array.map(item => ({ value: item[0], label:item[1] }));
        return result
    }

    handleDefaultValueExisting(value) {
        this.commonValues.defaultValue = value;
    }

    get defaultValueExistingField() {
        return this.commonValues.defaultValue
     }

    get DefaultValueNewField(){
        const arr = []
        for(let value in this.state.selectionValues){
            const obj = { value : this.state.selectionValues[value] ,label:this.state.selectionValues[value] }
            arr.push(obj)
        }
        return arr
    }

    handleDefaultValueNewField(value) {
        this.commonValues.defaultValue = value;
    }

    get defaultValueNewField() {
        return this.commonValues.defaultValue
     }


    actionWarning(message) {
        return this.action.doAction({
            'type': 'ir.actions.client',
            'tag': 'display_notification',
            'params': {
                    'message': message,
                'type': 'warning',
                'sticky': false,
            }
        })
    }

    onDiscard() {
        this.props.close();
    }

}