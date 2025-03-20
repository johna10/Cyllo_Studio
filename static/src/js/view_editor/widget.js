/** @odoo-module */
import {
	registry
} from "@web/core/registry";

export function widget() {
	const content = registry.subRegistries.fields.content
    let keysToExclude = ["analytic_distribution","profiling_qweb_view","property_tags"
    ,"gauge","name_with_subtask_count","stock_rescheduling_popover","replenishment_history_widget",
    "lead_days_widget","code","iframe_wrapper","dashboard_graph","form.email","form.phone",
    "form.url","DynamicModelFieldSelectorChar","domain","payment","timepicker",'popover_widget'
    ];


    let filteredObject = Object.fromEntries(
        Object.entries(content).filter(item => !keysToExclude.includes(item[0]))
    );
	return filteredObject
}
registry.category("cyllo_studio_widget_list").add("widget_list", widget());