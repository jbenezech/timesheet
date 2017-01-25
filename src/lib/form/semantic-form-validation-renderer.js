import {inject} from 'aurelia-dependency-injection';
import {ValidationRenderer, RenderInstruction, ValidateResult} from 'aurelia-validation';

@inject(Element)
export class SemanticFormValidationRenderer {
    constructor(boundaryElement) {
        this.boundaryElement = boundaryElement;
    }

    render(instruction) {
        for (let { result, elements } of instruction.unrender) {
            for (let element of elements) {
                this.remove(element, result);
            }
        }

        for (let { result, elements } of instruction.render) {
            for (let element of elements) {
                this.add(element, result);
            }
        }

    }

    add(target, result) {
    
        if (result.valid) {
            return;
        }

        // tag the element so we know we rendered into it.
        target.errors = (target.errors || new Map());
        target.errors.set(result);

        // add the error class to the semantic field
        const field = target.querySelector('.field') || target.closest('.field');
        field.classList.add('error');

        // add help-block
        const message = document.createElement('div');
        message.classList.add('ui');
        message.classList.add('error');
        message.classList.add('message');
        message.classList.add('visible');
        message.classList.add('validation-error');
        message.textContent = result.message;
        message.error = result;
        field.appendChild(message);
    }

    remove(target, result) {

        if (result.valid) {
            return;
        }

        target.errors.delete(result);

        // remove the has-error class on the bootstrap form-group div
        const field = target.querySelector('.field') || target.closest('.field');
        field.classList.remove('error');

        // remove all messages related to the error.
        let messages = field.querySelectorAll('.validation-error');
        let i = messages.length;
        while(i--) {
            let message = messages[i];
            if (message.error !== result) {
                continue;
            }
            message.result = null;
            message.remove();
        }
    }
}

// Polyfill for Element.closest and Element.matches
// https://github.com/jonathantneal/closest/
(function (ELEMENT) {
	ELEMENT.matches = ELEMENT.matches || ELEMENT.mozMatchesSelector || ELEMENT.msMatchesSelector || ELEMENT.oMatchesSelector || ELEMENT.webkitMatchesSelector;

	ELEMENT.closest = ELEMENT.closest || function closest(selector) {
		var element = this;

		while (element) {
			if (element.matches(selector)) {
				break;
			}

			element = element.parentElement;
		}

		return element;
	};
}(Element.prototype));