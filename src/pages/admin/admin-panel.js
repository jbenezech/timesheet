import { inject } from 'aurelia-framework';
export class AdminPanel {

    attached() {
        $('.admin.panel.menu .item').tab({
            'onLoad': function (tab, param) {
                document.querySelector('admin-reports').au.controller.viewModel.refresh();
            },
        });
    }

    activate(params) {        
        this.month = params.month;
    }

}