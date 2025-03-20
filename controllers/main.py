# -*- coding: utf-8 -*-
import inspect
import uuid
from html import unescape, escape
import xml.etree.ElementTree as ET
from odoo import http, api, _
import json
import re

from odoo.exceptions import ValidationError, AccessError
from odoo.osv.expression import TERM_OPERATORS_NEGATION
from odoo.http import Controller, route, request
from odoo import Command
from lxml import etree
import re
from odoo.tools import ustr

random_uuid = uuid.uuid4()


class StudioMode(Controller):

    def create_header(self, header_path):
        print("dsdfsdfsdfsdfsdfsd",)
        if not header_path:
            return ''
        print("asdasdadsasdasdasdddddddddddd")
        path = header_path
        position = 'before'

        if path == "/form/":
            path = "/form"
            position = "inside"
        header_arch = f'<xpath expr="/{path}" position="{position}"><header/></xpath> '
        return header_arch

    @http.route('/web/webclient/cyllo_load_menus/<string:unique>', type='http', auth='user', methods=['GET'])
    def web_cyllo_load_menus(self, unique, lang=None):
        """
        //Removed the reload and odoo.loadparams for not taking cached menu and getting newly created menu from studio

        Loads the menus for the webclient
        :param unique: this parameters is not used, but mandatory: it is used by the HTTP stack to make a unique request
        :param lang: language in which the menus should be loaded (only works if language is installed)
        :return: the menus (including the images in Base64)
        """
        if lang:
            request.update_context(lang=lang)
        menus = request.env["ir.ui.menu"].load_web_menus(request.session.debug)
        body = json.dumps(menus, default=ustr)
        response = request.make_response(body, [
            # this method must specify a content-type application/json instead of using the default text/html set because
            # the type of the route is set to HTTP, but the rpc is made with a get and expects JSON
            ('Content-Type', 'application/json'),
            # ('Cache-Control', 'public, max-age=' + str(http.STATIC_CACHE_LONG)), #Removed this to get the newly created menus via calling load_menus from the load_web_menus
        ])
        return response

    def is_studio_user(self):
        is_studio_debug = 'studio' in request.session.debug.split(',')
        is_erp_manager = request.env.user.has_group('base.group_erp_manager')

        if is_erp_manager and not is_studio_debug:
            '''multi tab case may be in session deosn't have debug = studio
            so we need to manualy  debug session in to studio to not get an error'''
            request.session.debug = 'studio'

        if not is_erp_manager:
            raise AccessError(_("You don't have the access to this request."))

    def get_studio_view(self, view_id, model, view_type):
        self.is_studio_user()
        view_rec = request.env['ir.ui.view'].search([('inherit_id', '=', view_id)], order='priority desc, id desc',
                                                    limit='1')
        if not view_rec.is_studio:
            priority = view_rec.priority + 1 if len(view_rec) == 1 else 16
            view_rec = view_rec.sudo().create(
                {'name': f"Cyllo Studio {model} {view_type} view",
                 'type': view_type,
                 'model': model,
                 'mode': 'extension',
                 'inherit_id': view_id,
                 'arch_base': '<data></data>',
                 'active': True,
                 'priority': priority,
                 'is_studio': True})

            request.env['ir.model.data']._update_xmlids([{
                'xml_id': f"cy_studio.{model.replace('.', '_')}_{view_type}_view_{str(uuid.uuid4())[:8]}",
                'record': view_rec,
            }])
        return view_rec

    def set_app_sequence(self, module_id, position):
        sequence = 10
        if module_id:
            apps = request.env['ir.ui.menu'].search([('parent_id', '=', False)])
            update_sequence = False

            for i, app in enumerate(apps):
                if update_sequence:
                    app.sequence += 2
                    continue

                if app.id == module_id:
                    if position == 'After':
                        next_app_sequence = apps[i + 1].sequence if i + 1 < len(apps) else None
                        if next_app_sequence is None or (app.sequence + 1) < next_app_sequence:
                            sequence = app.sequence + 1
                            break
                        update_sequence = True
                    else:
                        prev_app_sequence = apps[i - 1].sequence if i - 1 >= 0 else None
                        if prev_app_sequence is None or (app.sequence - 1) > prev_app_sequence:
                            sequence = app.sequence - 1
                            break
                        app.sequence += 2
                        update_sequence = True
        return sequence

    def get_default_view_template(self, view_type, editable=False):
        if view_type == 'kanban':
            return """<kanban>
                                <field name="x_name"/>
                               <templates>
                                   <t t-name="kanban-box">
                                       <div class="oe_kanban_global_click">
                                           <div class="oe_kanban_details">
                                               <field name="x_name"/>
                                           </div>
                                       </div>
                                   </t>
                               </templates>
                       </kanban>"""
        elif view_type == 'form':
            return """ <form>
                            <header/>
                            <sheet> 
                                <div class="oe_title">
                                    <h1><field name="x_name" required="1" placeholder="Name..."/></h1> 
                                </div> 
                                <group/> 
                            </sheet> 
                        </form>"""
        elif view_type == 'tree':
            tree = "<tree"
            if editable:
                tree += ' editable="top"'
            tree += """>
                        <field name="x_name"/>
                    </tree>"""
            return tree

    @route('/cyllo_studio/find/functions', type="json", auth="user",
           csrf=False)
    def find_functions(self, model_name, check_unusual_days=False):
        model = request.env[model_name]
        model_class = type(model)

        is_custom_extended = lambda cls: not cls.__module__.startswith("odoo.api")
        custom_extended_classes = [cls for cls in getattr(model_class, '_BaseModel__base_classes', []) if
                                   is_custom_extended(cls)]

        classes = [cls.__name__ for cls in custom_extended_classes]

        active_include = request.env['ir.model.fields'].search(
            [('model', '=', model_name), '|', ('name', '=', 'active'), ('name', '=', 'x_active')])

        methods = []

        for attr_name in dir(model_class):
            attr = getattr(model_class, attr_name)

            if (inspect.isfunction(attr) or inspect.ismethod(attr)) and not getattr(attr, '__self__', None):

                if any(name in str(attr.__qualname__) for name in classes) or 'BaseModel' in str(attr.__qualname__):
                    if check_unusual_days and attr_name == 'get_unusual_days':
                        return True  # Return True immediately if we are checking for 'get_unusual_days'

                    signature = inspect.signature(attr)
                    parameters = signature.parameters

                    if len(parameters) == 1 and (attr_name.startswith("action") or attr_name.startswith("button")):
                        methods.append(attr_name)

        if not active_include:
            methods = [method for method in methods if method not in {'action_archive', 'action_unarchive'}]

        return False if check_unusual_days else methods

    @route('/cyllo_studio/edit/overall_view', type="json", auth="user", csrf=False)
    def edit_overallView(self, args, kwargs):
        view = request.env['ir.ui.view'].sudo()
        model = args[0].get('model')
        view_type = args[0].get('view_type')
        view_id = args[0].get('view_id')

        form_arch_base = ' '
        if kwargs['attr']:
            if kwargs['attr'] == 'default_order':
                form_arch_base = f'''<xpath expr="/{kwargs['path']}" position="attributes">
                                              <attribute name="{kwargs['attr']}">{kwargs['value']} {kwargs['order']}</attribute>
                                            </xpath>    '''
            else:
                form_arch_base = f'''<xpath expr="/{kwargs['path']}" position="attributes">
                                      <attribute name="{kwargs['attr']}">{kwargs['value']}</attribute>
                                    </xpath>    '''
        print("form_arch",form_arch_base)
        if form_arch_base:
            view_rec = self.get_studio_view(view_id, model, view_type)
            view_node = etree.fromstring(view_rec.arch_base)
            view_node.append(etree.fromstring(form_arch_base))
            view_rec.arch_base = (etree.tostring(view_node, pretty_print=True, encoding='unicode'))
            return form_arch_base

    @route('/cyllo_studio/pivot/edit_element', type="json", auth="user",
           csrf=False)
    def edit_pivot_element(self, args, kwargs):
        model = args[0]
        view_type = args[1]
        view_id = args[2]

        pivot_arch_base = f'''<xpath expr="//pivot" position="inside">
                                <field name="{kwargs.get('name')}" type="{kwargs.get('item_type')}" '''
        if kwargs.get('interval'):
            pivot_arch_base += f''' interval="{kwargs.get('interval')} "'''
        pivot_arch_base += '/></xpath>'
        if pivot_arch_base:
            view_rec = self.get_studio_view(view_id, model, view_type)
            view_node = etree.fromstring(view_rec.arch_base)
            view_node.append(etree.fromstring(pivot_arch_base))
            view_rec.arch_base = (etree.tostring(view_node, pretty_print=True, encoding='unicode'))
            return pivot_arch_base

    @route('/cyllo_studio/add/existing_field', type="json", auth="user",
           csrf=False)
    def add_existing_field(self, args, kwargs):
        model = args[0].get('model')
        view_type = args[0].get('view_type')
        view_id = args[0].get('view_id')

        arch_base = f'''<xpath expr="{args[0].get('path')}" position="{args[0].get('position')}">'''
        if kwargs.get('value'):
            for value in kwargs.get('value'):
                arch_base += f'''<field name="{value}"/>'''
        arch_base += '</xpath>'
        print('asdasdasd', arch_base)
        if arch_base:
            view_rec = self.get_studio_view(view_id, model, view_type)
            view_node = etree.fromstring(view_rec.arch_base)
            view_node.append(etree.fromstring(arch_base))
            view_rec.arch_base = (etree.tostring(view_node, pretty_print=True, encoding='unicode'))
            return arch_base

    @route('/cyllo_studio/delete/kanban/field', type="json", auth="user",
           csrf=False)
    def delete_kanban_field(self, view_id, view_type, model, path, field_name=None, child_field_name=None):
        view_rec = self.get_studio_view(view_id, model, view_type)
        view_node = etree.fromstring(view_rec.arch_base)

        view_arch = f'''
                            <xpath expr="/{path}" position="replace"/>
                       '''
        view_node.append(etree.fromstring(view_arch))
        arch = view_arch

        if field_name:
            view_arch_2 = f'''
                                 <xpath expr="//templates" position="before">
                                      <field name="{field_name}"/>
                                 </xpath>
                             '''
            view_node.append(etree.fromstring(view_arch_2))
            arch += view_arch_2

        if child_field_name:
            for field_name in child_field_name:
                view_arch_3 = f'''
                                         <xpath expr="//templates" position="before">
                                              <field name="{field_name}"/>
                                         </xpath>
                                     '''
                view_node.append(etree.fromstring(view_arch_3))
                arch += view_arch_3

        view_rec.arch_base = etree.tostring(view_node, pretty_print=True,
                                            encoding='unicode')
        return arch
    @http.route('/cyllo_studio/get_non_abstract_non_transient_models', type='json', auth='user')
    def get_non_abstract_non_transient_models(self):
        Model = request.env['ir.model']
        non_abstract_non_transient_models = []

        for model in Model.search([('transient', '=', False)]):
            try:
                # Check if the model exists in the environment and get its class safely
                model_env = http.request.env.get(model.model)
                # is_abstract = model_env._abstract
                is_abstract = model_env._abstract or not model_env._auto
                # Ensure the model class exists and isn't abstract or transient
                if not is_abstract:
                    non_abstract_non_transient_models.append({
                        'id': model.id,
                        'model': model.model,
                        'name': model.name
                    })
            except Exception as e:
                request.env.cr.rollback()  # Avoid transaction issues
                continue
        return non_abstract_non_transient_models

    def is_studio_user(self):
        studio = request.session.get('studio')
        is_studio_debug = bool(studio) and '1' in studio
        is_erp_manager = request.env.user.has_group('base.group_erp_manager')

        if is_erp_manager and not is_studio_debug:
            '''multi tab case may be in session deosn't have debug = studio
            so we need to manualy  debug session in to studio to not get an error'''
            request.session.studio = '1'

        if not is_erp_manager:
            raise AccessError(_("You don't have the access to this request."))

    # kanban functionalities

    @route('/cyllo_studio/kanban/add/field', type="json", auth="user",
           csrf=False)
    def add_kanban_field(self, view_id, view_type, model, path, position, field, x2many):
        view_rec = self.get_studio_view(view_id, model, view_type)
        view_arch_1 = f'''
                             <xpath expr="{x2many}" position="inside">
                                  <field name="{field}"/>
                             </xpath>'''
        view_arch_2 = f'''
                             <xpath expr="/{path}" position="{position}">
                                 <field name="{field}"/>
                             </xpath>'''
        view_node = etree.fromstring(view_rec.arch_base)
        view_node.append(etree.fromstring(view_arch_1))
        view_node.append(etree.fromstring(view_arch_2))
        combined_arch = view_arch_1 + view_arch_2
        view_rec.arch_base = (etree.tostring(view_node, pretty_print=True, encoding='unicode'))
        return combined_arch

    @route('/cyllo_studio/kanban/add/text', type="json", auth="user",
           csrf=False)
    def add_kanban_text(self, viewId, viewType, model, path, position, properties):
        print(self, "asdsa")
        view_rec = self.get_studio_view(viewId, model, viewType)
        view_arch = f'''
                              <xpath expr="/{path}" position="{position}">
                                      <span class="{properties['class_names']}">{escape(properties['string'])}</span>
                              </xpath>
                          '''
        view_node = etree.fromstring(view_rec.arch_base)
        view_node.append(etree.fromstring(view_arch))
        view_rec.arch_base = (etree.tostring(view_node, pretty_print=True, encoding='unicode'))
        return view_arch

    @route('/cyllo_studio/kanban/add/ribbon', type="json", auth="user",
           csrf=False)
    def add_kanban_ribbon(self, viewId, viewType, model, path, position, properties):
        print("okkkkkk", properties)
        view_rec = self.get_studio_view(viewId, model, viewType)

        view_arch = f'''
                           <xpath expr="/{path}" position="{position}">
                               <div class="ribbon ribbon-top-right" invisible='{properties['invisible']}'>
                                   <span class="{properties['color']}">{escape(properties['string']) if properties['string'] else ''}</span>
                               </div>
                           </xpath>
                       '''
        view_node = etree.fromstring(view_rec.arch_base)
        view_node.append(etree.fromstring(view_arch))
        view_rec.arch_base = (etree.tostring(view_node, pretty_print=True, encoding='unicode'))
        print("ssss", view_arch)
        return view_arch

    # list functionalities

    @route('/cyllo_studio/move/tree', auth="user", csrf=False, type='json')
    def move_tree(self, args, kwargs, model, view_id, view_type):
        if not kwargs['path']:
            kwargs['path'] = '/tree'
        tree_arch_base = f'<xpath expr="/{kwargs["path"]}" position="{kwargs["position"]}">' \
                         f'<xpath expr="/{kwargs["fieldPath"]}" position="move"/>' \
                         '</xpath>'
        View = request.env['ir.ui.view'].sudo()

        if not kwargs['view_id']:
            kwargs['view_id'] = View.default_view(kwargs['model'],
                                                  kwargs['viewType'])
        view_rec = self.get_studio_view(view_id, model, view_type)
        form_node = etree.fromstring(view_rec.arch_base)
        print("tree_arch_base",tree_arch_base)
        form_node.append(etree.fromstring(tree_arch_base))
        view_rec.arch_base = etree.tostring(form_node, pretty_print=True, encoding='unicode')

        return tree_arch_base
    @route('/cyllo_studio/list/create/new_fields', type="json", auth="user",
           csrf=False)
    def create_new_fields(self, args,view_id, model, view_type):
        print("args[0]['technical_name']",args[0]['field_path'])
        if args[0]['create']:
            values = {
                'name': args[0]['technical_name'],
                'field_description': args[0]['label'],
                'ttype': args[0]['field_type'],
                'help': args[0]['help'],
                # 'is_studio': True,
                'model_id': request.env['ir.model'].search(
                    [('model', '=',model)]).id,
            }
            new_field = request.env['ir.model.fields'].create(values)

            form_arch_base = f"""
                <xpath expr='/{args[0]['field_path']}' position='inside'>
                    <field name='{args[0]['technical_name']}'
            """

            form_arch_base += "/>"
            args[0] = {'path':args[0]['field_path'],**args[0]}

            form_arch_base += "</xpath>"
            view_rec = self.get_studio_view(view_id, model, view_type)
            form_node = etree.fromstring(view_rec.arch_base)
            form_node.append(etree.fromstring(form_arch_base))
            print("form",form_arch_base)
            view_rec.arch_base = etree.tostring(form_node, pretty_print=True, encoding='unicode')
            return form_arch_base

        if args[0]['edit']:
            form_arch_combined = f"""
                                    <xpath expr='/{args[0]["cy_path"]}' position='attributes'>
                                        <attribute name='string'>{escape(args[0]["label"])}</attribute>
                                        <attribute name='widget'>{escape(args[0]["widget"])}</attribute>
                                        <attribute name='help'>{escape(args[0]["help"])}</attribute>
                                        <attribute name='placeholder'>{escape(args[0]["placeholder"])}</attribute>
                                        <attribute name='invisible'>{escape(args[0]["invisible"])}</attribute>
                                        <attribute name='readonly'>{escape(args[0]["readonly"])}</attribute>
                                        <attribute name='required'>{escape(args[0]["required"])}</attribute>
                                        """
            form_arch_combined += f"""</xpath>
                                          """
            view_rec = self.get_studio_view(view_id, model, view_type)
            form_node = etree.fromstring(view_rec.arch_base)
            form_node.append(etree.fromstring(form_arch_combined))
            view_rec.arch_base = etree.tostring(form_node, pretty_print=True, encoding='unicode')
            print("form_arch_combined",form_arch_combined)
            return form_arch_combined



        # form functionality

    @route('/cyllo_studio/form/create/new_fields', type="json", auth="user",
               csrf=False)
    def form_create_new_fields(self, args, view_id, model, view_type):
            print("args",args)
            if args[0]['edit']:
                form_arch_combined = f"""
                                           <xpath expr='/{args[0]["cy_path"]}' position='attributes'>
                                               <attribute name='string'>{escape(args[0]["label"])}</attribute>
                                               <attribute name='widget'>{escape(args[0]["widget"])}</attribute>
                                               <attribute name='help'>{escape(args[0]["help"])}</attribute>
                                               <attribute name='placeholder'>{escape(args[0]["placeholder"])}</attribute>
                                               <attribute name='invisible'>{args[0]["invisible"]}</attribute>
                                               <attribute name='readonly'>{args[0]["readonly"]}</attribute>
                                               <attribute name='required'>{args[0]["required"]}</attribute>

                                               """
                form_arch_combined += f"""</xpath>
                                                 """
                view_rec = self.get_studio_view(view_id, model, view_type)
                form_node = etree.fromstring(view_rec.arch_base)
                form_node.append(etree.fromstring(form_arch_combined))
                view_rec.arch_base = etree.tostring(form_node, pretty_print=True, encoding='unicode')
                print("form_arch_combined", form_arch_combined)
                return form_arch_combined

    @route('/cyllo_studio/add/page', type="json", auth="user",
           csrf=False)
    def add_page(self, args, kwargs, model, view_id, view_type):
        print("addddddd page",kwargs)

        View = request.env['ir.ui.view'].sudo()
        if not kwargs['view_id']:
            kwargs['view_id'] = View.default_view(kwargs['model'],
                                                  kwargs['viewType'])

        form_arch_base = f'<xpath expr="/{kwargs["path"]}" position="inside">' \
                         f'<page string="New Page"></page>' \
                         '</xpath>'

        view_rec = self.get_studio_view(view_id, model, view_type)
        form_node = etree.fromstring(view_rec.arch_base)
        form_node.append(etree.fromstring(form_arch_base))
        view_rec.arch_base = etree.tostring(form_node, pretty_print=True, encoding='unicode')
        return form_arch_base

    @route('/cyllo_studio/update/page', type="json", auth="user",
           csrf=False)
    def update_page(self, args, kwargs, model, view_id, view_type):
        View = request.env['ir.ui.view'].sudo()
        # if not kwargs['view_id']:
        #     kwargs['view_id'] = View.default_view(kwargs['model'],
        #                                           kwargs['viewType'])
        # group_ids = list(map(int, kwargs['groups']))
        # groups = ','.join(request.env['res.groups'].browse(
        #     group_ids).get_external_id().values())
        form_arch_base = f'<xpath expr="/{kwargs["path"]}" position="attributes">' \
                         f'<attribute name="string">{kwargs["string"]}</attribute>' \
                         f'<attribute name="autofocus">{"autofocus" if kwargs["autofocus"] else ""}</attribute>' \
                         f'<attribute name="invisible">{unescape(escape(kwargs["invisible"]))}</attribute>' \
                         '</xpath>'

        view_rec = self.get_studio_view(view_id, model, view_type)
        form_node = etree.fromstring(view_rec.arch_base)
        form_arch_base = re.sub(r'&(?!amp;|lt;|gt;|quot;|apos;)', '&amp;', form_arch_base)
        form_arch_base = re.sub(r'>([^<]*?)\s+</', lambda match: f'>{match.group(1).strip()}<', form_arch_base)
        form_node.append(etree.fromstring(form_arch_base))
        view_rec.arch_base = etree.tostring(form_node, pretty_print=True, encoding='unicode')
        print("fghj",form_arch_base)
        return form_arch_base

    @route('/cyllo_studio/move/page', type="json", auth="user",
           csrf=False)
    def move_page(self, args, kwargs, model, view_id, view_type="form"):
        print(self, args, kwargs, model, view_id)

        View = request.env['ir.ui.view'].sudo()
        if not kwargs['view_id']:
            kwargs['view_id'] = View.default_view(kwargs['model'],
                                                  "form")
        form_arch_base = f'<xpath expr="/{kwargs["path"]}" position="{kwargs["position"]}">' \
                         f'<xpath expr="/{kwargs["pagePath"]}" position="move"/>' \
                         '</xpath>'

        view_rec = self.get_studio_view(view_id, model, view_type)
        form_node = etree.fromstring(view_rec.arch_base)
        form_node.append(etree.fromstring(form_arch_base))
        view_rec.arch_base = etree.tostring(form_node, pretty_print=True, encoding='unicode')
        print("form_arch_base",form_arch_base)
        return form_arch_base

    @route('/cyllo_studio/delete/existing_page', auth="user", csrf=False,
           type='json')
    def delete_existing_page(self, args, kwargs, model, view_id, view_type):

        View = request.env['ir.ui.view'].sudo()

        form_arch_base = f'''<xpath expr="{args[0]['path']}" position="replace"/>'''
        view_rec = self.get_studio_view(view_id, model, view_type)
        form_node = etree.fromstring(view_rec.arch_base)
        form_node.append(etree.fromstring(form_arch_base))
        view_rec.arch_base = etree.tostring(form_node, pretty_print=True,
                                            encoding='unicode')
        return form_arch_base

    @route('/cyllo_studio/add/smart_button', type="json", auth="user",
           csrf=False)

    def add_smart_button(self, kwargs):
        print('smaerttt',kwargs)
        view_rec = self.get_studio_view(kwargs['view_id'], kwargs['model'], 'form')
        print(kwargs['model'])
        model_id = request.env['ir.model'].search(
            [('model', '=', kwargs['model'])])
        print("model_id",model_id)
        vals = {
            'name': f'x_cy_{kwargs["label"].replace(" ", "_").lower()}_count{str(uuid.uuid4())[:4]}',
            'field_description': f'{kwargs["label"].title()} Count',
            'model_id': model_id.id,
            'ttype': 'char',
            'store': False,
            'depends': kwargs['field'],
        }
        compute_field = request.env['ir.model.fields'].create(vals)
        if kwargs['domain'] != '[]':
            domain = kwargs['domain'][:-1] + f",('id', 'in', record.{kwargs['field'].strip()}.ids)]"
            compute = f"""for record in self:
        record['{compute_field.name}'] = len(record.{kwargs['field'].strip()}.search({domain}))
                    """
            kwargs['domain'] = kwargs['domain'][:-1] + ',]'
        else:
            compute = f"""for record in self:
        record['{compute_field.name}'] = len(record.{kwargs['field'].strip()})
                                """
        compute_field.compute = compute

        print("dfewww",compute)
        action_id = request.env['ir.actions.act_window'].create({
            'name': kwargs["label"].title(),
            'res_model': kwargs['field_model'],
            'view_mode': 'tree,form',
            'domain': kwargs['domain']
        })
        form_arch_base = ''
        if kwargs['addButtonBox']:
            form_arch_base += f'''<xpath expr="//form/sheet/*[1]" position="before">
                                              <div class="oe_button_box" name="button_box" cy-xpath="//form/sheet/div[@class='oe_button_box']">
                                             <button type="action" name="{action_id.id}" invisible='{kwargs["invisible"]}' class="oe_stat_button" icon="{kwargs["icon"]}" '''
            if kwargs['groups']:
                group_ids = list(map(int, kwargs['groups']))
                groups = ','.join(request.env['res.groups'].browse(
                    group_ids).get_external_id().values())
                form_arch_base += f'groups="{groups}"'

            form_arch_base += f'><field name="{compute_field.name}" widget="statinfo" '
            if kwargs['label']:
                form_arch_base += f'string="{kwargs["label"].title()}"'
            form_arch_base += '/></button></div>'
        else:
            form_arch_base += f'''<xpath expr="{kwargs['path']}" position="inside">
                                <button type="action" name="{action_id.id}" invisible='{kwargs["invisible"]}' class="oe_stat_button" icon="{kwargs["icon"]}" '''
            if kwargs['groups']:
                group_ids = list(map(int, kwargs['groups']))
                groups = ','.join(request.env['res.groups'].browse(
                    group_ids).get_external_id().values())
                form_arch_base += f'groups="{groups}"'

            form_arch_base += f'><field name="{compute_field.name}" widget="statinfo" '
            if kwargs['label']:
                form_arch_base += f'string="{kwargs["label"].title()}"'
            form_arch_base += '/></button>'

        form_arch_base += '</xpath>'
        form_node = etree.fromstring(view_rec.arch_base)
        print("asdmasrtbutton",form_arch_base)
        form_node.append(etree.fromstring(form_arch_base))
        view_rec.arch_base = etree.tostring(form_node, pretty_print=True, encoding='unicode')
        return form_arch_base

    @route('/cyllo_studio/update/smart_button', type="json", auth="user",
           csrf=False)
    def update_smart_button(self, kwargs):
        view_rec = self.get_studio_view(kwargs['view_id'], kwargs['model'], 'form')
        group_ids = list(map(int, kwargs['groups']))
        groups = ','.join(request.env['res.groups'].browse(group_ids).get_external_id().values())

        form_arch = f'''<xpath expr="/{kwargs['path']}" position="attributes">
                            <attribute name="string">{kwargs['label']}</attribute>
                            <attribute name="icon">{kwargs['icon']}</attribute>
                            <attribute name="groups">{groups}</attribute>
                            <attribute name="invisible">{kwargs['invisible']}</attribute>
                        </xpath>'''
        form_arch_2 = ''
        if 'span' in kwargs['string_path']:
            form_arch_2 = f'''<xpath expr="/{kwargs['string_path']}" position="replace">
                               <span class="o_stat_text">{kwargs['label']}</span>
                           </xpath>'''
        else:
            form_arch_2 = f'''<xpath expr="/{kwargs['string_path']}" position="attributes">
                       <attribute name="string">{kwargs['label']}</attribute>
                   </xpath>'''
        form_node = etree.fromstring(view_rec.arch_base)

        form_node.append(etree.fromstring(form_arch))
        # form_node.append(etree.fromstring(form_arch_1)) if form_arch_1 else None
        form_node.append(etree.fromstring(form_arch_2))
        view_rec.arch_base = etree.tostring(form_node, pretty_print=True, encoding='unicode')
        combined_arch = form_arch + form_arch_2
        return combined_arch

    @route('/cyllo_studio/add/button_item', type='json', auth="user", csrf=False)
    def add_button_item(self, path, position, view_details, button_properties):
        print("aaaaaaaaaaaaa",self)
        view_rec = self.get_studio_view(view_details['viewId'], view_details['model'], view_details['viewType'])
        group_ids = list(map(int, button_properties.pop('groupIds')))

        if group_ids:
            button_properties['groups'] = ','.join(request.env['res.groups'].browse(
                group_ids).get_external_id().values())
        form_arch = f'<xpath expr="/{path}" position="{position}"><button'
        for key, value in button_properties.items():
            if value:
                form_arch += f" {key}='{value}'"
        form_arch += " colspan='2'/> </xpath>"
        form_node = etree.fromstring(view_rec.arch_base)
        print("form_arch",form_arch)
        form_node.append(etree.fromstring(form_arch))
        view_rec.arch_base = etree.tostring(form_node, pretty_print=True, encoding='unicode')
        return form_arch

    @route('/cyllo_studio/add/statusbar', type="json", auth="user",
           csrf=False)

    def add_statusbar(self, args, kwargs):
        print("args", args)
        print("kwargs", kwargs)

        form_arch_base = f'''<xpath expr="/{args['path']}" position="inside">
                               <field name="{args['field']}" widget="statusbar" '''

        options = {}
        if kwargs['clickable']:
            options['clickable'] = kwargs['clickable']
        if kwargs['foldField']:
            options['fold_field'] = kwargs['foldField']
        if options:
            form_arch_base += f'options="{options}" '

        if kwargs['statusbarVisible']:
            form_arch_base += 'statusbar_visible="{}" '.format(re.sub(r",\s+", ",", kwargs["statusbarVisible"]))

        if kwargs['invisible']:
            form_arch_base += f"invisible='{kwargs['invisible']}' "

        if kwargs['group_ids']:
            group_ids = list(map(int, kwargs['group_ids']))
            groups = ','.join(request.env['res.groups'].browse(group_ids).get_external_id().values())
            form_arch_base += f'groups="{groups}" '

        if kwargs['defaultValue']:
            field_id = request.env['ir.model.fields'].search(
                [('name', '=', args['field']), ('model', '=', args['model'])], limit=1)
            request.env['ir.default'].create({'field_id': field_id.id, 'json_value': f'"{kwargs["defaultValue"]}"'})

        form_arch_base += '/></xpath>'

        view_rec = self.get_studio_view(args['view_id'], args['model'], args['view_type'])
        form_node = etree.fromstring(view_rec.arch_base)
        header_arch = self.create_header(args.get('header', None))
        if header_arch:
            form_node.append(etree.fromstring(header_arch))
        form_node.append(etree.fromstring(form_arch_base))

        view_rec.arch_base = etree.tostring(form_node, pretty_print=True, encoding='unicode')

        return form_arch_base

    @route('/cyllo_studio/find/groups', type="json", auth="user",
           csrf=False)
    def find_group_ids(self, groups):
        groups = groups.split(',')
        groups = [item.strip() for item in groups]
        return [request.env.ref(i).id for i in groups]



    #--------------------------pivot functionality ----------------------------------------------------

    @route('/cyllo_studio/pivot/remove_element', type="json", auth="user",
           csrf=False)
    def remove_pivot_element(self, view_id, view_type, model, path):
        pivot_arch_base = f'<xpath expr="/{path}" position="replace"/>'
        view_rec = self.get_studio_view(view_id, model, view_type)
        pivot_node = etree.fromstring(view_rec.arch_base)
        pivot_node.append(etree.fromstring(pivot_arch_base))
        view_rec.arch_base = etree.tostring(pivot_node, pretty_print=True, encoding='unicode')
        return pivot_arch_base
