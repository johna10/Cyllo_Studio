/** @odoo-module **/
import { KanbanRecord } from "@web/views/kanban/kanban_record";
const {useState, onMounted, useRef} = owl;
import {CylloKanbanCompiler} from "./cyllo_kanban_compiler";

export const scaleMapping = {
    '50%': 0.5,
    '100%': 1,
    '150%': 1.5,
    '200%': 2,
    '250%': 2.5,
    '300%': 3,
};

export class CylloKanbanRecord extends KanbanRecord {
    setup() {
        super.setup();
        this.state = useState({
            ...this.state,
            scale: 1,
        })
    }

    handleSelectField(el) {
        const getRestrictAttribute = (el, level = 0) => {
            if (level > 5 || !el) {
                return false; // Stop the recursion if level exceeds 5 or no element is found
            }            const isRestricted = el.getAttribute('data-restrict');
            console.log(el, isRestricted, "isRestricted", !!isRestricted)
            if (isRestricted) {
                return !!isRestricted;
            }
            return getRestrictAttribute(el.parentElement, level + 1);
        }
        const name = el.target.getAttribute("name") || el.srcElement.parentElement.getAttribute('name')
        console.log("1111111",this.props.record.fields)
        console.log("11111222",this.env.config.viewType)
        console.log("11113333",this.props.list.activeFields)
        console.log("11113333",this.action.currentController.props.resModel)
        console.log("11113333",name)
        console.log("pathth",el.target)
        console.log("11113333", el.target.getAttribute("invisible"))
                console.log("11113333", getRestrictAttribute(el.target))
                console.log("11113333",  !!el.target.getAttribute("field-tag")

)
        if ( name ) {
            this.env.bus.trigger('KANBAN_FIELD_DETAILS', {
                view_id: this.env.config.viewId,
                view_type: this.env.config.viewType,
                active_fields: this.props.list.activeFields,
                model: this.action.currentController.props.resModel,
                name:   name,
                path:  el.target.getAttribute("cy-xpath") || el.target.parentElement.getAttribute('cy-xpath'),
                invisible: el.target.getAttribute("invisible"),
                isRestricted:  getRestrictAttribute(el.target) ,
                isFieldTag:  !!el.target.getAttribute("field-tag"),
                type:"kanbanfieldproperties",
                allfields:this.props.record.fields,

            });
        }
    }
}

CylloKanbanRecord.components = {
  ...KanbanRecord.components,
};
CylloKanbanRecord.Compiler = CylloKanbanCompiler;
CylloKanbanRecord.template = "cyllo_studio.KanbanRecord";
