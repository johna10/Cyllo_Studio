# -*- coding: utf-8 -*-

{
    'name': 'Cyllo Studio',
    'version': "1.0",
    'author': "Cyllo",
    'company': "Cyllo",
    'maintainer': "Cyllo",
    'website': "https://www.cyllo.com",
    'depends': ['web', 'web_hierarchy', 'mail', 'cyllo_base', 'cyllo_web'],
    'data': [
        'views/open_studio_views.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'cyllo_studio/static/src/js/systray/systray_icon.js',
            'cyllo_studio/static/src/js/systray/systray_icon.xml',
            ('include', 'cyllo_studio.assets_backend')
        ],
        'cyllo_studio.assets_backend': [
            'cyllo_studio/static/src/lib/dragula/dragula.min.js',
            'cyllo_studio/static/src/lib/dragula/dragula.min.css',

            'cyllo_studio/static/src/js/root/studio_wrapper_main.js',
            'cyllo_studio/static/src/js/root/studio_wrapper_main.xml',

            'cyllo_studio/static/src/js/web_client.js',
            'cyllo_studio/static/src/js/web_client.xml',

            'cyllo_studio/static/src/js/actions/utils.js',
            'cyllo_studio/static/src/js/actions/view_reload.js',

            'cyllo_studio/static/src/js/action_container.js',
            'cyllo_studio/static/src/js/action_container.xml',


            'cyllo_studio/static/src/js/root/studio_wrapper.js',
            'cyllo_studio/static/src/js/root/studio_wrapper.xml',

            'cyllo_studio/static/src/css/style.css',
            'cyllo_studio/static/src/js/navbar/navbar.css',
            'cyllo_studio/static/src/js/navbar/navbar.js',
            'cyllo_studio/static/src/js/navbar/navbar.xml',
            'cyllo_studio/static/src/js/navbar/new_app_ai.scss',

            'cyllo_studio/static/src/js/navbar/view_selection_dropdown/*.js',
            'cyllo_studio/static/src/js/navbar/view_selection_dropdown/*.xml',

            'cyllo_studio/static/src/js/navbar/custom_selection/*.js',
            'cyllo_studio/static/src/js/navbar/custom_selection/*.xml',

            'cyllo_studio/static/src/js/layout.js',
            'cyllo_studio/static/src/js/layout.xml',

            'cyllo_studio/static/src/js/view_editor/fields/field.css',
            'cyllo_studio/static/src/js/view_editor/fields/field.js',
            'cyllo_studio/static/src/js/view_editor/fields/field.xml',

            'cyllo_studio/static/src/js/view_editor/dropdown/multi_select_dropdown/multi_select_dropdown.js',
            'cyllo_studio/static/src/js/view_editor/dropdown/multi_select_dropdown/multi_select_dropdown.xml',
            'cyllo_studio/static/src/js/view_editor/dropdown/multi_record_selector/*.js',
            'cyllo_studio/static/src/js/view_editor/dropdown/multi_record_selector/*.xml',
            'cyllo_studio/static/src/js/multi_record_autocomplete.js',
            'cyllo_studio/static/src/js/record_autocomplete.js',
            'cyllo_studio/static/src/js/new_app/*.js',
            'cyllo_studio/static/src/js/new_app/*.xml',

            'cyllo_studio/static/src/js/control_panel/control_panel.js',
            'cyllo_studio/static/src/js/control_panel/control_panel.xml',

            'cyllo_studio/static/src/js/view_editor/widget.js',
            # 'cyllo_studio/static/src/js/view_editor/field.js',
            # 'cyllo_studio/static/src/js/view_editor/field.xml',
            'cyllo_studio/static/src/js/view_editor/aside_bar/aside_bar.css',
            'cyllo_studio/static/src/js/view_editor/aside_bar/aside_bar.js',
            'cyllo_studio/static/src/js/view_editor/aside_bar/aside_bar.xml',

            'cyllo_studio/static/src/js/view_editor/aside_bar/properties/field_properties/*.js',
            'cyllo_studio/static/src/js/view_editor/aside_bar/properties/field_properties/*.xml',

            'cyllo_studio/static/src/js/view_editor/aside_bar/properties/existing_field_properties/*.js',
            'cyllo_studio/static/src/js/view_editor/aside_bar/properties/existing_field_properties/*.xml',

            'cyllo_studio/static/src/js/view_editor/aside_bar/properties/button_properties/*.js',
            'cyllo_studio/static/src/js/view_editor/aside_bar/properties/button_properties/*.xml',
            'cyllo_studio/static/src/js/view_editor/aside_bar/properties/button_properties/*.scss',
            'cyllo_studio/static/src/js/view_editor/dropdown/*.js',
            'cyllo_studio/static/src/js/view_editor/dropdown/*.xml',
            'cyllo_studio/static/src/js/view_editor/dropdown/*.scss',

            'cyllo_studio/static/src/js/views/**/*.scss',

            'cyllo_studio/static/src/js/view_editor/aside_bar/overall_view/overall_view.js',
            'cyllo_studio/static/src/js/view_editor/aside_bar/overall_view/overall_view.xml',
            'cyllo_studio/static/src/js/view_editor/aside_bar/overall_view/overall_view.css',
            'cyllo_studio/static/src/js/view_editor/aside_bar/overall_view/form_overall.css',
            'cyllo_studio/static/src/js/view_editor/aside_bar/dialog/*.js',
            'cyllo_studio/static/src/js/view_editor/aside_bar/dialog/*.xml',
            'cyllo_studio/static/src/js/view_editor/aside_bar/dialog/*.css',
            'cyllo_studio/static/src/js/views/cyllo_list/*.js',
            'cyllo_studio/static/src/js/views/cyllo_list/*.xml',

            'cyllo_studio/static/src/js/views/cyllo_search/*.js',
            'cyllo_studio/static/src/js/views/cyllo_search/*.xml',

            'cyllo_studio/static/src/js/views/cyllo_search/dialog/*.js',
            'cyllo_studio/static/src/js/views/cyllo_search/dialog/*.xml',

            'cyllo_studio/static/src/js/views/cyllo_form/button_box/*.js',
            'cyllo_studio/static/src/js/views/cyllo_form/button_box/*.xml',

            'cyllo_studio/static/src/js/views/cyllo_form/view_compiler.js',
            'cyllo_studio/static/src/js/views/cyllo_form/*.js',
            'cyllo_studio/static/src/js/views/cyllo_form/*.xml',
            'cyllo_studio/static/src/js/views/cyllo_form/status_bar/*.js',
            'cyllo_studio/static/src/js/views/cyllo_form/status_bar/*.xml',
            'cyllo_studio/static/src/js/views/cyllo_form/status_bar/*.scss',
            'cyllo_studio/static/src/js/views/cyllo_form/chatter/*.js',
            'cyllo_studio/static/src/js/views/cyllo_form/chatter/*.xml',
            'cyllo_studio/static/src/js/views/cyllo_form/form_group/*.xml',
            'cyllo_studio/static/src/js/views/cyllo_form/form_group/*.js',
            'cyllo_studio/static/src/js/views/cyllo_form/form_group/*.css',
            # 'cyllo_studio/static/src/js/views/cyllo_form/form_label/*.xml',
            'cyllo_studio/static/src/js/views/cyllo_form/notebook/*.js',
            'cyllo_studio/static/src/js/views/cyllo_form/notebook/*.xml',
            '/cyllo_studio/static/src/js/views/cyllo_form/notebook/notebook.css',
            'cyllo_studio/static/src/js/views/cyllo_form/form_label/*.js',
            'cyllo_studio/static/src/js/views/cyllo_form/form_label/*.css',
            'cyllo_studio/static/src/js/views/cyllo_form/page/*.js',
            'cyllo_studio/static/src/js/views/cyllo_form/page/*.xml',
            'cyllo_studio/static/src/js/views/cyllo_form/page/*.scss',
            'cyllo_studio/static/src/js/views/cyllo_form/smart_button/*.js',
            'cyllo_studio/static/src/js/views/cyllo_form/smart_button/*.xml',
            'cyllo_studio/static/src/js/views/cyllo_form/smart_button/*.scss',
            'cyllo_studio/static/src/js/views/cyllo_form/avatar_dailog/*.js',
            'cyllo_studio/static/src/js/views/cyllo_form/avatar_dailog/*.xml',
            'cyllo_studio/static/src/js/views/cyllo_form/avatar/*.js',
            'cyllo_studio/static/src/js/views/cyllo_form/avatar/*.xml',
            'cyllo_studio/static/src/js/views/cyllo_form/form_label/*.js',
            'cyllo_studio/static/src/js/views/cyllo_form/form_label/*.xml',
            'cyllo_studio/static/src/js/views/cyllo_form/form_label/*.css',

            'cyllo_studio/static/src/js/button/*.xml',
            'cyllo_studio/static/src/js/button/*.js',

            'cyllo_studio/static/src/js/views/cyllo_pivot/*.js',
            'cyllo_studio/static/src/js/views/cyllo_pivot/*.xml',
            'cyllo_studio/static/src/js/views/cyllo_pivot/*.scss',

            'cyllo_studio/static/src/js/view_editor/kanban/ribbon_properties.js',
            'cyllo_studio/static/src/js/view_editor/kanban/ribbon_properties.xml',
            'cyllo_studio/static/src/js/view_editor/kanban/ribbon_properties.scss',
            'cyllo_studio/static/src/js/view_editor/kanban/text_properties.js',
            'cyllo_studio/static/src/js/view_editor/kanban/text_properties.xml',
            'cyllo_studio/static/src/js/view_editor/kanban/text_properties.scss',
            'cyllo_studio/static/src/js/views/cyllo_kanban/*.js',
            'cyllo_studio/static/src/js/views/cyllo_kanban/*.xml',
            'cyllo_studio/static/src/js/view_editor/aside_bar/properties/field_properties/kanban_field_details.js',
            'cyllo_studio/static/src/js/view_editor/aside_bar/properties/field_properties/kanban_field_details.xml',
            # 'cyllo_studio/static/src/js/view_editor/aside_bar/properties/field_properties/kanban_field_details.css',
            'cyllo_studio/static/src/js/views/cyllo_kanban/kanban_components.js',
            'cyllo_studio/static/src/js/views/cyllo_kanban/kanban_components.xml',
            'cyllo_studio/static/src/js/views/cyllo_kanban/kanban_component.scss',
            'cyllo_studio/static/src/js/views/cyllo_kanban/kanban _field_dialog.js',
            'cyllo_studio/static/src/js/views/cyllo_kanban/kanban _field_dialog.xml',
            'cyllo_studio/static/src/js/views/cyllo_kanban/kanban_field_dialog.scss',
            'cyllo_studio/static/src/js/view_editor/kanban/ribbon_dialog.js',
            'cyllo_studio/static/src/js/view_editor/kanban/ribbon_dialog.xml',

            'cyllo_studio/static/src/js/views/cyllo_calendar/*.js',
            'cyllo_studio/static/src/js/views/cyllo_calendar/*.xml',

            'cyllo_studio/static/src/js/views/cyllo_graph/*.js',
            'cyllo_studio/static/src/js/views/cyllo_graph/*.xml',
            'cyllo_studio/static/src/js/views/cyllo_graph/*.scss',

            'cyllo_studio/static/src/js/control_panel/UndoRedo/UndoRedo.js',
            'cyllo_studio/static/src/js/control_panel/UndoRedo/UndoRedo.xml',
            'cyllo_studio/static/src/js/utils/undo_redo_utils.js',
            'cyllo_studio/static/src/js/utils/client_action.js',
            # 'cyllo_studio/static/src/js/reactiveStore.js',

        ]
    },
    'license': 'LGPL-3',
    'installable': True,
    'auto_install': False,
    'application': True,
}
