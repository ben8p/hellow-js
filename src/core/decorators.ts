// tslint:disable:only-arrow-functions no-function-expression

import 'document-register-element'; // tslint:disable-line:no-import-side-effect
import { render } from './tsx';

interface IConstructable {
	new(): any;
}
interface ICustomElementConstructor extends Function {
	observedAttributes?: string[];
}
interface ICustomElement extends HTMLElement {
	constructor: ICustomElementConstructor; // tslint:disable-line:no-reserved-keywords
	connectedCallback?(): void;
	attributeChangedCallback?(name: string, oldValue: string, newValue: string): void;
}
type DecoratorFactory = (targetPrototype: ICustomElement, propertyKey: string) => void;

export function component(name: string): (targetClass: IConstructable) => void {
	return function(targetClass: IConstructable): void {
		let previousTemplate: JSX.Element = null;
		const originalRender = targetClass.prototype.render;
		targetClass.prototype.render = function(): JSX.Element {
			if (!originalRender) {
				return undefined;
			}
			const template = originalRender.apply(this);
			render(this, template, previousTemplate);
			previousTemplate = template;
			return template;
		};

		targetClass.prototype._renderState = function(): void {
			if (!previousTemplate) { return; }
			this.render();
		};

		const original = targetClass.prototype.connectedCallback;
		targetClass.prototype.connectedCallback = function(): void {
			this.render();
			if (original) {
				original.apply(this);
			}
		};

		customElements.define(name, targetClass);
	};
}

export function state(): DecoratorFactory {
	return function(targetPrototype: ICustomElement, propertyKey: string): void {
		let value: any = null;
		Object.defineProperty(targetPrototype, propertyKey, {
			get(): any { // tslint:disable-line:no-reserved-keywords
				return value;
			},
			set(newValue: any): void { // tslint:disable-line:no-reserved-keywords
				value = newValue;
				this._renderState();
			},
		});
	};
}

export function eventListener(eventName: string): DecoratorFactory {
	return function(targetPrototype: ICustomElement, propertyKey: string): void {
		// tslint:disable-next-line:no-unbound-method
		const original = targetPrototype.connectedCallback;
		targetPrototype.connectedCallback = function(): void {
			if (original) {
				original.apply(this);
			}
			this.addEventListener(eventName, this[propertyKey].bind(this));
		};
	};
}

export function attributeListener(attributeName: string): DecoratorFactory {
	return function(targetPrototype: ICustomElement, propertyKey: string): void {
		targetPrototype.constructor.observedAttributes = [attributeName, ...(targetPrototype.constructor.observedAttributes || [])];
		const original = targetPrototype.attributeChangedCallback; // tslint:disable-line:no-unbound-method
		targetPrototype.attributeChangedCallback = function(name: string, oldValue: string, newValue: string): void {
			if (original) {
				original.apply(this, [name, oldValue, newValue]);
			}
			if (oldValue !== newValue && name === attributeName) {
				this[propertyKey].apply(this, [newValue, oldValue]);
			}
		};
	};
}
