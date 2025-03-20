/** @odoo-module **/
import { Component, useState, onMounted } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
const ICONCLASS = {
  list: "ri-align-justify",
  form: "ri-profile-line",
  activity: "ri-time-line",
  search: "ri-search-eye-line",
  kanban: "ri-bar-chart-2-fill",
  calendar: "ri-calendar-2-fill",
  pivot: "ri-table-2",
  gantt: "fa fa-tasks",
  graph: "ri-line-chart-line",
  map_view: "fa fa-map-marker",
};

const ViewTypes = [
  "list",
  "kanban",
  "form",
  "activity",
  "graph",
  "pivot",
  "search",
  "calendar",
];

export class ViewSelectionDropDown extends Component {
  static template = "cyllo_studio.ViewSelectionDropDown";
  setup() {
    this.state = useState({
      activatedViews: {},
    });
    this.ViewTypes = ViewTypes;
    this.viewIcons = ICONCLASS;
    this.actionService = useService("action");

    onMounted(async () => {
      await this.env.bus.addEventListener("ACTIVE-VIEWS", ({ detail }) => {
        this.state.activatedViews = detail.views;
      });
    });
  }
  onViewClicked(view) {
    this.actionService.switchView(view[1]);
    this.props.viewChange("editButton", true);
    this.props.viewChange("edit", false);
    this.props.viewChange("viewChanged", true);
    sessionStorage.removeItem("cyStudioSearch");
  }
  onSearchClick() {
    this.env.bus.trigger("SEARCH_CLICKED");
    this.props.viewChange("editButton", false);
  }
}
