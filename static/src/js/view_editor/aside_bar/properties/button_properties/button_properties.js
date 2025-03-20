/** @odoo-module **/
import { Component, useState, onWillStart,onWillUpdateProps } from "@odoo/owl";
import { CustomSelection } from "@cyllo_studio/js/navbar/custom_selection/custom_selection";
import { CylloStudioDropdown } from "@cyllo_studio/js/view_editor/dropdown/CylloStudioDropdown";
import { useService } from "@web/core/utils/hooks";
import { RecordSelector } from "@web/core/record_selectors/record_selector";
import {MultiRecordSelector} from "@web/core/record_selectors/multi_record_selector";
import {_t} from "@web/core/l10n/translation";



const ICONCLASS = [
  "fa-500px",
  "fa-address-book",
  "fa-address-book-o",
  "fa-address-card",
  "fa-address-card-o",
  "fa-adjust",
  "fa-adn",
  "fa-align-center",
  "fa-align-justify",
  "fa-align-left",
  "fa-align-right",
  "fa-amazon",
  "fa-ambulance",
  "fa-american-sign-language-interpreting",
  "fa-anchor",
  "fa-android",
  "fa-angellist",
  "fa-angle-double-down",
  "fa-angle-double-left",
  "fa-angle-double-right",
  "fa-angle-double-up",
  "fa-angle-down",
  "fa-angle-left",
  "fa-angle-right",
  "fa-angle-up",
  "fa-apple",
  "fa-archive",
  "fa-area-chart",
  "fa-arrow-circle-down",
  "fa-arrow-circle-left",
  "fa-arrow-circle-o-down",
  "fa-arrow-circle-o-left",
  "fa-arrow-circle-o-right",
  "fa-arrow-circle-o-up",
  "fa-arrow-circle-right",
  "fa-arrow-circle-up",
  "fa-arrow-down",
  "fa-arrow-left",
  "fa-arrow-right",
  "fa-arrow-up",
  "fa-arrows",
  "fa-arrows-alt",
  "fa-arrows-h",
  "fa-arrows-v",
  "fa-asl-interpreting",
  "fa-assistive-listening-systems",
  "fa-asterisk",
  "fa-at",
  "fa-audio-description",
  "fa-automobile",
  "fa-backward",
  "fa-balance-scale",
  "fa-ban",
  "fa-bandcamp",
  "fa-bank",
  "fa-bar-chart",
  "fa-bar-chart-o",
  "fa-barcode",
  "fa-bars",
  "fa-bath",
  "fa-bathtub",
  "fa-battery",
  "fa-battery-0",
  "fa-battery-1",
  "fa-battery-2",
  "fa-battery-3",
  "fa-battery-4",
  "fa-battery-empty",
  "fa-battery-full",
  "fa-battery-half",
  "fa-battery-quarter",
  "fa-battery-three-quarters",
  "fa-bed",
  "fa-beer",
  "fa-behance",
  "fa-behance-square",
  "fa-bell",
  "fa-bell-o",
  "fa-bell-slash",
  "fa-bell-slash-o",
  "fa-bicycle",
  "fa-binoculars",
  "fa-birthday-cake",
  "fa-bitbucket",
  "fa-bitbucket-square",
  "fa-bitcoin",
  "fa-black-tie",
  "fa-blind",
  "fa-bluetooth",
  "fa-bluetooth-b",
  "fa-bold",
  "fa-bolt",
  "fa-bomb",
  "fa-book",
  "fa-bookmark",
  "fa-bookmark-o",
  "fa-braille",
  "fa-briefcase",
  "fa-btc",
  "fa-bug",
  "fa-building",
  "fa-building-o",
  "fa-bullhorn",
  "fa-bullseye",
  "fa-bus",
  "fa-buysellads",
  "fa-cab",
  "fa-calculator",
  "fa-calendar",
  "fa-calendar-check-o",
  "fa-calendar-minus-o",
  "fa-calendar-o",
  "fa-calendar-plus-o",
  "fa-calendar-times-o",
  "fa-camera",
  "fa-camera-retro",
  "fa-car",
  "fa-caret-down",
  "fa-caret-left",
  "fa-caret-right",
  "fa-caret-square-o-down",
  "fa-caret-square-o-left",
  "fa-caret-square-o-right",
  "fa-caret-square-o-up",
  "fa-caret-up",
  "fa-cart-arrow-down",
  "fa-cart-plus",
  "fa-cc",
  "fa-cc-amex",
  "fa-cc-diners-club",
  "fa-cc-discover",
  "fa-cc-jcb",
  "fa-cc-mastercard",
  "fa-cc-paypal",
  "fa-cc-stripe",
  "fa-cc-visa",
  "fa-certificate",
  "fa-chain",
  "fa-chain-broken",
  "fa-check",
  "fa-check-circle",
  "fa-check-circle-o",
  "fa-check-square",
  "fa-check-square-o",
  "fa-chevron-circle-down",
  "fa-chevron-circle-left",
  "fa-chevron-circle-right",
  "fa-chevron-circle-up",
  "fa-chevron-down",
  "fa-chevron-left",
  "fa-chevron-right",
  "fa-chevron-up",
  "fa-child",
  "fa-chrome",
  "fa-circle",
  "fa-circle-o",
  "fa-circle-o-notch",
  "fa-circle-thin",
  "fa-clipboard",
  "fa-clock-o",
  "fa-clone",
  "fa-close",
  "fa-cloud",
  "fa-cloud-download",
  "fa-cloud-upload",
  "fa-cny",
  "fa-code",
  "fa-code-fork",
  "fa-codepen",
  "fa-codiepie",
  "fa-coffee",
  "fa-cog",
  "fa-cogs",
  "fa-columns",
  "fa-comment",
  "fa-comment-o",
  "fa-commenting",
  "fa-commenting-o",
  "fa-comments",
  "fa-comments-o",
  "fa-compass",
  "fa-compress",
  "fa-connectdevelop",
  "fa-contao",
  "fa-copy",
  "fa-copyright",
  "fa-creative-commons",
  "fa-credit-card",
  "fa-credit-card-alt",
  "fa-crop",
  "fa-crosshairs",
  "fa-css3",
  "fa-cube",
  "fa-cubes",
  "fa-cut",
  "fa-cutlery",
  "fa-dashboard",
  "fa-dashcube",
  "fa-database",
  "fa-deaf",
  "fa-deafness",
  "fa-dedent",
  "fa-delicious",
  "fa-desktop",
  "fa-deviantart",
  "fa-diamond",
  "fa-digg",
  "fa-dollar",
  "fa-dot-circle-o",
  "fa-download",
  "fa-dribbble",
  "fa-drivers-license",
  "fa-drivers-license-o",
  "fa-dropbox",
  "fa-drupal",
  "fa-edge",
  "fa-edit",
  "fa-eercast",
  "fa-eject",
  "fa-ellipsis-h",
  "fa-ellipsis-v",
  "fa-empire",
  "fa-envelope",
  "fa-envelope-o",
  "fa-envelope-open",
  "fa-envelope-open-o",
  "fa-envelope-square",
  "fa-envira",
  "fa-eraser",
  "fa-etsy",
  "fa-eur",
  "fa-euro",
  "fa-exchange",
  "fa-exclamation",
  "fa-exclamation-circle",
  "fa-exclamation-triangle",
  "fa-expand",
  "fa-expeditedssl",
  "fa-external-link",
  "fa-external-link-square",
  "fa-eye",
  "fa-eye-slash",
  "fa-eyedropper",
  "fa-fa",
  "fa-facebook",
  "fa-facebook-f",
  "fa-facebook-official",
  "fa-facebook-square",
  "fa-fast-backward",
  "fa-fast-forward",
  "fa-fax",
  "fa-feed",
  "fa-female",
  "fa-fighter-jet",
  "fa-file",
  "fa-file-archive-o",
  "fa-file-audio-o",
  "fa-file-code-o",
  "fa-file-excel-o",
  "fa-file-image-o",
  "fa-file-movie-o",
  "fa-file-o",
  "fa-file-pdf-o",
  "fa-file-photo-o",
  "fa-file-picture-o",
  "fa-file-powerpoint-o",
  "fa-file-sound-o",
  "fa-file-text",
  "fa-file-text-o",
  "fa-file-video-o",
  "fa-file-word-o",
  "fa-file-zip-o",
  "fa-files-o",
  "fa-film",
  "fa-filter",
  "fa-fire",
  "fa-fire-extinguisher",
  "fa-firefox",
  "fa-first-order",
  "fa-flag",
  "fa-flag-checkered",
  "fa-flag-o",
  "fa-flash",
  "fa-flask",
  "fa-flickr",
  "fa-floppy-o",
  "fa-folder",
  "fa-folder-o",
  "fa-folder-open",
  "fa-folder-open-o",
  "fa-font",
  "fa-font-awesome",
  "fa-fonticons",
  "fa-fort-awesome",
  "fa-forumbee",
  "fa-forward",
  "fa-foursquare",
  "fa-free-code-camp",
  "fa-frown-o",
  "fa-futbol-o",
  "fa-gamepad",
  "fa-gavel",
  "fa-gbp",
  "fa-ge",
  "fa-gear",
  "fa-gears",
  "fa-genderless",
  "fa-get-pocket",
  "fa-gg",
  "fa-gg-circle",
  "fa-gift",
  "fa-git",
  "fa-git-square",
  "fa-github",
  "fa-github-alt",
  "fa-github-square",
  "fa-gitlab",
  "fa-gittip",
  "fa-glass",
  "fa-glide",
  "fa-glide-g",
  "fa-globe",
  "fa-google",
  "fa-google-plus",
  "fa-google-plus-circle",
  "fa-google-plus-official",
  "fa-google-plus-square",
  "fa-google-wallet",
  "fa-graduation-cap",
  "fa-gratipay",
  "fa-grav",
  "fa-group",
  "fa-h-square",
  "fa-hacker-news",
  "fa-hand-grab-o",
  "fa-hand-lizard-o",
  "fa-hand-o",
];

