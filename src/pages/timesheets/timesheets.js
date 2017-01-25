import { inject, NewInstance, bindable, observable } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { ValidationController } from 'aurelia-validation';
import { TimesheetsRouter } from './timesheets-router';
import { Session } from '../../services/session';
import { DBService } from '../../services/db-service';
import settings from '../../config/app-settings';
import moment from 'moment';
import { FlashSuccessMessage } from '../../resources/flash/flash-success-message';
import { I18N } from 'aurelia-i18n';
import { log } from '../../services/log';

@inject(Session, DBService, EventAggregator, I18N)
export class Timesheets {

    purposes = new Map();
    lastTimesheet = {
        doc: {
            entries: []
        }
    };
    
    constructor(session, db, ea, i18n) {
        this.session = session;
        this.db = db;
        this.ea = ea;
        this.i18n = i18n;
    }

    activate(params) {
        console.log("ACTIVATE");
        let me = this;        

        this.retrieveData();

        this.ea.subscribe('dbsync', response => {
            console.log("DBSYNC");
            me.retrieveData();
        });
    }
    
    retrieveData() {
        //first load purposes to show names in the list
        this.listPurposes().then( response => {
            this.getLastTimesheet();
        });
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

    getLastTimesheet() {
        let me = this;
        console.log("LISTTIMESHEET");
        return this.db.list('timesheet-' + this.session.getUser().name, 1, true).then( response => {
            log.debug("RESPONSE");
            log.debug(response);

            me.lastTimesheet = {
                doc: {
                    entries: []
                }
            };
            
            if (response.length > 0) {
                me.lastTimesheet = response[0];
            }
            log.debug(me.lastTimesheet);
            return new Promise((resolve) => { resolve(); });
        }); 
    }

    attached() {
        $('.ui.accordion')
           .accordion({
               exclusive: true
           })
        ;
    }

    saveEntry(entry) {
        console.log("SAVVVVVVVVVV");
        console.log(entry);
        
        this.getLastTimesheet();
    }

    edit($event, entity) {
        this.editing = entity;
    }

    cancel() {
        this.editing = { id: -1 };
        this.creating = false;
    }

    create() {
        this.creating = true;
    }
}