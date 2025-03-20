/** @odoo-module **/
import { Component,onWillStart, useRef, useState, onMounted, useEffect  } from "@odoo/owl";
import { useOwnedDialogs, useService } from "@web/core/utils/hooks";
import { registry } from "@web/core/registry";

export class FormOverall extends Component {
  static template = "cyllo_studio.FormOverall";
   setup() {
        this.rpc = useService("rpc");
        this.addDialog = useOwnedDialogs();
        this.dialogService = useService("dialog");
        this.action = useService("action");
        this.content = registry.category("cyllo_studio_widget_list").get("widget_list")
        this.notification = useService('effect')
        this.state = useState({
			create: this.props.mode.activeActions?.create || this.props.mode.create,
			edit: this.props.mode.activeActions?.edit || this.props.mode.edit,
			delete: this.props.mode.activeActions?.delete || this.props.mode.delete,
            invisible: false,
            position: this.props.mode.editable || "",
            massedit: this.props.mode.multiEdit,
            view: "",
			active_field: this.props.mode.defaultOrder?.[0]?.name || null,
			orders: this.props.mode.defaultOrder?.[0]?.asc,
            groupBy: this.props.mode.defaultGroupBy,
            showLink: this.props.mode.openFormView,
            view_type: this.props.x2many  ? (this.props.x2many === 'list' ? 'tree' : 'kanban')  : this.props.view_type,
            isChatterAvailable: true,
    		hasChatter: this.props.isChatterAvailable,
            isNotebookPageChange: true,
            fieldDropped: false,
            Reset: true,
        });


    onWillStart(() => {

        });
        onMounted( async() => {

        });

        useEffect(() => {
            const self = this
            const forms = document.getElementsByClassName('o_form_sheet')
            const form_tabs = document.getElementsByClassName('tab-pane')
            const innerGroup = document.getElementsByClassName('o_inner_group')
            const component = document.getElementById('cyComponents')
            const componentElement = document.getElementById('cyComponents-elements-1')
            const componentElement2 = document.getElementById('cyComponents-elements-2')
            const chatterComponent = document.getElementById('chatterComponent')
            const form = forms ? forms[0] : forms
            const col1 = '<div class="o_inner_group grid dd-container border-class py-2"></div>'
            const col2 = '<div class="o_group row align-items-start"><div class="o_inner_group grid dd-container border-class col-lg-6 py-2"></div><div class="o_inner_group grid dd-container border-class col-lg-6 py-2"></div></div>'
            const tab = '<div class="o_notebook d-flex w-100 horizontal flex-column"><div class="o_notebook_headers"><ul class="nav nav-tabs flex-row flex-nowrap"><li class="nav-item flex-nowrap cursor-pointer"><a class="nav-link active" href="#" role="tab" tabindex="0" name="">New Page</a></li><li class="nav-item flex-nowrap cursor-pointer"><a class="nav-link ri-add-line"></a></li></ul></div><div class="o_notebook_content tab-content"><div class="tab-pane active"></div></div></div>'
            const x2many = '<div class="o_field_widget o_field_one2many"><div class="o_list_view o_field_x2many o_field_x2many_list"><div class="o_x2m_control_panel d-empty-none mb-4"></div><div class="o_list_renderer o_renderer table-responsive o_list_renderer_5 col-12" tabindex="-1" style=""><table class="o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped" style="table-layout: fixed;"><thead><tr><th tabindex="-1" class="align-middle o_column_sortable position-relative cursor-pointer o_list_number_th o_handle_cell opacity-trigger-hover" style="width: 33px;"></th><th tabindex="-1" class="align-middle o_column_sortable position-relative cursor-pointer opacity-trigger-hover" style="width: 33.33%;"><div class="d-flex"><span class="d-block min-w-0 text-truncate flex-grow-1">Product</span><i class="fa fa-lg fa-angle-down opacity-0 opacity-75-hover"></i></div><span class="o_resize position-absolute top-0 end-0 bottom-0 ps-1 bg-black-25 opacity-0 opacity-50-hover z-index-1"></span></th><th tabindex="-1" class="align-middle o_column_sortable position-relative cursor-pointer o_list_number_th opacity-trigger-hover" style="width: 92px;"><div class="d-flex flex-row-reverse"><span class="d-block min-w-0 text-truncate flex-grow-1 o_list_number_th">Quantity</span><i class="fa fa-lg fa-angle-down opacity-0 opacity-75-hover"></i></div><span class="o_resize position-absolute top-0 end-0 bottom-0 ps-1 bg-black-25 opacity-0 opacity-50-hover z-index-1"></span></th><th tabindex="-1" class="align-middle o_column_sortable position-relative cursor-pointer opacity-trigger-hover" style="width: 33.33%;"><div class="d-flex"><span class="d-block min-w-0 text-truncate flex-grow-1">Description</span><i class="fa fa-lg fa-angle-down opacity-0 opacity-75-hover"></i></div><span class="o_resize position-absolute top-0 end-0 bottom-0 ps-1 bg-black-25 opacity-0 opacity-50-hover z-index-1"></span></th><th tabindex="-1" class="align-middle o_column_sortable position-relative cursor-pointer o_list_number_th opacity-trigger-hover" style="width: 92px;"><div class="d-flex flex-row-reverse"><span class="d-block min-w-0 text-truncate flex-grow-1 o_list_number_th">Unit Price</span><i class="fa fa-lg fa-angle-down opacity-0 opacity-75-hover"></i></div><span class="o_resize position-absolute top-0 end-0 bottom-0 ps-1 bg-black-25 opacity-0 opacity-50-hover z-index-1"></span></th><th class="o_list_button" style="width: 33.33%;"></th><th class="o_list_controller o_list_actions_header position-sticky end-0"><div class="o-dropdown dropdown o_optional_columns_dropdown text-center border-top-0 o-dropdown--no-caret"><button type="button" class="dropdown-toggle btn p-0" tabindex="-1" aria-expanded="false"><i class="o_optional_columns_dropdown_toggle oi oi-fw oi-settings-adjust"></i></button></div></th></tr></thead><tbody class="ui-sortable"><tr><td></td><td class="o_field_x2many_list_row_add" colspan="6"><a href="#" role="button" tabindex="0">Add a product</a></td></tr><tr><td colspan="7">​</td></tr><tr><td colspan="7">​</td></tr><tr><td colspan="7">​</td></tr></tbody><tfoot class="o_list_footer cursor-default"><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr></tfoot></table></div></div></div>'
            const chatter = '<div class="o-mail-Form-chatter oe_chatter o-isInFormSheetCy w-auto o-aside"><div class="o-mail-Chatter w-100 h-100 flex-grow-1 d-flex flex-column overflow-auto"><div class="o-mail-Chatter-top position-sticky top-0"><div class="o-mail-Chatter-topbar d-flex flex-shrink-0 flex-grow-0 px-3 overflow-x-auto"><button class="o-mail-Chatter-sendMessage btn text-nowrap me-1 btn-primary my-2" data-hotkey="m"> Send message </button><button class="o-mail-Chatter-logNote btn text-nowrap me-1 btn-secondary my-2" data-hotkey="shift+m"> Log note </button><div class="flex-grow-1 d-flex"><button class="o-mail-Chatter-activity btn btn-secondary text-nowrap my-2" data-hotkey="shift+a"><span>Activities</span></button><span class="o-mail-Chatter-topbarGrow flex-grow-1 pe-2"></span><button class="btn btn-link text-action" aria-label="Search Messages" title="Search Messages"><i class="oi oi-search" role="img"></i></button><span style="display:contents"><button class="o-mail-Chatter-attachFiles btn btn-link text-action px-1 d-flex align-items-center my-2" aria-label="Attach files"><i class="fa fa-paperclip fa-lg me-1"></i></button></span><input type="file" class="o_input_file d-none o-mail-Chatter-fileUploader" multiple="multiple" accept="*"/><div class="o-dropdown dropdown o-mail-Followers d-flex me-1 o-dropdown--no-caret"><button type="button" class="dropdown-toggle o-mail-Followers-button btn btn-link d-flex align-items-center text-action px-1 my-2" title="Show Followers" tabindex="0" aria-expanded="false"><i class="fa fa-user-o me-1" role="img"></i><sup class="o-mail-Followers-counter">1</sup></button></div><button class="btn px-0 my-2 text-success"><div class="position-relative"><span class="d-flex invisible text-nowrap"><i class="me-1 fa fa-fw fa-eye-slash"></i>Following</span><span class="o-mail-Chatter-follow position-absolute end-0 top-0">Following</span></div></button></div></div></div><div class="o-mail-Chatter-content"><div class="o-mail-Thread position-relative flex-grow-1 d-flex flex-column overflow-auto pb-4" tabindex="-1"><div class="d-flex flex-column position-relative flex-grow-1"><span class="position-absolute w-100 invisible top-0" style="height: Min(2500px, 100%)"></span><div class="o-mail-DateSection d-flex align-items-center fw-bolder w-100 pt-4"><hr class="ms-3 flex-grow-1"/><span class="px-3 text-muted">Today</span><hr class="me-3 flex-grow-1"/></div><div class="o-mail-Message position-relative undefined py-1 mt-2 px-3" role="group" aria-label="System notification"><div class="o-mail-Message-core position-relative d-flex flex-shrink-0"><div class="o-mail-Message-sidebar d-flex flex-shrink-0"></div><div class="w-100 o-min-width-0"><div class="o-mail-Message-header d-flex flex-wrap align-items-baseline mb-1 lh-1"><span class="o-mail-Message-author cursor-pointer" aria-label="Open card"><strong class="me-1 text-truncate">CylloBot</strong></span><small class="o-mail-Message-date text-muted opacity-75 me-2" title="4/22/2024, 11:52:51 AM">- 2 hours ago</small></div><div class="position-relative d-flex"><div class="o-mail-Message-content o-min-width-0"><div class="o-mail-Message-textContent position-relative d-flex"><div><div class="o-mail-Message-body text-break mb-0 w-100"><p>Cyllo demo message</p></div></div><div class="o-mail-Message-actions ms-2 mt-1 invisible"><div class="d-flex rounded-1 bg-view shadow-sm overflow-hidden"><button class="btn px-1 py-0 rounded-0" tabindex="1" title="Add a Reaction" aria-label="Add a Reaction"><i class="oi fa-lg oi-smile-add"></i></button><button class="btn px-1 py-0 rounded-0" title="Mark as Todo" name="toggle-star"><i class="fa fa-lg fa-star-o"></i></button></div></div></div></div></div></div></div></div></div></div></div></div></div>'
            const field = '<div class=" new_field o_cell flex-grow-1 o_wrap_label w-100  text-900 cursor-pointer opacity-75"><label class="o_form_label oe_inline">New Field</label></div><div class=" new_field o_cell flex-grow-1 flex-sm-grow-0 cursor-pointer opacity-75" style="width: 100%;"><div class="o_row o_row_readonly"><div name="new_field"><div class="d-inline-flex w-100"><input class="o_input" type="text" autocomplete="off" id="new_field_0" readonly="1"/></div></div></div></div>';
            const dragField = '<label class="text-nowrap">New Field</label>'
            const chatter_add = document.querySelector('.cy-mail-chatter')
            console.log("1111111111111",self)
            console.log("1111122222",forms)
            console.log("1111122222333",form_tabs)
            console.log("111112222233344444",innerGroup)
            console.log("11111222223335555",component)
            console.log("1111122222333444446666",componentElement)
            console.log("111112222233344444",componentElement2)

            if(chatter_add){
                this.state.isChatterAvailable = false
            }
            if (component) {
                var drake = dragula([form,componentElement,componentElement2, component, ...form_tabs,chatterComponent,...innerGroup], {
                    revertOnSpill: true,
                    copy: true,
                    moves: (el, container, handle) => {
                        if([...innerGroup].includes(container)){
                            return false
                        }
                        if(el.classList.contains('cy-chatter-exist')){
                            return false
                        }
                        container.classList.remove("show")
                        return !(container.classList.contains('o_form_sheet') || container.classList.contains('tab-pane') || el.classList.contains('close-menu'));
                    },
                    accepts: function (el, target, source, sibling) {

                        let path = true
                        if(sibling){
                            const siblingPath = sibling ?  sibling?.getAttribute('cy-xpath') : null
                            path  = siblingPath ? true : false
                        }
                        if(el.classList.contains('chatter')){
                            return (target === chatterComponent )
						} else if (el.classList.contains('field')) {
							return (target.classList.contains('o_inner_group') && !sibling?.children[0]?.classList?.contains('o_horizontal_separator') && !sibling?.nextElementSibling?.children[0]?.classList?.contains('o_horizontal_separator'))
						}else if (el.classList.contains('tab')) {
						    return target.classList.contains('o_form_sheet')
						}else {
						    if (sibling && sibling?.getAttribute('cy-xpath')) {
                               return ((target.classList.contains('o_form_sheet') || target.classList.contains('tab-pane') && !target.classList.contains('overall-menu') )&& !sibling?.classList.contains('cy-add-avatar'))
						    } else {
                               return ((target.classList.contains('o_form_sheet') || target.classList.contains('tab-pane') && !target.classList.contains('overall-menu') )&& !sibling?.classList.contains('cy-add-avatar'))
                           }
						}
                    }
                });
                drake.on('drag', function(el, source) {
                      el.classList.add('smooth-drag');

                 if (el.classList.contains('chatter')) {
                    chatterComponent.classList.add('chatterContainer');
                        const dropHereDiv = document.createElement('div');
                        dropHereDiv.textContent = 'Drop Here';
                        dropHereDiv.classList.add('drop-here-container');
                        chatterComponent.appendChild(dropHereDiv);
                 }
                    if (el.classList.contains('chatter') && chatterComponent) {
                        chatterComponent.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }

                });
                drake.on('cloned', function(clone, original, type) {
                        clone.style.color = "black";
                    if(original.classList.contains('field')){
                        clone.classList.add('d-flex', 'gap-2')
                        clone.innerHTML = dragField
                    }

                })
                drake.on('shadow', function(el, container, source) {
                    el.classList.remove('cy-components-column', 'card', 'cy-studio-icon','col-6');
                    if (el.classList.contains('column-1')) {
                        el.innerHTML = col1
                    } else if(el.classList.contains('column-2')){
                        el.innerHTML = col2
                    } else if(el.classList.contains('tab')) {
                        el.innerHTML = tab
                    } else if(el.classList.contains('field')) {
                        el.style.userSelect = 'none';
						el.style.background = 'red';
						el.classList.remove('cy-studio-component-btn', 'cy-studio-move')
						el.classList.add( 'add-fields', 'o_wrap_field', 'd-flex', 'd-sm-contents', 'flex-column', 'mb-3', 'mb-sm-0', 'dd-box', 'cy-container');
                        el.innerHTML = field
                        }else if(el.classList.contains('chatter')) {
                        el.innerHTML = chatter

                        }
                         else {
                            el.innerHTML = x2many
                        }
                }).on("dragend", function(el, container) {
                 if (el?.classList.contains('chatter')) {
                     chatterComponent.classList.remove('chatterContainer');
                     document.querySelector('.drop-here-container').remove()
                    }
                }).on('drop',async function(el, target, source, sibling) {
                    var item = ''
                    var path = target.getAttribute('cy-xpath')
                    self.state.fieldDropped = true
                    var position = 'inside'
                    if(sibling) {
                        path = sibling.getAttribute('cy-xpath')
                        position = 'before'
                    }
					if(el.classList.contains('chatter')){
					    path = '/form'
                           }
                    if (el.classList.contains('column-1')) {
                        el.outerHTML = col1
                        item='<group></group>'
                    } else if(el.classList.contains('column-2')){
                        el.outerHTML = col2
                        item='<group><group></group><group></group></group>'
                    } else if(el.classList.contains('tab')){
                        el.outerHTML = tab
                        item = '<notebook><page string="New Page"></page></notebook>'
					} else if(!el.classList.contains('field')){
                        this.cancel();
                    }
                    if (!item){
                        if(el.classList.contains('tree')){
                        const view_id = self.props.formViewId
                        self.dialogService.add(FormTreeDialog, {
                            resModel:self.action.currentController.props.resModel,
                            onConfirm: async(result)=>{
                                const properties = {
                                    ...result,
                                    path,
                                    position,
                                    resModel:self.action.currentController.props.resModel,
						}

                                self.env.services.ui.block()
                                const tree = self.rpc("cyllo_studio/add/form_tree", {
                                    model: self.action.currentController.props.resModel,
                                    view_id: self.props.formViewId,
                                    view_type: 'form',
                                    kwargs: {...properties,
                                        view_id: view_id ? view_id : null,
                    }
                                }).then((response)=> {
                                    self.env.services.ui.unblock()
                                    if(response){
                                    let storedArray = JSON.parse(sessionStorage.getItem('UndoRedo')) || [];
                                    let cleanedStr = response.replace(/\s+/g, ' ').trim();
                                    storedArray.push(cleanedStr);
                                    sessionStorage.setItem('UndoRedo', JSON.stringify(storedArray));
                                    sessionStorage.setItem('ReDO', JSON.stringify([]));
                                     }
                                    self.action.doAction('studio_reload')
                                }).catch((err)=> {
                                    self.env.services.ui.unblock()
                                    throw err
                                })
                            },
                        });
                            }else{
                       if (el.classList.contains('chatter')) {
                        chatterComponent.classList.remove('chatterContainer');
                         self.env.services.ui.block();
                            try{
                                const position =  "inside"
                                const  add_remove = await self.rpc("cyllo_studio/add_remove/chatter", {
                                   model: self.props.model,
                                   view_id: self.props.formViewId,
                                   path: "/form",
                                   view_type: "form",
                                   position
                                })
                                let storedArray = JSON.parse(sessionStorage.getItem('UndoRedo')) || [];
                                let cleanedStr = add_remove.replace(/\s+/g, ' ').trim();
                                storedArray.push(cleanedStr);
                                sessionStorage.setItem('UndoRedo', JSON.stringify(storedArray));
                                sessionStorage.setItem('ReDO', JSON.stringify([]));
                            } finally {
                                self.env.services.ui.unblock();
    									self.state.hasChatter = false
                              self.action.doAction('studio_reload')
                            }
    							} else if (el.classList.contains('field')) {

								const path = sibling ?
									sibling.firstElementChild?.firstElementChild?.getAttribute('cy-xpath') ||
									sibling.firstElementChild?.getAttribute('cy-xpath') ||
									(sibling.firstElementChild.classList.contains('fa-trash-o') ?
										sibling.nextElementSibling?.firstElementChild?.getAttribute('cy-xpath') ||
										sibling.nextElementSibling?.firstElementChild?.firstElementChild?.getAttribute('cy-xpath') :
										null) : target.getAttribute('cy-xpath');
                            const position = sibling ? 'before' : 'inside'
                                self.env.bus.trigger("AddField",{
                                    widgets: self.content,
                                    activeFields: self.props.active_fields,
                                    parentXpath: path,
                                    existingFields: self.props.fields,
                                    position: position,
                            })
							}
                    }

					}
					else {
                        const view_id = self.props?.formViewId
                        const model = self.action.currentController.action.res_model
                       self.env.services.ui.block()
                       const component =   self.rpc("cyllo_studio/add/component", {
                            method: 'add_component',
                            view_id: view_id,
                            model: model,
                            view_type: 'form',
                            args: [{
                                path:path,
                                position: position,
                                item: item,
                                model: model
                             }],
                            kwargs: {view_id: view_id ? view_id : null,
}
                        }).then((response)=> {
                           self.env.services.ui.unblock()
                               self.action.doAction('studio_reload')
                            let storedArray = JSON.parse(sessionStorage.getItem('UndoRedo')) || [];
                            let cleanedStr = response.replace(/\s+/g, ' ').trim();
                            storedArray.push(cleanedStr)
                            sessionStorage.setItem('UndoRedo', JSON.stringify(storedArray));
                            sessionStorage.setItem('ReDO', JSON.stringify([]));
                                if (sessionStorage.getItem('cylloActivePagePath')) {
                                const newPath = sessionStorage.getItem('cylloActivePagePath')
                                let variable_name = newPath
                                let selector = `[cy-xpath="${variable_name}"]`;
                                let element = document.querySelector(selector);
                                let firstChild = element ? element.firstElementChild : null
                                if(firstChild){
                                  firstChild.click(); // @Todo:- NEED TO ADD THIS IN ANOTHER WAY
                                }
                              }


                        }).catch((err)=> {
                           self.env.services.ui.unblock()
                            throw err
                        })
                        }
                });
                return ()=> drake.destroy()
            }
        }, ()=> [this.state.isNotebookPageChange])


     }

}
FormOverall.components = {
	...FormOverall.components,
}
