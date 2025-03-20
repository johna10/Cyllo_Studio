/** @odoo-module **/
import { Component, useState,onWillUpdateProps } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { FieldProperties } from "@cyllo_studio/js/view_editor/aside_bar/properties/field_properties/field_properties";
import { ButtonProperties } from "@cyllo_studio/js/view_editor/aside_bar/properties/button_properties/button_properties";
import { OverallView } from "@cyllo_studio/js/view_editor/aside_bar/overall_view/overall_view";
import { ExistingFieldProperties } from "@cyllo_studio/js/view_editor/aside_bar/properties/existing_field_properties/existing_field_properties";
import { KanbanFieldProperties } from "@cyllo_studio/js/view_editor/aside_bar/properties/field_properties/kanban_field_details";
import { RibbonProperties } from "@cyllo_studio/js/view_editor/kanban/ribbon_properties";
import { TextProperties } from "@cyllo_studio/js/view_editor/kanban/text_properties";
import { StatusBarButtons } from '@web/views/form/status_bar_buttons/status_bar_buttons';
import { MultiRecordSelector } from "@web/core/record_selectors/multi_record_selector";
import { PageProperties } from "@cyllo_studio/js/views/cyllo_form/page/page_properties";
import { SmartButtonProperties } from "@cyllo_studio/js/views/cyllo_form/smart_button/smart_button_properties";


export class AsideBar extends Component {
  static template = "cyllo_studio.AsideBar";
  static props = {
    type: { type: String },
    handleView: { type: Function, optional: true },
    overall: { type: Object, optional: true },
    viewDetails: { type: Object, optional: true },
    fieldProperties: { type: Object, optional: true },
    kanbanComponent: { type: Object, optional: true },
    noteBookProperties:{ type: Object, optional: true },
    SmartButtonProperties:{ type: Object, optional: true },
    isAnimating:{ type: Boolean, optional: true },
    ButtonDetails:{ type: Object, optional: true },
  };
  setup() {
    console.log("thismmmmmmmmmmmmmmmmmmm",this)
    this.actionService = useService("action");
    this.action = useService("action");
    this.orm = useService("orm");
    this.state = useState({
      viewProperty: this.props.type,
    });
    onWillUpdateProps((nextProps) => {

        console.log("asdasdasdasdas",nextProps)

        });
  }
  get overallProps() {
    return {
      ...(this.props.overall || {}),
      ...(this.props.viewDetails || {}),
    };
  }
  get fieldPropertiesProps() {
    return {
      ...(this.props.viewDetails || {}),
      ...(this.props.fieldProperties || {}),
    };
  }
  get kanbanfieldPropertiesProps() {
    return {
      ...(this.props.viewDetails || {}),
      ...(this.props.fieldProperties || {}),

    };
  }
  get KanbanComponentProps() {
     console.log("ddddd",this.props.kanbanComponent)
     console.log("ddddd",this.props.viewDetails)
    return {
      ...(this.props.kanbanComponent || {}),
      viewDetails:{...(this.props.viewDetails || {})},

    };
  }
  async closeSidebar(){
   		this.env.bus.trigger('CLEAR-MENU',{ fromClose: true });

  }
  get noteBookPropertiesProps() {
         console.log("ddddd",this.props.noteBookProperties)

    return {
      ...(this.props.noteBookProperties || {}),
      viewDetails:{...(this.props.viewDetails || {})},

    };
  }
  get SmartButtonPropertiesProps() {
     console.log("wwwwwwwwww",this.props.SmartButtonProperties)
    return {
      ...(this.props.SmartButtonProperties || {}),
      viewDetails:{...(this.props.viewDetails || {})},

    };
  }
  get ButtonPropertiesProps() {
     console.log("wwwwwwwwww")
    return {
      ...(this.props.ButtonDetails || {}),
      viewDetails:{...(this.props.viewDetails || {})},

    };
  }

  get viewDetails() {
    return { ...(this.props.viewDetails ?? {}) };
  }
  get propsType() {

    return (
      this.props.type === "Properties" || this.props.type === "ButtonProperties" || this.props.type =="ribbon"  || this.props.type =="button" || this.props.type==="text"
    );
  }
}
AsideBar.components = {
  FieldProperties,
  OverallView,
  ButtonProperties,
  ExistingFieldProperties,
  KanbanFieldProperties,
  RibbonProperties,
  TextProperties,
  MultiRecordSelector,
  PageProperties,
  SmartButtonProperties,

};
