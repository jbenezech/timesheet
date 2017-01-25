import {bindable, inject} from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import {CssAnimator} from 'aurelia-animator-css';
import { FlashMessage } from './flash-message';
import { FlashSuccessMessage } from './flash-success-message';
import { FlashErrorMessage } from './flash-error-message';

@inject(Element, EventAggregator, CssAnimator)
export class Flash {
    
    message = '';

    constructor(element, eventAggregator, cssAnimator) {
        this.element = element;
        this.ea = eventAggregator;
        this.animator = cssAnimator;        
    }

    attached() {
        let messageElement = this.element.querySelectorAll('.message')[0];
        this.subscriber = this.ea.subscribe(
            FlashMessage, event => {

                this.message = event.message;

                $(messageElement).removeClass('positive');
                $(messageElement).removeClass('negative');
                $(messageElement).removeClass('background-animation-add');
                $(messageElement).removeClass('background-animation-remove');
                
                let flashType = 'positive';
                if (event instanceof FlashErrorMessage) {
                    flashType = 'negative';
                } 

                window.scrollTo(0, 0);
                this.animator.addClass(
                    messageElement, 
                    flashType
                )
                .then(() => {
                    this.animator.addClass(
                        messageElement, 
                        'background-animation'
                    )
                    .then(() => {
                        this.animator.removeClass(messageElement, 'background-animation');
                        this.animator.removeClass(messageElement, flashType);
                    });
                })
            }
        );        
    }

    detached() {
        this.subscriber.dispose();
    }
}