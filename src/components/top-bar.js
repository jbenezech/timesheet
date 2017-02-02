import { inject } from 'aurelia-framework';
import { Session } from '../services/session';
import { I18N } from 'aurelia-i18n';
import { DBService } from '../services/db-service';
import {DialogService} from "aurelia-dialog";
import {Confirmation} from "../resources/confirmation/confirmation";
import settings from '../config/app-settings';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(Session, I18N, DBService, DialogService, EventAggregator, Router)
export class TopBar {

    title = 'Timeflies';
    error = false;
    
    constructor(session, i18n, db, dialogService, ea, router) {    
        this.session = session;   
        this.i18n = i18n;
        this.db = db;
        this.dialogService = dialogService;
        this.ea = ea;
        this.router = router;
        this.title = this.i18n.tr('site_title');
    }

    get isAdmin() {
        return this.session.userHasRole('admin');
    }
    
    get isSynced() {
        return !this.db.hasUnsyncedUpdate();
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
        this.db.removeUserDBs().then( () => this.session.invalidate() );
    }

    attached() {
        $('.language-switch').dropdown();

        let me = this;
        this.ea.subscribe('dberr', response => {
            this.error = true;
        });
    }

    navigateToPlanning() {
        this.navigate('app/timesheets/planning');
    }

    switchLocale(locale) {
        this.session.switchLocale(locale);
    }
}
