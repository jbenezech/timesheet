
import { inject, NewInstance, bindable, observable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { DBService } from '../../services/db-service';
import settings from '../../config/app-settings';
import moment from 'moment';
import { log } from '../../services/log';

@inject(DBService, EventAggregator)

/**
 * VM for the list of timesheets that need to be allocated
 */
export class UsersTimesheets {

    @bindable month;

    timesheets = new Map();
    users = new Map();
    purposes = new Map();
    unallocatedOnly = true;
    
    constructor(db, ea) {
        this.db = db;
        this.ea = ea;
    }

    attached() {

        let me = this;
        $('#showAll').checkbox({
            onChange: function() {
                me.unallocatedOnly = !$('#showAll').hasClass('checked');
            }
        });

        this.retrieveData();

        this.subscriber = this.ea.subscribe('dbsync', response => {
            if (response.dbName.match(/^timesheet\-/)) {
                me.retrieveTimesheets();
            }
        });
    }

    detached() {
        this.subscriber.dispose();
    }

    retrieveData() {
        this.retrieveUsers()
        .then( () => this.retrievePurposes() )
        .then( () => this.retrieveTimesheets() );
    }

    retrieveUsers() {
        let me = this;

        return this.db.listUsers()
        .then( response => {
            response.map( (user) => {
                me.users.set(user.doc.name, user);
            });
            return new Promise((resolve) => { resolve(); });
        }); 

    }

    retrievePurposes() {
        let me = this;
        return this.db.list('purpose')
        .then( response => {
            response.map( (purpose) => {
                me.purposes.set(purpose.id, purpose.doc.name);
            });

            return new Promise((resolve) => { resolve(); });
        });
    }

    retrieveTimesheets() {
        let me = this;

        this.users.forEach(function (user) {

            me.db.get('timesheet-' + user.doc.name,  me.month).then( timesheet => {
                if (timesheet) {
                    me.timesheets.set(user.doc.name, timesheet);                                        
                }
            }); 

        }); 
    }
}