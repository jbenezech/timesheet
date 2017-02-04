import { inject, bindable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

import { Session } from '../../services/session';
import { DBService } from '../../services/db-service';
import { log } from '../../services/log';

@inject(Session, DBService, EventAggregator)

/**
 * VM to show new timesheet entry form and list of previous entries
 */
export class Timesheets {

    purposes = new Map();
    lastTimesheet = {
        doc: {
            entries: []
        }
    };
    
    constructor(session, db, ea) {
        this.session = session;
        this.db = db;
        this.ea = ea;
    }
    
    retrieveData() {
        //first load purposes to show names in the list
        this.listPurposes()
        .then( () => this.getLastTimesheet() );
    }

    listPurposes() {
        let me = this;
        return this.db.list('purpose').then( response => {

            response.map ( (purpose) => {
                me.purposes.set(purpose.id, purpose.doc.name);
            })

            return new Promise((resolve) => { resolve(); });
        });
    }

    getLastTimesheet() {
        let me = this;

        return this.db.list('timesheet-' + this.session.getUser().name, 1, true).then( response => {

            me.lastTimesheet = {
                doc: {
                    entries: []
                }
            };
            
            if (response.length > 0) {
                me.lastTimesheet = response[0];
            }

            return new Promise((resolve) => { resolve(); });
        }); 
    }

    attached() {
        $('.ui.accordion')
           .accordion({
               exclusive: true
           })
        ;

        this.retrieveData();

        let me = this;
        this.subscriber = this.ea.subscribe('dbsync', response => {
            me.retrieveData();
        });
    }

    detached() {
        this.subscriber.dispose();
    }

    saveEntry(entry) {
        //when an entry is saved, retrieve the last timesheet entries as they might have changed
        this.getLastTimesheet();
    }

}