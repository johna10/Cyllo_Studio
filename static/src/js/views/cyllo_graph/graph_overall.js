/** @odoo-module **/
import { Component, useState, onMounted } from "@odoo/owl";
import { CylloStudioDropdown } from "@cyllo_studio/js/view_editor/dropdown/CylloStudioDropdown";
import { validateField } from "@cyllo_studio/js/actions/utils";
import { sortBy } from "@web/core/utils/arrays";
import { DropdownItem } from "@web/core/dropdown/dropdown_item";
import { Dropdown } from "@web/core/dropdown/dropdown";
import { AccordionItem } from "@web/core/dropdown/accordion_item";

export class GraphOverall extends Component {
  static template = "cyllo_studio.GraphOverall";
  setup() {
    console.log("GraphOverall", this);
    this.state = useState({
      New: true,
    });
    onMounted(() => {
      const fields = [];
      for (const [fieldName, field] of Object.entries(this.props.allFields)) {
        if (validateField(fieldName, field)) {
          fields.push(
            Object.assign(
              {
                name: fieldName,
              },
              field
            )
          );
        }
      }
      this.fields = sortBy(fields, "string");
    });
  }
  get sortGraph() {
    const values = ["ASC", "DESC"];
    const labels = ["Ascending", "Descending"];
    return values.map((value, index) => ({
      value: value,
      label: labels[index],
    }));
  }
  get graphIcons() {
    const ICONCLASS = {
      bar: "ri-bar-chart-fill",
      line: "ri-line-chart-line",
      pie: "ri-pie-chart-fill",
      doughnut: "ri-donut-chart-fill",
      scatter: "ri-bubble-chart-line",
      bubble: "ri-bubble-chart-fill",
      polarArea: "ri-pie-chart-line",
      radar: "ri-flow-chart",
    };
    return ICONCLASS;
  }

  updateOrder() {
    console.log("updateOrder");
  }

  handleGroupBy() {
    this.state.New = false;
  }
}
GraphOverall.components = {
  CylloStudioDropdown,
  Dropdown,
  DropdownItem,
  AccordionItem,
};
