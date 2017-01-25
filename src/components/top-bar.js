import { inject } from 'aurelia-framework';
import { Session } from '../services/session';
import { I18N } from 'aurelia-i18n';
import { DBService } from '../services/db-service';
import {DialogService} from "aurelia-dialog";
import {Confirmation} from "../resources/confirmation/confirmation";
import settings from '../config/app-settings';
import { Router } from 'aurelia-router';

@inject(Session, I18N, DBService, DialogService, Router)
export class TopBar {

    title = 'Timeflies';

    constructor(session, i18n, db, dialogService, router) {    
        this.session = session;   
        this.i18n = i18n;
        this.db = db;
        this.dialogService = dialogService;
        this.router = router;
        this.title = this.i18n.tr('site_title');
    }

    logout() {
        if (this.db.hasUnsyncedUpdate()) {
            this.dialogService.open({
                viewModel: Confirmation,
                model: this.i18n.tr('unsync-warning')
            }).then(result => {
                if (result.wasCancelled) return;
                this.clearData();
            });
            return;
        }
        
        this.clearData();
    }

    clearData() {
        this.db.removeUserDBs();
        this.session.invalidate();
    }

    attached() {
        $('.language-switch').dropdown();
    }

    navigateToPlanning() {
        this.navigate('app/timesheets/planning');
    }

    switchLocale(locale) {
        this.session.switchLocale(locale);
    }
}
