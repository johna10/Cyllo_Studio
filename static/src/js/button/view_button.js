/** @odoo-module **/
import { ViewButton } from "@web/views/view_button/view_button";
import { patch } from "@web/core/utils/patch";
import { useService } from "@web/core/utils/hooks";
import {_t} from "@web/core/l10n/translation";
import {
    useState,
} from "@odoo/owl";
patch(ViewButton.prototype, {
  async setup() {
    console.log("qposjdf",this)
    super.setup();
    this.state = useState({
                 ...this.state,
                    labelReadOnly: false,
    });

    this.rpc = useService("rpc");
    this.orm = useService("orm");

    this.notification = useService('effect')
  },
  isStriped(){
    return this.props.attrs?.striped || this.props.striped ? 'cy-studio-striped' : ''
  },


  async onClick(ev) {
    const buttonEl = ev.target.closest('.cy-listBtn')

    console.log("ccccccc",this)
    const buttonProperties = {
        string: this.props.string,
        function_type: this.props.clickParams.type,
        class: this.props.className,
        name: this.props.clickParams.name,
        groupIds: [],
        invisible: this.props.attrs.invisible,
        icon: this.props.icon,
        element: ev.target,
        path:this.props.attrs["cy-xpath"],
        stringPath:this.props.attrs["stringPath"],
    };
    if (this.props.attrs.groups) {
        buttonProperties.groupIds = await this.rpc(
          "cyllo_studio/find/groups",
          {
            groups: this.props.attrs.groups ?  this.props.attrs.groups : null,
          }
        );
      }

  if (this.props.className.includes("oe_stat_button")) {
                   console.log("qwrtttttt",this)

      this.env.bus.trigger("SMART_BUTTON_DETAILS", {
        type: "smartbuttonProperties",
        properties:buttonProperties,
        new_button:false,



      });
  }
    else{
        this.env.bus.trigger("BUTTON_DETAILS", {
              type: "ButtonProperties",
              ...buttonProperties,

          });
    }
  },
});
ViewButton.props = [...ViewButton.props, "cyXpath?", "striped?"];

