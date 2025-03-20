/** @odoo-module **/
import {
	Component,
	onMounted,
	useState,
	useEffect,
	onWillUpdateProps,
	useExternalListener
} from "@odoo/owl";
import {
	useService,useOwnedDialogs
} from "@web/core/utils/hooks";
import {
	CylloStudioDropdown
} from "@cyllo_studio/js/view_editor/dropdown/CylloStudioDropdown";
import {
	registry
} from "@web/core/registry";
import {
	handleUndoRedo
} from "@cyllo_studio/js/utils/undo_redo_utils";
import {
	ExpressionEditorDialog
} from "@web/core/expression_editor_dialog/expression_editor_dialog";
import {_t} from "@web/core/l10n/translation";


export class FieldProperties extends Component {
	static template = "cyllo_studio.FieldProperties";
	static props = {
		attr: {
			type: Object,
			optional: true
		},
		type: {
			type: String,
			optional: true
		},
		name: {
			type: String,
			optional: true
		},
		label: {
			type: String,
			optional: true
		},
		widget: {
			type: String,
			optional: true
		},
		fieldType: {
			type: String,
			optional: true
		},
		context: {
			type: String,
			optional: true
		},
		viewType: {
			type: String,
			optional: true
		},
		model: {
			type: String,
			optional: true
		},
		viewId: {
			type: Number,
			optional: true
		},
		type: {
			type: String,
			optional: true
		},
		create: {
			type: Boolean,
			optional: true
		},
		placeholder:{
		    type: String,
			optional: true

		},
		help:{
		    type: String,
			optional: true

		},
		edit:{
		    type: Boolean,
			optional: true

		},
		readonly:{
		    type: String,
			optional: true

		},
		invisible:{
		    type: String,
			optional: true

		},
		required:{
		    type: String,
			optional: true

		},
		related_model:{
		    type: String,
			optional: true

		},
		field_path:{
		    type: String,
			optional: true

		},
		path:{
		    type: String,
			optional: true

		},

	};
	setup() {
		console.log("ttttttttt", this)
		this.actionService = useService("action");
		this.action = useService("action");
		this.content = registry.category("cyllo_studio_widget_list").get("widget_list")
		this.orm = useService("orm");
		this.rpc = useService("rpc");
		this.notification = useService("effect");
		this.addDialog = useOwnedDialogs();
        console.log("fieldReadonly", this.props)
		this.state = useState({
			xStudio: 0,
			name: this.props.name,
			label: this.props.label,
			related_model: this.props.related_model,
			widget: this.props.widget,
			help: this.props.help,
			placeholder: this.props.placeholder,
			fieldInvisible:this.props.invisible,
			fieldReadonly:this.props.readonly,
			fieldRequired:this.props.required,
			relatedModel:"",
			field_path:this.props.field_path,

			fieldType: [
				"char",
				"text",
				"html",
				"integer",
				"float",
				"date",
				"datetime",
				"binary",
				"selection",
				"boolean",
				"many2one",
				"one2many",
				"many2many",
			],
			models: [],
			selectedFieldType: this.props.fieldType || '',
		});
		onWillUpdateProps((nextProps) => {
            console.log("nextProps.fieldInvisible",nextProps.fieldInvisible)
			this.state.name = nextProps.name
			this.state.label = nextProps.label
			this.related_model = nextProps.related_model
			this.state.widget = nextProps.widget
			this.state.selectedFieldType = nextProps.fieldType
			this.state.help = nextProps.help
			this.state.placeholder = nextProps.placeholder
			this.state.fieldInvisible = nextProps.fieldInvisible
			this.state.fieldReadonly =nextProps.fieldReadonly
			this.state.fieldRequired =nextProps.fieldRequired


		});
		    useEffect(
      () => {
        console.log("asdsdsfffffffffffffff")
      },
      () => [this.state.fieldInvisible]
    );

		onMounted(async () => {
			this.action_area = document.querySelector(".o_action_manager")
			console.log("onmounted", this);
			const fieldsData = await this.orm.searchRead(
				"ir.model.fields",
				[
					["model_id", "=", this.props.model]
				],
				["name"]
			);
			const studioFields = fieldsData.filter((field) =>
				field.name.startsWith("x_studio")
			);
			this.state.xStudio = studioFields.length;
			//      this.createField();
//			if (this.props.create) {
//				await this.autoSaveField();
//			}
			this.state.models = await this.rpc('/cyllo_studio/get_non_abstract_non_transient_models');
		});
		this.saveHandled = false;
		this.AutoSave = async (ev) => await this.handleAutoSave(ev);
		useExternalListener(document, 'click', this.AutoSave, {
			capture: true
		});
		useExternalListener(document, 'mousedown', this.AutoSave, {
			capture: true
		});

	}

	generateRandomFieldName() {
		const timestamp = Date.now();
		const randomNum = Math.floor(Math.random() * 1000);
		return `x_studio_${timestamp}_${randomNum}`;
	}

	onCellKeydown(value) {
		this.state.name = "x_studio_" + value;
	}
	FieldType(array) {
		const result = array.map((item) => ({
			value: item,
			label: item
		}));
		return result;
	}
	RelatedModel(array) {
		const result = array.map((item) => ({
			value: item.model,
			label: item.name,
		}));
		return result;
	}
	handleFieldTypeChange(value) {
		this.state.selectedFieldType = value
		console.log("handleFieldTypeChange", value);
	}

