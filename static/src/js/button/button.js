/** @odoo-module **/
import { StatusBarButtons } from '@web/views/form/status_bar_buttons/status_bar_buttons';
import { patch } from '@web/core/utils/patch';
import { useState } from "@odoo/owl";
const { useRef, onMounted } = owl

patch(StatusBarButtons.prototype, {
    setup() {
        super.setup();
        this.state = useState({ isVisible: true, hasSheet: true });
        this.buttonRef = useRef('cy-Button');
        this.env.bus.addEventListener('buttonRemove', this.onCancelClick.bind(this));
        onMounted(() => console.log('Status bar mounted'));
    },

    async addNewButton() {
        const header = this.buttonRef.el.closest('.o_form_statusbar');
        const cyXpath = header.getAttribute('cy-xpath');
        if (!header) return;
        this.state.isVisible = false;
        this.env.bus.trigger('BUTTON_DETAILS', {
        type: "ButtonProperties",
        path:cyXpath || "",
        position:"inside",
        });
    },

    async onCancelClick() {
        const button = document.querySelector('.btn.btn-secondary[name="action_new_button"]');
        if (button) button.remove();
        this.env.bus.trigger('CancelButtonClicked');
    },
});
StatusBarButtons.template = 'cyllo_studio.Button'
