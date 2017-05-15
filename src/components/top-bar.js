import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { DialogService } from "aurelia-dialog";
import { EventAggregator } from 'aurelia-event-aggregator';

import { UserAppRouter } from './user-app-router';
import { Confirmation } from "../resources/confirmation/confirmation";
import { DBService } from '../services/db-service';
import { Session } from '../services/session';
import settings from '../config/app-settings';
import environment from '../environment';
import { log } from '../services/log';

@inject(UserAppRouter, Session, I18N, DBService, DialogService, EventAggregator)
export class TopBar {

    //marker to show erros alarm
    error = false;
    
    constructor(router, session, i18n, db, dialogService, ea) {
        this.router = router;    
        this.session = session;   
        this.i18n = i18n;
        this.db = db;
        this.dialogService = dialogService;
        this.ea = ea;
    }

    get isTest() {
        return environment.testing;
    }

    get isAdmin() {
        return this.session.isGranted('admin');
    }
    
    get isSynced() {
        return !this.db.hasUnsyncedUpdate();
    }

    logout() {
        //When logging out, first check if there are updates not synced with remote yet
        //if so, ask confirmation as these will be lost
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
        this.db.removeDBs().then( () => this.session.invalidate() );
    }

    attached() {
        let me = this;
        this.ea.subscribe('dberr', response => {
            log.error(response);
            this.error = true;
        });

        $('.user-switch').dropdown();

        this.db.listUsers().then( response => { this.users = response } );
    }

    navigateToPlanning() {
        this.navigate('app/timesheets/planning');
    }

    impersonateUser(user) {
        this.session.impersonate(user);
        this.router.navigateToRoute('planning');
    }

    //used for testing, clears all documents in all databases
    wipeAll() {
        this.db.wipeAllDBs();
    }

    //used for testing, force replication of all documents in all databases
    replicateAll() {
        this.db.replicateAllDBs();
    }

}
