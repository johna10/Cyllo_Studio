/** @odoo-module **/
import {Component, onWillStart, useState} from "@odoo/owl";
import {useService} from "@web/core/utils/hooks";
import {MultiRecordSelector} from "@web/core/record_selectors/multi_record_selector";
//import {MultiSelectDropDown} from "@cyllo_studio/components/multi_select_dropdown/multi_select_dropdown";
import {Dialog} from "@web/core/dialog/dialog";

export class SearchPanelDialog extends Component {
  static template = "cyllo_studio.SearchPanelDialog";
  static components = {
    Dialog,
    MultiRecordSelector,
//    MultiSelectDropDown,
  };
  setup() {
    this.rpc = useService("rpc");
    this.action = useService("action");

    this.state = useState({
      properties: null,
    });

    onWillStart(() => {
        this.state.properties = {...this.props.properties}
    });
  }

  get multiSelectDropDown(){
      const selectedValues = this.state.properties.view_types.filter(value => this.props.views.hasOwnProperty(value));
    return {
      selectedValues,
      allValues: this.props.views,
      onUpdate: (value)=> this.state.properties.view_types = value
    }
  }

  arraysEqual(arr1, arr2){
    // Check if lengths are different
    if (arr1.length !== arr2.length) {
        return false;
    }

    // Create a frequency map for arr1
    const freq1 = {};
    for (let num of arr1) {
        freq1[num] = (freq1[num] || 0) + 1;
    }

    // Check if all elements in arr2 have the same frequency in freq1
    for (let num of arr2) {
        if (!freq1[num]) {
            return false;
        }
        freq1[num]--;
    }

    return true;
}

  async onConfirm() {
    let properties = {
        ...this.state.properties
    };

    properties = Object.keys(properties).reduce((acc, key) => {
      if(Array.isArray(properties[key])){
              if(!this.arraysEqual(properties[key], this.props.properties[key])){
            acc[key] = properties[key];
          }
      } else {
          if (properties[key] != this.props.properties[key]) {
            acc[key] = properties[key];
          }
      }
      return acc;
    }, {});
    if(Object.keys(properties).length){
        this.env.services.ui.block();
        try {
         const response =  await this.rpc("cyllo_studio/search/update/search_panel", {
            path: this.props.path,
            view_id: this.props.viewId,
            model: this.props.model,
            properties,
          });
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
        this.action.doAction("studio_reload");
    }

    this.props.close();
  }
  onDiscard() {
    this.props.close();
  }
}
