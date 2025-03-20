/** @odoo-module **/
import { Component, useState, onMounted } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { DropdownItem } from "@web/core/dropdown/dropdown_item";
import { Dropdown } from "@web/core/dropdown/dropdown";
import { AccordionItem } from "@web/core/dropdown/accordion_item";
import { _t } from "@web/core/l10n/translation";
import { validateField } from "@cyllo_studio/js/actions/utils";
import { sortBy } from "@web/core/utils/arrays";

export class PivotOverall extends Component {
	static template = "cyllo_studio.PivotOverall";
	setup() {
        this.notification = useService("effect");
        this.action = useService("action");
        this.rpc = useService("rpc");
        console.log('asdas324ewdsas',this)
		this.state = useState({
			addNew: true,
			columnGroup: this.props.mode.colGroupBys ?  this.props.mode.colGroupBys[this.props.mode.colGroupBys.length - 1] : " ",
			rowGroup: this.props.mode.rowGroupBys ? this.props.mode.rowGroupBys[this.props.mode.rowGroupBys.length - 1] : " ",
			measure: this.props.mode.activeMeasures[0],
            colGroupBys: this.props.mode.colGroupBys,
            rowGroupBys: this.props.mode.rowGroupBys,
            activeMeasures: this.props.mode.activeMeasures,
		})
		onMounted(()=>{
             const fields = [];
             if(this.props.activeFields){
              for (const [fieldName, field] of Object.entries(
                this.props.activeFields
              )) {
                if (validateField(fieldName, field)) {
                  fields.push(Object.assign({ name: fieldName }, field));
                }
              }
              this.fields = sortBy(fields, "string");
             }
		})


	}

    handleInputGrouping(type) {
        this.state.addNew = false;
        this.state[type].push("");
    }
    async updatePivot(name, item_type, interval = ""){
           try {
            const response = await this.rpc("cyllo_studio/pivot/edit_element", {
            args: [
                this.props.model,
                this.props.view_type,   // The view type (e.g., 'pivot')
                this.props.viewId,      // The view ID
            ],
            kwargs: {
                name: name,             // Name of the element
                item_type: item_type,   // Type of the item (e.g., field, measure)
                interval: interval,     // Interval value (e.g., for time ranges)
            },
        });
        } finally{
             this.notification.add({
                title: _t("Success"),
                message: "Changes Added.",
                description: "Exit Studio Mode To View Changes",
                type: "notification_panel",
                notificationType: "success",
            });
        window.location.reload();        }
    }
    async handleRemoveGroup(type, index, name, rowGroupBys) {
        const path = this.props.envModel.model?.metaData[type][index];
//        if (!path) {
//            this.state[name].pop()
//            this.state.addNew = true;
//            this.state.recordChange = false
//            return;
//        }
        this.env.services.ui.block();
        try {
            this.state[name].splice(index, 1);
            const response = await this.rpc("cyllo_studio/pivot/remove_element", {
                model: this.props.model,
                view_type: this.props.viewType,
                view_id: this.props.viewId,
                path,
            });
            if (response) {
                let storedArray = JSON.parse(sessionStorage.getItem('UndoRedo')) || [];
                let cleanedStr = response.replace(/\s+/g, ' ').trim();
                storedArray.push(cleanedStr);
                sessionStorage.setItem('UndoRedo', JSON.stringify(storedArray));
                sessionStorage.setItem('ReDO', JSON.stringify([]));
            }
        } finally {
            this.state.addNew = true
            this.state.recordChange = false
            this.env.services.ui.unblock();

        }
        try {
            this.notification.add({
                title: _t("Success"),
                message: "Changes Added.",
                description: "Exit Studio Mode To View Changes",
                type: "notification_panel",
                notificationType: "success",
                time: 1000,
            });
        } finally {
            this.action.doAction('studio_reload');
        }

    }


}
PivotOverall.components = {
  Dropdown,
  DropdownItem,
  AccordionItem,
};