
import { inject, bindable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { TimesheetsRouter } from './timesheets-router';
import { Session } from '../../services/session';
import { DBService } from '../../services/db-service';
import settings from '../../config/app-settings';
import moment from 'moment';

@inject(Session, DBService, EventAggregator, TimesheetsRouter)

/**
 * VM for the list of timesheet entries
 */
export class MonthlyTimesheet {

    @bindable entity = {};
    purposes = new Map();
    interprets = new Map();

    constructor(session, db, ea, router) {
        this.session = session;
        this.db = db;
        this.ea = ea;
        this.router = router;
    }

    activate(params) {        
        this.timesheetId = params.id;
    }

    attached() {
        this.retrieveData();

        this.subscriber = this.ea.subscribe('dbsync', response => {
            me.retrieveData();
        });
    }

    detached() {
        this.subscriber.dispose();
    }

    retrieveData() {
        //first load purposes to show names in the list
        this.listPurposes()
        .then( () => this.listInterprets() )
        .then( () => this.getTimesheet() );
    }

    listPurposes() {
        let me = this;
        return this.db.list('purpose').then( response => {
            response.map( (purpose) => {
                me.purposes.set(purpose.id, purpose.doc.name);
            })               
            
            return new Promise((resolve) => { resolve(); });
        });
    }

    listInterprets() {
        let me = this;
        return this.db.list('interpret')
        .then( response => {

            response.map( (interpret) => {
                me.interprets.set(interpret.id, interpret.doc.name);
            }) 

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