const CLASSNAMES = ["primary", "secondary", "info", "warning", "danger"];

export class ButtonProperties extends Component {
  static template = "cyllo_studio.ButtonProperties";
  setup() {
    console.log("buttonProprties", this);
    this.rpc = useService("rpc");
    this.action = useService("action");
    this.notification = useService("effect");
    this.state = useState({
      viewDetails: this.props.viewDetails || "",
      iconToggle: false,
      elementInfo: this.props.elementInfo || "",
      style: "button",
      validation: true,

    });
    this.buttonProperties = useState({
      string: this.props.string || "",
      type: this.props.type || "action",
      class: this.props.class_name || "btn-secondary",
      name: this.props.name || false,
      groupIds: [],
      invisible: "false",
      icon: "",
      functionName: "",
      TextValue: "",
    });
    onWillUpdateProps((nextProps) => {
           this.buttonProperties.string = nextProps.string
           this.buttonProperties.type = nextProps.type
           this.buttonProperties.class = nextProps.class
           this.buttonProperties.name = nextProps.name
    });

    onWillStart(async () => {
      this.functions = await this.rpc("cyllo_studio/find/functions", {
        model_name: this.props.viewDetails.model,
      });
    });
  }
  get onStyleChange() {
    return [
      { value: "button", label: "Button" },
      { value: "link", label: "Link" },
    ];
  }
  get IconClass() {
    return ICONCLASS;
  }
  setIcon(icons) {
    this.buttonProperties.icon = icons;
    this.state.iconToggle = false;
  }
  handleOnStyleChange(value) {
    console.log("handleOnStyleChange");
  }
  handleOnTypeChange(value) {
    this.buttonProperties.type = value;
    this.buttonProperties.name = false;
  }
 get getActionName() {
  console.log(this.buttonProperties.name,'abddd',parseInt(this.buttonProperties.name))
    return parseInt(this.buttonProperties.name)
  }
  get onTypeChange() {
    return [
      { value: "object", label: "Object" },
      { value: "action", label: "Action" },
    ];
  }
  handleButtonFunctionChange(value) {

    console.log("asdfasfa",value)
    const functionInfo = document.querySelector(".functionInfo");
    if (functionInfo) {
      functionInfo.classList.remove("d-none");
    }
    this.buttonProperties.name = value;
  }
  ButtonFunctionChange(array) {
    const result = array.map((item) => ({ value: item, label: item }));
    return result;
  }

async addButton() {
    console.log("ssssssss", this.buttonProperties.name);
    if (!this.buttonProperties.name) {
        this.warningCount += 1;
        return this.notification.add({
            title: _t("Validation Error"),
            message: "Unable to save the button.",
            description: "Please provide a function name for the button.",
            type: "notification_panel",
            notificationType: "warning",
        });
    }

    if (!this.buttonProperties.string) {
        this.warningCount += 1;
        return this.notification.add({
            title: _t("Validation Error"),
            message: "Unable to save the button.",
            description: "Please provide a label for the button.",
            type: "notification_panel",
            notificationType: "warning",
        });
    }
    if (!this.buttonProperties.type) {
        this.warningCount += 1;
        return this.notification.add({
            title: _t("Validation Error"),
            message: "Unable to save the button.",
            description: "Please provide a valid button type.",
            type: "notification_panel",
            notificationType: "warning",
        });
    }
    let button_properties = {
        ...this.buttonProperties
    };
    try {
        const result = await this.rpc("/cyllo_studio/add/button_item", {
            path: this.props.path || "",
            position: this.props.position || "",
            view_details: {
                ...this.state.viewDetails,
                // active_fields: this.state.elementInfo.activeFields // Uncomment if needed
            },
            button_properties,
        });

        // If the result is successful, handle undo/redo storage
        if (result) {
            let storedArray = JSON.parse(sessionStorage.getItem('UndoRedo')) || [];
            let cleanedStr = result.replace(/\s+/g, ' ').trim();
            storedArray.push(cleanedStr);
            sessionStorage.setItem('UndoRedo', JSON.stringify(storedArray));
            sessionStorage.setItem('ReDO', JSON.stringify([]));
        }

    } finally {
        // Make sure the UI is unblocked after the operation is done
        this.env.services.ui.unblock();
    }
    this.env.bus.trigger("CLEAR-MENU");
    this.action.doAction("studio_reload");
}
  }
ButtonProperties.components = {
  CustomSelection,
  CylloStudioDropdown,
  RecordSelector,
  MultiRecordSelector,
};
