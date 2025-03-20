/** @odoo-module **/
import {
	Component,
	onWillStart,
	useEffect,
	onWillUpdateProps
} from "@odoo/owl";
import {
	CylloStudioDropdown
} from "@cyllo_studio/js/view_editor/dropdown/CylloStudioDropdown";
import {
	_t
} from "@web/core/l10n/translation";
import {
	sortBy
} from "@web/core/utils/arrays";
import {
	validateField
} from "@cyllo_studio/js/actions/utils";

export class ListOverall extends Component {
	static template = "cyllo_studio.ListOverall";
	setup() {
		this.fields = "jygfu"
		onWillStart(() => {
			const {
				activeFields = {}, allFields = {}
			} = this.props;
			if (Object.keys(activeFields).length && Object.keys(allFields).length) {
				this.currentField = Object.keys(activeFields).reduce(
					(acc, fieldName) => {
						acc[fieldName] = allFields[fieldName];
						return acc;
					}, {}
				);
				console.log("fields", this.currentField)
				const fields = Object.entries(this.currentField)
					.filter(([fieldName, field]) => validateField(fieldName, field))
					.map(([fieldName, field]) => ({
						name: fieldName,
						...field
					}));
				this.fields = sortBy(fields, "string");
				console.log("fields2", this.fields)
			}
		});
		onWillUpdateProps(async (nextProps) => {
			const {
				activeFields = {}, allFields = {}
			} = this.props;
			if (Object.keys(activeFields).length && Object.keys(allFields).length) {
				this.currentField = Object.keys(activeFields).reduce(
					(acc, fieldName) => {
						acc[fieldName] = allFields[fieldName];
						return acc;
					}, {}
				);
				console.log("fields", this.currentField)
				const fields = Object.entries(this.currentField)
					.filter(([fieldName, field]) => validateField(fieldName, field))
					.map(([fieldName, field]) => ({
						name: fieldName,
						...field
					}));
				this.fields = sortBy(fields, "string");
				console.log("fields2", this.fields)
			}

		});

		useEffect(() => {
			const self = this;
			const tableBody = document.getElementsByClassName("o_data_row");
			const tableRow = document.getElementsByClassName("list-tr");
			const component = document.getElementById("cyComponents-elements-1");
			const component2 = document.getElementById("cyComponents-elements-2");
			const field = "<div><h4>New Text</h4></div>";

			//  if (component) {
			//    const drake = dragula([...tableRow, component, component2], {
			//      revertOnSpill: true,
			//      copy: true,
			//      moves: (el, container, handle) => {
			//        console.log("moves", el, container, handle);
			//        return !container.classList.contains("list-tr");
			//      },
			//      accepts: function (el, target, source, sibling) {
			//        return true;
			//      },
			//    });
			//
			//    drake.on("cloned", function (clone, original, type) {
			//      if (original.classList.contains("field")) {
			//        clone.innerHTML = field;
			//      }
			//    });
			//
			//    drake.on("shadow", function (el, container, source) {
			//      el.classList.remove("cy-components-column", "col-5");
			//      if (el.classList.contains("field")) {
			//        el.innerHTML = field;
			//      }
			//    });
			//
			//    // Handle the drop event
			//    drake.on("drop", async (el, target, source, sibling) => {
			//      console.log("Drop event triggered");
			//      console.log("Element dropped:", el);
			//      console.log("Target container:", target);
			//      console.log("Source container:", source);
			//      console.log("Sibling element:", sibling);
			//
			//      // Handle field drop
			//      if (el.classList.contains("field")) {
			//        self.env.bus.trigger("FIELDS_DETAILS", {
			//          mode: {},
			//          name: self.generateRandomFieldName(),
			//          label: "",
			//          widget: "",
			//          fieldType: "",
			//          context: "",
			//          type: "Properties",
			//          create: "true",
			//          field_path: sibling?.getAttribute('cy-xpath') || "",
			//        });
			//
			//        // Create a new column (for example, a new field or a placeholder)
			//        const newColumn = document.createElement("div");
			//        newColumn.classList.add("o_data_row", "field-column");
			//        newColumn.innerHTML = `<div class="column-content">New field</div>`;
			//
			//        const container = document.querySelector(".o_list_table");
			//        console.log("Container:", container);
			//
			//        if (container) {
			//          // If a sibling is provided and is a valid child of the container
			//          if (sibling && container.contains(sibling)) {
			//            // Find the parent node of the sibling to insert before it
			//            const parent = sibling.parentNode;
			//
			//            parent.insertBefore(newColumn, sibling);
			//            console.log("Inserted new column before the sibling");
			//          } else {
			//            console.log("No sibling found or invalid sibling, appending to container.");
			//            container.appendChild(newColumn);
			//          }
			//        }
			//      }
			//
			//      // Handle button drop
			//      else if (el.classList.contains("button")) {
			//        console.log("Button dropped");
			//        self.env.bus.trigger("BUTTON_DETAILS", {
			//          name: "",
			//          type: "ButtonProperties",
			//        });
			//      }
			//
			//      else if (el.classList.contains("existing_field")) {
			//        console.log("Existing field dropped");
			//        self.env.bus.trigger("LIST_EXISTING_FIELDS", {
			//          name: "",
			//          type: "ExistingFieldProperties",
			//        });
			//      }
			//    });
			//  }
		});
	}

	get position() {
		const value = ["top", "bottom", ""];
		const position = [
			" Add Record At Top",
			" Add Record At Bottom",
			" Open Form View",
		];
		const arr = [];
		for (let i = 0; i < value.length; i++) {
			const obj = {
				value: value[i],
				label: position[i],
			};
			arr.push(obj);
		}
		return arr;
	}
	get defaultSortValue() {
		return this.props.mode.defaultOrder?.[0]?.name || null;
	}
	get defaultPosition() {
		return this.props.mode.editable || "";
	}
	generateRandomFieldName() {
		const timestamp = Date.now();
		const randomChars = Math.random().toString(36).substring(2, 7); // Random alphanumeric string of length 5
		const randomNum = Math.floor(Math.random() * 1000);
		return `x_studio_${timestamp}_${randomNum}_${randomChars}`;
	}
	async handleView(name, value = null, state = null, field = null, order = null) {
		console.log("asdasdasdas")
	}

	get sortValues() {
		console.log("qwertyu", this)
		console.log("qwertyu", this.fields)
		console.log("qwertyu", this.this.fields)
		const arr = [];
		for (let value in this.fields) {
			const obj = {
				value: this.fields[value].name,
				label: this.fields[value].string,
			};
			arr.push(obj);
		}
		return [{
			value: "",
			label: ""
		}, ...arr];
	}
}
ListOverall.components = {
	CylloStudioDropdown,
};