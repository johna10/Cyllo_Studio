/** @odoo-module **/
import { CalendarRenderer } from "@web/views/calendar/calendar_renderer";
import { onMounted } from "@odoo/owl";

export class cylloCalendarRenderer extends CalendarRenderer {
  setup() {
    super.setup();
    console.log("sadasdsadsadasd", this);
    onMounted(() => {
      this.env.bus.trigger("CALENDAR_DETAILS", {
        model: this.props.model.meta.resModel,
        viewId: this.env.config.viewId,
        viewType: this.env.config.viewType,
        mode: this.props.model.meta,
        activeFields: this.props.model.meta.activeFields,
      });
    });
  }
}
