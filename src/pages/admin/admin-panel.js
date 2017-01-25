import { inject } from 'aurelia-framework';
export class AdminPanel {

    attached() {
        $('.admin.panel.menu .item').tab();
    }

    activate(params) {        
        this.month = params.month;
    }

}