/** @odoo-module **/
import {KanbanController} from "@web/views/kanban/kanban_controller";
import {
    KANBAN_BOX_ATTRIBUTE,
    KANBAN_MENU_ATTRIBUTE,
    KANBAN_TOOLTIP_ATTRIBUTE,
} from "@web/views/kanban/kanban_arch_parser";
import { Layout } from "@web/search/layout";
import {onWillStart, onMounted, useRef} from "@odoo/owl";
import {useService} from "@web/core/utils/hooks";
import { serializeXML } from "@web/core/utils/xml";
import { session } from "@web/session";
import { addFieldDependencies, extractFieldsFromArchInfo } from "@web/model/relational_model/utils";


export class CylloKanbanController extends KanbanController {
    setup() {
        super.setup();
        this.rpc = useService('rpc')
        this.dialogService = useService("dialog");
        this.action = useService("action");
        onWillStart(async ()=>{
        if(!this.env.config.viewId){
                await this.rpc('cyllo_studio/form/add/kanban_view',{
                    arch: serializeXML(this.props.arch),
                    model: this.props.resModel,
                })
                await this.action.doAction('studio_reload')
            }
        })
        onMounted(async () => {
            const ribbonElement = document.querySelectorAll('[data-ribbon="1"]')
//            const field = this.props.archInfo.colorField
//            if(this.props.fields.hasOwnProperty(field)){
//                hasColorPicker = true
//            }
            const colorPickerEL = this.props.arch.querySelector("templates .oe_kanban_colorpicker[data-field]")
            const hasColorPicker = !!colorPickerEL
            const colorPickerPath = colorPickerEL ? colorPickerEL.getAttribute('cy-xpath') : ''
            this.env.bus.trigger('kanbanDetails', {
                view_type: this.env.config.viewType,
                model: this.model.env.searchModel.resModel,
                view_id: this.env.config.viewId,
                fields: this.props.fields,
                isMenu: KANBAN_MENU_ATTRIBUTE in this.props.archInfo.templateDocs,
                hasColorPicker,
                activeFields: this.model.config.activeFields,
                colorPickerPath,
                progressAttributes: this.props.archInfo.progressAttributes,
                ribbonElement: ribbonElement.length == 0 ? false : ribbonElement,
                fieldNodes: this.props.archInfo.fieldNodes,
                attributes: {
                    create: this.props.archInfo.activeActions.create,
                    quickCreate: this.props.archInfo.activeActions.quickCreate,
                    defaultGroupBy: this.props.archInfo.defaultGroupBy,
                    recordsDraggable: this.props.archInfo.recordsDraggable,
                    groupsDraggable: this.props.archInfo.groupsDraggable,
                }
            });
            const { root } = this.model;
            if(root.groups){
                const firstGroup = root.groups[0];
                if (firstGroup?.isFolded) {
                    await firstGroup.toggle();
                }
            }

        })
    }
    get modelParams() {
    const { resModel, archInfo, limit, defaultGroupBy } = this.props;
    const { activeFields, fields } = extractFieldsFromArchInfo(archInfo, this.props.fields);
    addFieldDependencies(activeFields, fields, this.progressBarAggregateFields);
    const modelConfig = {
        resModel,
        activeFields,
        fields,
        openGroupsByDefault: true,
    } || this.props.state?.modelState?.config;
    return {
        config: modelConfig,
        state: this.props.state?.modelState,
        limit: archInfo.limit || limit || 40,
        groupsLimit: Number.MAX_SAFE_INTEGER, // no limit
        countLimit: archInfo.countLimit,
        defaultGroupBy,
        defaultOrderBy: archInfo.defaultOrder,
        maxGroupByDepth: 1,
        activeIdsLimit: session.active_ids_limit,
        hooks: {
            onRecordSaved: this.onRecordSaved.bind(this),
        },
    };
}
}

CylloKanbanController.components = {
    ...KanbanController.components,
    Layout
}
CylloKanbanController.template = "studio.CylloKanbanController"
