/** @odoo-module **/
import { FormLabel } from "@web/views/form/form_label";
import { registry } from "@web/core/registry";

export class CylloFormLabel extends FormLabel {
    static template = 'cyllo_studio.FormLabel'
    setup() {
        super.setup();
        console.log("qwwwweerty")
        this.content = registry.category("cyllo_studio_widget_list").get("widget_list")
    }
  onItemClick(e) {

    console.log("myggggggggggggg",this.props.fieldInfo.MainPath)
      this.env.bus.trigger("FIELDS_DETAILS", {
           type: "Properties",
           path:this.props.fieldInfo.MainPath,
           name:this.props.fieldInfo.name || "",
           label: this.props.string || "",
           fieldType: this.props.fieldInfo.type || "",
           placeholder:this.props.fieldInfo.attrs.placeholder||"",
           help:this.props.fieldInfo.help || "",
           edit:true,
      });
    }

}
CylloFormLabel.props = {
    ...FormLabel.props,
    cyXpath: {
        type: String,
        optional: true
    },
};
