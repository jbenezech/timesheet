
import { inject, NewInstance, bindable, observable } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { TimesheetsRouter } from './timesheets-router';
import { Session } from '../../services/session';
import { DBService } from '../../services/db-service';
import settings from '../../config/app-settings';
import moment from 'moment';
import { I18N } from 'aurelia-i18n';

@inject(Element, Session, DBService, I18N, EventAggregator, TimesheetsRouter)
export class MonthlyTimesheet {

    @bindable entity = {};
    purposes = new Map();
    interprets = new Map();

    constructor(element, session, db, i18n, ea, router) {
        this.element = element;
        this.session = session;
        this.db = db;
        this.i18n = i18n;
        this.ea = ea;
        this.router = router;
    }

    activate(params) {
        
        this.timesheetId = params.id;

        this.retrieveData();

        this.ea.subscribe('dbsync', response => {
            me.retrieveData();
        });
    }

    retrieveData() {
        //first load purposes to show names in the list
        this.listPurposes().then(
            this.listInterprets().then(
                this.getTimesheet()
            )
        );
    }

    listPurposes() {
        let me = this;
        return this.db.list('purpose').then( response => {

            if (response) {

                response.forEach(function (purpose) {
                    me.purposes.set(purpose.id, purpose.doc.name);
                })               
            
            }

            return new Promise((resolve) => { resolve(); });
        });
    }

    listInterprets() {
        let me = this;
        return this.db.list('interpret').then( response => {

            if (response) {

                response.forEach(function (interpret) {
                    me.interprets.set(interpret.id, interpret.doc.name);
                })               

            }

            return new Promise((resolve) => { resolve(); });
        });
    }
    
    getTimesheet() {
        let me = this;

        return this.db.get('timesheet-' + this.session.getUser().name,  this.timesheetId).then( response => {
            me.entity = response;
            return new Promise((resolve) => { resolve(); });
        }); 
    }

    openEntry(id) {
        this.router.navigateToRoute('timesheets/' + this.entity._id + '/' + id + '?r=timesheets/' + this.entity._id);
    }
}