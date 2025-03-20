/** @odoo-module **/
import {
	Component,
	useState
} from "@odoo/owl";
import {
	useBus
} from "@web/core/utils/hooks";
import {
	AsideBar
} from "@cyllo_studio/js/view_editor/aside_bar/aside_bar";
import {
	MenuSideBar
} from "@cyllo_base/js/menu_sidebar";
import {
	MainComponentsContainer
} from "@web/core/main_components_container";
import {
	ExistingFieldDialog
} from "@cyllo_studio/js/view_editor/aside_bar/dialog/existing_field_dialog";
import {
	useService
} from "@web/core/utils/hooks";

export class StudioWrapper extends Component {
	static template = "cyllo_studio.StudioWrapper";
	setup() {
	this.state = useState({
      isAnimating: false,
    });
		this.dialogService = useService("dialog");
		this.overall = useState({
			mode: {},
			allFields: {},
			activeFields: {},
			edit: this.props.edit,
			measure: {},
			isMenu: false,
			progressAttributes: {},
			envModel:"",
			ribbonElement: document.querySelectorAll("nonexistent-selector"),
		});
		this.viewDetails = useState({
			model: "",
			viewId: 0,
			viewType: "",
			type: "",
		});
		this.fieldProperties = useState({
			attr: {},
			name: "",
			label: "",
			widget: "",
			fieldType: "",
			context: "",
			related_model:"",
			edit:"",
			path :"",
			help:"",
			placeholder:"",
			invisible:"",
			readonly:"",
			create:"",
			field_path:"",

			//      isRestricted:"",
			//      isFieldTag:"",
			//      allfields:"",

		});
		this.kanbanComponent = useState({
			properties: "",
			item: "",
			element: "",

		});
		this.buttonInfo = useState({
			type: "",

		});
		this.noteBookProperties = useState({
			properties:"",
			type:"",

		});
		this.SmartButtonProperties = useState({
		    properties:"",
			path:"",
			type:"",
			addButtonBox:"",

		});
		this.ButtonDetails =useState(
		{
		  name:"",
		  type:"",
		  path:"",
		  position:"",
		  class_name: "",
		  string:"",

		})
		this.handleFormDetails = this.handleFormDetails.bind(this);
		this.handleListDetails = this.handleListDetails.bind(this);
		this.handlePivotDetails = this.handlePivotDetails.bind(this);
		this.handleKanbanDetails = this.handleKanbanDetails.bind(this);
		this.handleCalendarDetails = this.handleCalendarDetails.bind(this);
		this.handleGraphDetails = this.handleGraphDetails.bind(this);
		this.handleKanbanComponent = this.handleKanbanComponent.bind(this);
		this.handleButtonInfo = this.handleButtonInfo.bind(this);
		this.handleClearMenu = this.handleClearMenu.bind(this);
		this.handleNotebookDetails = this.handleNotebookDetails.bind(this);
		this.handleSmartButtonDetails = this.handleSmartButtonDetails.bind(this);
		useBus(this.env.bus, 'CLEAR-MENU', this.handleClearMenu.bind(this));
		useBus(this.env.bus, 'KANBAN_COMPONENT', this.handleKanbanComponent.bind(this));
		useBus(this.env.bus, "BUTTON_INFO", this.handleButtonInfo);
		useBus(this.env.bus, "PIVOT_DETAILS", this.handlePivotDetails);
		useBus(this.env.bus, "LIST_DETAILS", this.handleListDetails);
		useBus(this.env.bus, "SELECT_NOTEBOOK", this.handleNotebookDetails);







		useBus(this.env.bus, "FORM_DETAILS", this.handleFormDetails);
		useBus(this.env.bus, "SMART_BUTTON_DETAILS", this.handleSmartButtonDetails);
//		useBus(this.env.bus, "FORM_FIELDS_DETAILS", this.handleFieldDetails);

		useBus(this.env.bus, "KANBAN_DETAILS", this.handleKanbanDetails);
		useBus(this.env.bus, "CALENDAR_DETAILS", this.handleCalendarDetails);
		useBus(this.env.bus, "GRAPH_DETAILS", this.handleGraphDetails);

		this.handleFieldDetails = this.handleFieldDetails.bind(this);
		this.handleButtonDetails = this.handleButtonDetails.bind(this);
		this.handleExistingField = this.handleExistingFieldDetails.bind(this);

		useBus(this.env.bus, "FIELDS_DETAILS", this.handleFieldDetails);
		useBus(this.env.bus, "BUTTON_DETAILS", this.handleButtonDetails);
		useBus(this.env.bus, "LIST_EXISTING_FIELDS", this.handleExistingField);

	}
	updateViewDetails(detail) {
		if (detail) {
			Object.assign(this.viewDetails, {
				model: detail.model ?? this.viewDetails.model,
				viewId: detail.viewId ?? this.viewDetails.viewId,
				viewType: detail.viewType ?? this.viewDetails.viewType,
				type: detail.type ?? this.viewDetails.type,
			});
		}
	}
	handleExistingFieldDetails() {
		this.dialogService.add(ExistingFieldDialog, {
			fields: this.overall.allFields,
			model: this.viewDetails.model,
			viewType: this.viewDetails.viewType,
			viewId: this.viewDetails.viewId,
		});
	}
	handleView(ev) {
		this.viewDetails.type = ev.target.innerText;
	}
	handleFormDetails({
		detail
	}) {
		if (detail) {
			Object.assign(this.overall, {
				mode: detail.mode,
				allFields: detail.allFields,
				activeFields: detail.activeFields,
			});
			this.updateViewDetails(detail);
		}
	}
	handleButtonDetails({
		detail
	}) {
	    console.log("werrrrrrrrrrrrrr",detail)
		if (detail) {
			Object.assign(this.ButtonDetails, {
				name: detail.name  || "",
				type: detail.function_type|| "",
				path: detail.path||"",
				position: detail.position||"",
				class_name: detail.class||"",
				string:detail?.string || "",
			});
			this.updateViewDetails(detail);
		}
	}
	handleListDetails({
		detail
	}) {
	    console.log("detaillkjhjk",detail)
		if (detail) {
			Object.assign(this.overall, {
				mode: detail.mode,
				allFields: detail.allFields,
				activeFields: detail.activeFields,
			});
			this.updateViewDetails(detail);
		}
	}
	handleGraphDetails({
		detail
	}) {
		if (detail) {
			Object.assign(this.overall, {
				mode: detail.mode,
				allFields: detail.allFields,
			});
			this.updateViewDetails(detail);
		}
	}
	async handleFieldDetails({
		detail
	}) {
		if (detail) {
		    console.log("aaaaaaaa",detail)
			Object.assign(this.fieldProperties, {
				attr: detail.mode,
				name: detail.name,
				label: detail.label,
				widget: detail.widget,
				fieldType: detail.fieldType,
				context: detail.context,
				related_model:detail.related_model,
				edit:detail.edit || "",
				path:detail.cy_path ||"",
				help:detail.help,
				placeholder:detail.placeholder ||"",
				invisible:detail.invisible,
				readonly:detail.readonly,
				required:detail.required,
				create:detail.create,
				field_path:detail.field_path||"",
			});
			this.updateViewDetails(detail);
		}
	}
	handleKanbanDetails({
		detail
	}) {
		if (detail) {
			Object.assign(this.overall, {
				allFields: detail.allFields,
				mode: detail.attributes,
				isMenu: detail.isMenu,
				progressAttributes: detail.progressAttributes,
				ribbonElement: detail.ribbonElement,
			});
			this.updateViewDetails(detail);
		}
	}
	handleCalendarDetails({
		detail
	}) {
		if (detail) {
			Object.assign(this.overall, {
				mode: detail.mode,
				activeFields: detail.activeFields,
			});
			this.updateViewDetails(detail);
		}
	}
	handlePivotDetails({
		detail
	}) {
	    console.log("xxxxxxxxxxxxx",detail.envModel)
		if (detail) {
			Object.assign(this.overall, {
				activeFields: detail.active_fields,
				measure: detail.measure,
				mode: detail.metaData,
				envModel:detail.envModel,
			});
			this.updateViewDetails(detail);
		}
	}
	handleKanbanComponent({
		detail
	}) {
		if (detail) {
			Object.assign(this.kanbanComponent, {
				properties: detail.properties,
				type: detail.type,
				element: detail.element,

			});
			this.updateViewDetails(detail);
		}
	}
	handleSmartButtonDetails({
		detail
	}) {
	     console.log("1000000",detail)
		if (detail) {
			Object.assign(this.SmartButtonProperties, {
				properties: detail.properties,
				path: detail.path,
				type: detail.type,
				addButtonBox:detail.addButtonBox,

			});
			this.updateViewDetails(detail);
		}
	}
	handleButtonInfo({
		detail
	}) {
		if (detail) {
			Object.assign(this.buttonInfo, {
				newViewId: detail.newViewId,
				envModel: detail.envModel,
				newButton: detail.newButton,
				path: detail.path,
			});
			this.updateViewDetails(detail);
		}
	}
	handleClearMenu(params) {
	console.log(params.detail,'ClearMenu',this)
        this.props.edit = false;
        this.viewDetails.type = false;
        if (params?.detail?.fromClose) { // Optional chaining for safety
            this.state.isAnimating = true;
            setTimeout(() => {
                this.state.isAnimating = false;
            }, 800); // Match new animation duration
        }
    }
	handleNotebookDetails({
		detail
	}) {
	    console.log("gggggggmmmmmmmmmg",detail)
		if (detail) {
			Object.assign(this.noteBookProperties, {
				properties: detail.properties,
				type:detail.type,

			});
			this.updateViewDetails(detail);
		}
	}
	get asideProps() {
	console.log('sssssssssssssssssssss',this.handleNotebookDetails)
		return {
			overall: this.overall,
			viewDetails: this.viewDetails,
			fieldProperties: this.fieldProperties,
			kanbanComponent: this.kanbanComponent,
			noteBookProperties:this.noteBookProperties,
			SmartButtonProperties : this.SmartButtonProperties,
			ButtonDetails:this.ButtonDetails,
			type: this.viewDetails.type || (this.props.edit ? "View" : ""),
			handleView: this.handleView.bind(this),
			isAnimating:this.state?.isAnimating
		};
	}
	get asideBarAvailable() {
		return this.props.edit || this.viewDetails.type;
	}
}
StudioWrapper.components = {
	MenuSideBar,
	AsideBar,
	MainComponentsContainer,
};