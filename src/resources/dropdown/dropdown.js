import { bindable, customElement, inject, TaskQueue } from 'aurelia-framework';
import { DBService } from '../../services/db-service';
import { EventAggregator } from 'aurelia-event-aggregator';

@customElement('dropdown')
@inject(Element, DBService, EventAggregator)
export class DropDownCustomElement {

    @bindable entries;
    @bindable selectedEntry;
    @bindable parentId;
    @bindable route;
    @bindable parentRoute;
    @bindable name;
    @bindable required = false;
    @bindable multiple = false;
    @bindable allowAdd = false;
    @bindable bypassCache = false;
    @bindable selectAction = () => {};
    @bindable addAction = () => {};
    
    selectedEntryName;

    constructor(element, db, ea) {
        this.element = element;
        this.db = db;
        this.ea = ea;
    }

    attached() {
        let dropdown = this;
        $(this.element).find('.ui.dropdown').dropdown({
            'forceSelection': false,
            'allowAdditions': dropdown.allowAdd,
            'hideAdditions': !dropdown.allowAdd,
            'onChange': function(value, text, $choice) {
                if (
                    typeof $choice !== 'undefined' &&
                    $($choice[0]).hasClass('addition')
                ) {
                    dropdown.save(text);
                } else {
                    dropdown.selectedEntry = value;
                }
            }
        });
        this.load();

        this.ea.subscribe('dbsync', response => {
            if (response.dbName === dropdown.route) {
                dropdown.load();
            }
        });
    }

    parentIdChanged(newEntry, oldEntry) {
        //only == because input field coerces int into string
        if (newEntry == oldEntry) {
            return;
        }
        if (oldEntry) {
            this.selectedEntry = undefined;
        }
        this.restoreDefaults();
        this.load();
    }

    selectedEntryChanged() {

        //leave if the entry is new as this will be re-triggered after the save operation
        if (this.isSelectedEntryNew()) {
            return;
        }

        let selected = $(this.element).find('.dropdown').dropdown('get value');

        if (
            selected[0] !== null && 
            (
                this.selectedEntry === undefined || 
                this.selectedEntry === '' ||
                this.selectedEntry === []
            )
        ) {
            $(this.element).find('.dropdown').dropdown('clear');
        }
        this.setEntryName();

        this.selectAction({ dropdown: this});

    }

    isSelectedEntryNew() {
        if (this.entries === null) {
            return true;
        }

        let me = this;
        let isNew = true;
        this.entries.forEach( (entry) => {
            if (entry.id === me.selectedEntry) {
                isNew = false;
            }
        });

        return isNew;
    }

    restoreDefaults() {
        $(this.element).find('.text')
            .addClass('default');
        this.selectedEntryName = this.getPlaceHolder();
    }

    getPlaceHolder() {
        return $(this.element).find('.text').data('default');
    }

    setEntryName() {
        if (this.multiple) {
            return;
        }

        if (! this.entries) {
            return;
        }

        for (let entry of this.entries) {
            if (entry.id == this.selectedEntry) {
                this.selectedEntryName = entry.doc.name;
            }            
        }

        if (
            this.selectedEntryName &&
            this.selectedEntryName != this.getPlaceHolder()
        ) {
            $(this.element).find('.text')
            .removeClass('default');
        } else {
            this.restoreDefaults();
        }
    }

    load() {

        this.db.list(this.route).then(
            entries => {

            this.entries = entries;

            if (
                this.entries &&
                this.required &&
                (this.selectedEntry === undefined || this.selectedEntry === '') &&
                this.entries.length > 0
            ) {
                this.selectedEntry = this.entries[0].id;
            }

            this.setEntryName();
        });
                   
    }

    save(newEntry) {
        let doc = {
            name: newEntry
        };
console.log(this);
        let me = this;
        this.db.create(this.route, doc).then(
            response => {
                doc._id = response.id;
                me.entries = [
                    {id: response.id, doc : doc},
                    ...me.entries
                ];
                me.selectedEntry = doc._id;
                $(me.element).find('.dropdown').dropdown('set value', doc._id);
                console.log(me);
                me.addAction({ dropdown: me });
            }
        )
    }
}