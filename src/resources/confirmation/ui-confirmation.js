"use strict";

import {inject, bindable, customAttribute} from 'aurelia-framework';

@customAttribute( `ui-confirmation` )
@inject( Element )
export class UIConfirmationAttribute {

    @bindable approveCallback;

    constructor( element ) {
        alert(element);
		this.element = element;
	}

	attached() {
		$( this.element ).modal({
            onApprove: function(element) {
                return function () {
                    let confirmEvent = new CustomEvent('confirm', {
                        detail: {
                            value: 1
                        },
                        bubbles: true
                    });
                    element.dispatchEvent(confirmEvent);
                }
            }(this.element)
        });
	}

    activeChanged( newValue ) {
		if ( newValue ) {
			$( this.element ).modal( 'show' );
		} else {
			$( this.element ).modal( 'hide' );
		}
	}

    bind($arg) {
        this.approveCallback = $arg.approveCallback;
    }    
}