	deleteField() {
		this.action.doAction('studio_reload')
		this.env.bus.trigger('CLEAR-MENU');

	}
    async handleAutoSave(ev) {
    if (!this.action_area.contains(ev.target)) return;

    if (ev.type === 'mousedown') {
        this.saveHandled = true;
    } else if (ev.type === 'click' && this.saveHandled) {
        this.saveHandled = false;
        return;
    }
    if (!this.state.name) {
        this.warningCount += 1;
        return this.notification.add({
            title: _t("Validation Error"),
            message: "Unable to save the field.",
            description: "Please provide a name for the field.",
            type: "notification_panel",
            notificationType: "warning",
        });
    }
    const args = {
            edit: this.props.edit,
			create:this.props.create || '',
			field_type: this.state.selectedFieldType || 'char',
			widget: this.state.widget || '',
			technical_name: this.state.name,
			label: this.state.label || '',
			cy_path: this.props.path || '',
			help: this.state.help || '',
			placeholder: this.state.placeholder,
			invisible:this.state.fieldInvisible || '',
			readonly:this.state.fieldReadonly || '',
			required:this.state.fieldRequired || '',
			field_path: "/tree" ,
			elementType:"",
    };


        try {
                const response = await this.rpc("cyllo_studio/list/create/new_fields", {
                    method: 'create_new_fields',
                    model: this.props.model,
                    view_id: this.props.viewId,
                    view_type:this.props.viewType,
                    args: [args],
                    kwargs: {
//                        view_id: view_id ? view_id : null,
                    }
                })
                if (response) {
                    let storedArray = JSON.parse(sessionStorage.getItem('UndoRedo')) || [];
                    let cleanedStr = response.replace(/\s+/g, ' ').trim();
                    storedArray.push(cleanedStr);
                    sessionStorage.setItem('UndoRedo', JSON.stringify(storedArray));
                    sessionStorage.setItem('ReDO', JSON.stringify([]));
                }

            }
            finally {
                this.env.services.ui.unblock();
            }
            window.location.reload()


    console.log(`${ev.type} created and auto-saved.`);
}
	handleInvisibleChange(event) {
		this.state.fieldInvisible = event.target.checked ? 'True' : 'False'
	}
	handleReadonlyChange(event) {
	    console.log("pasdaff")
		this.state.fieldReadonly = event.target.checked ? 'True' : 'False'
	}
	handleRequiredChange(event) {
	    console.log("ertygcvhj",this.state.fieldRequired)
		this.state.fieldRequired = event.target.checked ? 'True' : 'False'
	    console.log("ertygcvhj",this.state.fieldRequired)

	}
	handleRelatedModelChange(value) {
        this.state.relatedModel = value;
    }
	async attrDomain(ev) {
		const parent = event.target.closest('.cy-basedOn')
		var attribute = parent.getAttribute('data-attribute')
		var domain = '';
		if (attribute === 'readonly' && this.state.item_name?.props.fieldInfo.readonly) {
			domain = this.state.fieldReadonly ? this.state.fieldReadonly : this.state.item_name.props.fieldInfo.readonly
		} else if (attribute === 'invisible' && this.state.item_name?.props.fieldInfo.invisible) {
			domain = this.state.fieldInvisible ? this.state.fieldInvisible : this.state.item_name.props.fieldInfo.invisible
		} else if (attribute === 'required' && this.state.item_name?.props.fieldInfo.required) {
			domain = this.state.fieldRequired ? this.state.fieldRequired : this.state.item_name.props.fieldInfo.required
		} else {
			domain = false
		}
		var resModel = this.action.currentController.props.resModel
		var fields_detail = await this.orm.searchRead("ir.model.fields", [
			["model", "=", resModel]
		])

		//        domain = typeof domain === "string" && !domain ? domain : "False";
		domain = domain ? domain : "False";
		const fieldsDict = {};
		fields_detail.forEach(field => {
			const fieldName = field.name;
			fieldsDict[fieldName] = field;
		});
		var fields_info = fieldsDict;
		this.addDialog(ExpressionEditorDialog, {
			resModel,
			fields: fields_info,
			expression: domain,
			onConfirm: (expression) => this.modifier(expression, attribute),
		});
	}
	modifier(expression, attribute) {
		this.attribute = attribute
		if (attribute == 'invisible') {
			this.state.fieldInvisible = expression
		}
		if (attribute == 'readonly') {
			this.state.fieldReadonly = expression
		}
		if (attribute == 'required') {
			this.state.fieldRequired = expression
		}
	}
	get Widget() {
		return this.state.widget_types.length ? [{
			value: false,
			label: ''
		}, ...this.state.widget_types] : this.state.widget_types
	}
	get fieldType() {
        return [{value:'new',label:'New Field'}, {value:'existing',label:'Existing Field'}, {value:'button',label:'Button'}]

    }
    FieldTypeChange(value) {
        if (value === 'button') {
            this.createButton();
        } else if (value === 'new') {
            this.createNewField();
        } else if (value === 'existing') {
            this.env.bus.trigger("LIST_EXISTING_FIELDS", {
                name: "ExistingName",
                type: "ExistingProperties",
            });
            this.env.bus.trigger('CLEAR-MENU');
        }
   }

    async createButton() {

    this.env.bus.trigger("BUTTON_DETAILS", {
        type: "ButtonProperties",
        path: "/tree",
        position: "inside",
    });
}

    async createNewField() {
    await this.handleAutoSave({ type: 'new' });
}


}
FieldProperties.components = {
	CylloStudioDropdown,
};