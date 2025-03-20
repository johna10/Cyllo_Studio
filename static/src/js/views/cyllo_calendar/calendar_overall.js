/** @odoo-module **/
import { Component } from "@odoo/owl";
import { sortBy } from "@web/core/utils/arrays";
import { CylloStudioDropdown } from "@cyllo_studio/js/view_editor/dropdown/CylloStudioDropdown";
import { MultiSelectDropDown } from "@cyllo_studio/js/view_editor/dropdown/multi_select_dropdown/multi_select_dropdown";

export class CalendarOverall extends Component {
  static template = "cyllo_studio.CalendarOverall";
  setup() {
    console.log("asdsadsadsadsad");
  }
  openDialog() {
    console.log("asdsadsadsadsad");
  }
  onDisplayModeChange() {
    console.log("asdsadsadsadsad");
  }
  get scales() {
    return { day: "Day", week: "Week", month: "Month", year: "Year" };
  }

  updateCalender() {
    console.log("asdsadsadsadsad");
  }
  get dateFields() {
    const dateFields = [];
    for (const [fieldName, field] of Object.entries(this.props.mode.fields)) {
      if (["date", "datetime"].includes(field.type)) {
        dateFields.push({ value: fieldName, label: field.string });
      }
    }
    return sortBy(dateFields);
  }
}
CalendarOverall.components = {
  CylloStudioDropdown,
  MultiSelectDropDown,
};
