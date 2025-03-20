/** @odoo-module **/
import { formView } from "@web/views/form/form_view";
import { registry } from "@web/core/registry";
import { CylloFormRenderer } from "./cyllo_form_renderer";
import {CylloFormCompiler} from "./view_compiler";


export const CylloFormView = {
  ...formView,
  Renderer: CylloFormRenderer,
  Compiler: CylloFormCompiler,

};

registry.category("views").add("form", CylloFormView, { force: true });
