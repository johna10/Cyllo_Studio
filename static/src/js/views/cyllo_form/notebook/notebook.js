/** @odoo-module */
import {Notebook} from "@web/core/notebook/notebook";
import {useService} from "@web/core/utils/hooks";
import { handleUndoRedo } from "@cyllo_studio/js/utils/undo_redo_utils";

const {useRef, onMounted} = owl;

export class CylloNotebook extends Notebook {
    static template = "cyllo_studio.Notebook";
    setup() {
        super.setup()
        this.pageRef = useRef('cy-Page')
        onMounted(this.onMounted)
        this.action = useService("action");
        }
    onMounted() {
      const self = this
      const page = this.pageRef.el
      console.log("qwewrerer",this.pageRef.el)
      var drake = dragula([page], {
            revertOnSpill: true,
            moves: (el, container, handle) => {
                return !el.classList.contains('add-page');
            },
            accepts: (el, target, source, sibling) => {
                return sibling
            }
        }).on('drop', async (el, target, source, sibling) => {
            const view_id = self.env.config.viewId
            const pagePath = el.getAttribute('cy-xpath');
            const siblingPath = sibling.getAttribute('cy-xpath');
            const sourcePath = source.getAttribute('cy-xpath');

            const path = siblingPath || sourcePath;
            const position = siblingPath ? 'before' : 'inside';
            self.env.services.ui.block();
            const response = await self.env.model.rpc("cyllo_studio/move/page", {
                method: 'move_page',
                model: self.env.model.action.currentController.action.res_model,
                view_id: self.env.config.viewId,
                args: [],
                kwargs: {
                    path,
                    position,
                    pagePath,
                    model: self.env.model.action.currentController.action.res_model,
                    view_id: view_id ? view_id : null,

                }
            })
           if(response){
                handleUndoRedo(response)
            }
            self.env.services.ui.unblock();
            self.action.doAction('studio_reload')
        });
    }
    async addNewPage(e) {
        console.log("new page ",e)
        const self = this
        const view_id = self.env.config.viewId
        var parent = event.target.closest('.cy-add-page');
        console.log("viewww",view_id)
        console.log("viewww",parent.parentNode)
        console.log("viewww",self.env.config.viewId)
        console.log("viewww",self.env.config.viewType)
        console.log("viewwwviewww",parent.parentNode.getAttribute('cy-xpath'))
        parent.insertAdjacentHTML('beforebegin', '<li class="nav-item flex-nowrap cursor-pointer"><a class="nav-link" href="#" role="tab" tabindex="0" name="">New Page</a></li>');
        this.env.services.ui.block();
        const response = await this.env.model.rpc("cyllo_studio/add/page", {
            method: 'add_page',
            model: this.env.model.action.currentController.action.res_model,
            view_id: self.env.config.viewId,
            view_type: self.env.config.viewType,
            args: [],
            kwargs: {
                path: parent.parentNode.getAttribute('cy-xpath'),
                model: this.env.model.action.currentController.action.res_model,
                view_id: view_id ? view_id : null,

            }
        })
       if(response){
          handleUndoRedo(response)
        }
        this.env.services.ui.unblock();
        this.env.model.action.doAction('studio_reload')
    }
    onSelectPage(e) {
           console.log("gggggggggggg",this.props)
           console.log("gggggggggggg",this.props.slots[this.state.currentPage])
//        let autofocus = false;
//        Object.values(this.props.slots).forEach(value => {
//         if(value.autofocus){
//            autofocus = true
//         }
//        });
//        this.env.bus.trigger("Studio:NotebookChanged")
//        if (e.isTrusted) {
//            let newPath = this.props.slots[this.state.currentPage].cyXpath
//            sessionStorage.setItem('cylloActivePagePath', newPath);
//            const elements = document.querySelectorAll('.border-class');
//            if (!e.target.parentElement.classList.contains('nav-tabs')) {
//                elements.forEach(e => {
//                    e.classList.remove('border-class');
//                });
//                e.target.parentElement.classList.add('border-class')
//
//            }
            this.env.bus.trigger('SELECT_NOTEBOOK', {
                    properties: this.props.slots[this.state.currentPage],
                    type:"notebook_details",
//            autofocus: autofocus
            });
//        }

    }


}
CylloNotebook.props = {
    ...Notebook.props,
    cyXpath: {type: String, optional: true},
    groups: {type: String, optional: true},
    autofocus: {type: String, optional: true},
    invisible: {type: String, optional: true},
};
Notebook.template = 'cyllo_studio.Notebook'
