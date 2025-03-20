/** @odoo-module **/
import { DomainSelectorDialog } from "@web/core/domain_selector_dialog/domain_selector_dialog";
import { _t } from "@web/core/l10n/translation";
import { useState, onWillStart,useRef } from "@odoo/owl";
import { MultiRecordSelector } from "@web/core/record_selectors/multi_record_selector";
import { ExpressionEditorDialog } from "@web/core/expression_editor_dialog/expression_editor_dialog";
import { useService, useOwnedDialogs } from "@web/core/utils/hooks";
import { CheckBox } from "@web/core/checkbox/checkbox";
//import {MultiSelectDropDown} from "@cyllo_studio/components/multi_select_dropdown/multi_select_dropdown";
import { Domain } from "@web/core/domain";
import { CylloStudioDropdown } from "@cyllo_studio/js/view_editor/dropdown/CylloStudioDropdown";

export class FilterDomainSelectorDialog extends DomainSelectorDialog {
  static template = "cyllo_studio.FilterDomainSelectorDialog";
  static components = {
    ...DomainSelectorDialog.components,
    MultiRecordSelector,
//    MultiSelectDropDown,
    CheckBox,
    CylloStudioDropdown,
  };
  static props = {
    ...DomainSelectorDialog.props,
    properties: { type: Object, optional: true },
    allFields: { type: Object },
  };
  setup() {
    super.setup();
    this.rpc = useService("rpc");
    this.addDialog = useOwnedDialogs();
    this.visible = useRef('visible')
    this.notification = useService('notification')
    this.notificationEffect = useService('effect')

    this.state = useState({
      ...this.state,
      label: "",
      invisible: "false",
      groupIds: [],
      field: false,
      defaultValues: ['this_month'],
      type: false,
    });
    onWillStart(() => {
      if (this.props.properties) {
        this.state.label = this.props.properties.label;
        this.state.invisible = this.props.properties.invisible;
        this.state.groupIds = this.props.properties.groupIds;
        if(this.props.properties.fieldName){
          this.state.field = this.props.properties.fieldName
          this.state.type = true
          this.state.domain = '[]'
          this.state.defaultValues = this.props.properties.defaultValues
        }
      }
    });
  }

  get multiSelectDropDown(){
        const allValues = {
          'this_month': 'This Month',
            'last_month': 'Last Month',
            'antepenultimate_month': 'Antepenultimate Month',
            'fourth_quarter': 'Fourth Quarter',
            'third_quarter': 'Third Quarter',
            'second_quarter': 'Second Quarter',
            'first_quarter': 'First Quarter',
            'this_year': 'This Year',
            'last_year': 'Last Year',
            'antepenultimate_year': 'Antepenultimate Year',
        }
        return {
          selectedValues:  this.state.defaultValues,
          allValues,
          onUpdate: (value)=> {
            this.state.defaultValues =  value
          },
          style: "height:60px; max-height:80px; overflow:auto;",
        }
  }

  get dateFields() {
        const dateFields = [];
        for (const [fieldName, field] of Object.entries(this.props.allFields)) {
          if (['date', 'datetime'].includes(field.type)) {
              dateFields.push([fieldName, field.string])
          }
        }
        return dateFields;
  }
  updateGroup(groupIds){
//        this.visible.el.scrollTo({ top: this.visible.el.scrollHeight, behavior: 'smooth' });
        this.state.groupIds = groupIds
  }

  onTypeChange(isChecked){
    this.state.type = isChecked
    if(isChecked){
      this.state.domain = '[]'
    }
  }

  onDomainRadioClick() {
    this.state.invisible = ['False','false', '0'].includes(this.state.invisible) ? "True" : "False";
  }

  // onDomainClick() {
  //   this.addDialog(ExpressionEditorDialog, {
  //     resModel: this.props.resModel,
  //     fields: this.props.allFields,
  //     expression: this.state.invisible,
  //     onConfirm: (expression) => (this.state.invisible = expression),
  //   });
  // }

  escapeLessThanSymbols(str) {
    // Replace all occurrences of '<=' with '&lt;=' first to avoid replacing the '<' part of '<='
    str = str.replace(/<=/g, '&lt;=');
    // Then replace all remaining occurrences of '<' with '&lt;'
    str = str.replace(/</g, '&lt;');
    return str;
  }

  Fields(array){
    const result = array.map(item => ({ value: item[0], label:item[1] }));
    return result
  }

//  get Fields(){
//        const arr = []
//        for(let value in this.props.existingField){
//            const obj = { value : this.props.existingField[value].name ,label:this.props.existingField[value].string }
//            arr.push(obj)
//        }
//    return arr
//    }

   handleFieldChange(value) {
      this.state.field = value
      console.log('niki', this.state.field)
   }

  get defaultField() {
      return this.state.field
  }

  async onConfirm() {
    this.confirmButtonRef.el.disabled = true;
    let domain;
    let isValid;
    try {
      const evalContext = { ...this.user.context, ...this.props.context };
      domain = new Domain(this.state.domain).toList(evalContext);
    } catch {
      isValid = false;
    }
    if (isValid === undefined) {
      isValid = await this.rpc("/web/domain/validate", {
        model: this.props.resModel,
        domain,
      });
    }
    if (!isValid) {
      if (this.confirmButtonRef.el) {
        this.confirmButtonRef.el.disabled = false;
      }
      this.notification.add(_t("Domain is invalid. Please correct it"), {
        type: "danger",
      });
      return;
    }
    if (this.state.type && !this.state.field) {
         this.notificationEffect.add({
            title: _t("Warning"),
            message: "Please select a field.",
            type: "notification_panel",
            notificationType: "warning",
        });
      return;
    } else if(!this.state.type && !this.state.label.trim()){
        this.notificationEffect.add({
            title: _t("Warning"),
            message: "label is required!.",
            type: "notification_panel",
            notificationType: "warning",
        });
      return;
    }
    let properties = {
      string: this.state.label || this.props.allFields[this.state.field]?.string,
      invisible: this.state.invisible,
      groupIds: this.state.groupIds,
    };
    if (this.state.type){
      if(!this.state.field){
        this.notificationEffect.add({
            title: _t("Warning"),
            message: "Please select a field.",
            type: "notification_panel",
            notificationType: "warning",
        });
        return;
      }
      properties.date = this.state.field
      properties.default_period =  this.state.defaultValues.join(',') || 'this_month'
    } else {
      if(!this.state.label.trim()){
         this.notificationEffect.add({
            title: _t("Warning"),
            message: "label is required!.",
            type: "notification_panel",
            notificationType: "warning",
        });
        return;
      }
      properties.domain = this.escapeLessThanSymbols(this.state.domain)
    }
    this.props.onConfirm(properties);
    this.props.close();
  }
}
