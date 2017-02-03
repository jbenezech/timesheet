
import { inject } from 'aurelia-framework';
import moment from 'moment';
import { I18N } from 'aurelia-i18n';

import { AdminRouter } from './admin-router';
import settings from '../../config/app-settings';

@inject(Element, AdminRouter)
export class Planning {

    constructor(element, router) {
        this.element = element;
        this.router = router;
    }

    attached() {
        let me = this;
        $(this.element).find('.ui.calendar').calendar({
            type: 'month',
            inline: true,
            text: settings.calendar_text,
            onChange: function(date, text) {
                let timesheetId = moment(date).format('YYYY-MM');
                me.router.navigateToRoute('admin/' + timesheetId);
            }
        });
    }
}