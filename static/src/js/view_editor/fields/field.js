/** @odoo-module **/
import { Component, useState, onMounted } from "@odoo/owl";
import {Field} from "@web/views/fields/field";
import {useService} from "@web/core/utils/hooks";
import { patch } from '@web/core/utils/patch';
patch(Field, {
    parseFieldNode() {
        console.log("OoOOoo33")
        let data = super.parseFieldNode(...arguments)
        const MainPath = arguments[0].getAttribute("cy-xpath");
        data.MainPath = MainPath
        data.striped = arguments[0].getAttribute("striped") ? "cy-studio-striped" : ""
        return data
    }
});
export class CylloField extends Field {
    static template = 'cyllo_studio.Field'
    setup() {
        super.setup();
        console.log("jkjkjk", this)
        this.rpc = useService("rpc");
        this.action = useService("action");
//        this.fieldRef = useRef('fieldRef')
        this.orm = useService("orm");
        this.FieldPlaceholder = false;
        this.state = useState({
            viewActionid: true,
        });
        this.cyStudioReadonly = ["ir.model.access", "ir.rule"].includes(this.action.currentController?.action.res_model)
        onMounted(async () => {
            this.CyX2Many = sessionStorage.getItem('CyX2ManyPath')
            if (this.CyX2Many && this.props.fieldInfo.MainPath == this.CyX2Many) {
                this.CyX2ManyClick(this.fieldComponentProps?.viewMode)
            }
        });
    }
    async onItemClick(e) {
         console.log("POKKKKKKKKKKKKKKKKKKKKKKKKK",this)
         console.log("POKKKKKKKKKKKKKKKKKKKKKKKKK",this.fieldComponentProps.visibleSelection)
         console.log("POKKKKKKKKKKKKKKKKKKKKKKKKK",this.props.fieldInfo.viewType)
         console.log("POKKKKKKKKKKKKKKKKKKKKKKKKK",this.content)
         const element = e.target;
         let  item_path="";
         let  has_multipath="";

        const targetElement = e.target.parentElement;
        const parentDiv = targetElement.closest('.o_wrap_field');
//        if (element) {
//            let parent = element;
//            item_path = parent.firstElementChild.getAttribute("cy-xpath") || "";
//            has_multipath = false;
//            if (!item_path) {
//                let child = parent.firstElementChild;
////                if (child.firstElementChild.nodeName == "BUTTON") {
//                    item_path = child.firstElementChild.getAttribute("cy-xpath");
////                }
////                 else {
//                    has_multipath = true;
//                    item_path = {
//                        first_path: child.firstElementChild.getAttribute("cy-xpath"),
//                        second_path:
//                            child.nextElementSibling?.firstElementChild.getAttribute("cy-xpath"),
////                    };
//                    if (!item_path.second_path) {
//                        has_multipath = false
//                        item_path = item_path.first_path
//                    }
//                }
//            }
//        }
        if (parentDiv || this.props.fieldInfo.viewType === 'form') {
           let item_path=""
           item_path=   element.getAttribute("cy-xpath") || "";
           console.log("aweqwwerw", this)
           console.log("aweqwwerw", this.props.fieldInfo)
           this.env.bus.trigger('FIELDS_DETAILS', {
                  name: this.props.fieldInfo.name || "",
                  label: this.props.fieldInfo.string || "",
                  widget: this.props.fieldInfo.widget || "",
                  fieldType: this.props.fieldInfo.type || "",
                  context: this.props.fieldInfo.context || "",
                  domain: this.props.fieldInfo.domain || "",
                  type: "Properties",
                  cy_path :this.props.fieldInfo.attrs["cy-xpath"] || "",
                  placeholder:this.props.fieldInfo.attrs["placeholder"] || "",
                  help:this.props.fieldInfo.help || "",
                  invisible:this.props.fieldInfo.attrs["invisible"] || "",
                  required :this.props.fieldInfo.required||"",
                  readonly: this.props.fieldInfo.readonly || "",
                  edit:true,


            });


        }

    }
    onViewModeClick () {
        console.log("onViewModeClick")
    }
}
console.log("jkjkjk11", CylloField.parseFieldNode)
console.log("jkjkjk22", Field.parseFieldNode)
//CylloField.template = "cyllo_studio.Field";
//CylloField.parseFieldNode = function (node, models, modelName, viewType, jsClass) {
////    const result = BaseField.parseFieldNode.call(this, node, models, modelName, viewType, jsClass);
//    let data = BaseField.parseFieldNode.call(...arguments)
//    console.log("OoOOoo22", data)
//    return data
//}

