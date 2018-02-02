// tslint:disable:only-arrow-functions no-function-expression

import 'document-register-element'; // tslint:disable-line:no-import-side-effect
import { render } from './tsx';

interface IConstructable {
	new(): any;
}
interface ICustomElementConstructor extends Function {
	observedAttributes?: string[];
}
interface ICustomElement extends JSX.ElementClass {
	constructor: ICustomElementConstructor; // tslint:disable-line:no-reserved-keywords
	connectedCallback?(): void;
	attributeChangedCallback?(name: string, oldValue: string, newValue: string): void;
}
type DecoratorFactory = (targetPrototype: ICustomElement, propertyKey: string) => void;

function getMessagingHub(targetClass: any): DocumentFragment {
	targetClass.__messagingHub__ = targetClass.__messagingHub__ || document.createDocumentFragment();
	return targetClass.__messagingHub__;
}

const EVENTS = {
	DONE_RENDERING: 'doneRendering',
};
function addEventListenerOnce(targetClass: any, eventName: string, listener: (event: Event) => void): void {
	const doneRenderingListener = (event: Event) => {
		getMessagingHub(targetClass).removeEventListener(eventName, doneRenderingListener);
		listener.apply(targetClass, [event]);
	};
	getMessagingHub(targetClass).addEventListener(eventName, doneRenderingListener);
}

export function component(name: string): (targetClass: IConstructable) => void {
	return function(targetClass: IConstructable): void {
		let previousTemplate: JSX.Element = null;
		const originalRender = targetClass.prototype.render;
		targetClass.prototype.render = function(): JSX.Element {
			if (!originalRender) {
				return undefined;
			}
			const template = originalRender.apply(this);
			const worker = render(this, template, previousTemplate);
			if (worker) {
				const workerListener = (message: MessageEvent) => {
					if (message.data.action === 'done') {
						worker.removeEventListener('message', workerListener);
						getMessagingHub(this).dispatchEvent(new CustomEvent(EVENTS.DONE_RENDERING));
					}
				};
				worker.addEventListener('message', workerListener);
			} else {
				getMessagingHub(this).dispatchEvent(new CustomEvent(EVENTS.DONE_RENDERING));
			}
			previousTemplate = template;
			return template;
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
		let renderedOnce = false;
		const original = targetPrototype.render; // tslint:disable-line:no-unbound-method
		targetPrototype.render = function(): void {
			if (!renderedOnce) {
				addEventListenerOnce(this, EVENTS.DONE_RENDERING, () => {
					renderedOnce = true;
				});
			}

			let renderValue;
			if (original) {
				renderValue = original.apply(this);
			}
			return renderValue;
		};


		let value: any = null;
		Object.defineProperty(targetPrototype, propertyKey, {
			get(): any { // tslint:disable-line:no-reserved-keywords
				return value;
			},
			set(newValue: any): void { // tslint:disable-line:no-reserved-keywords
				value = newValue;
				if (renderedOnce) {
					this.render();
				}
			},
		});
	};
}

export function eventListener(eventSelector: string): DecoratorFactory {
	return function(targetPrototype: ICustomElement, propertyKey: string): void {
		const original = targetPrototype.connectedCallback; // tslint:disable-line:no-unbound-method
		targetPrototype.connectedCallback = function(): void {
			if (original) {
				original.apply(this);
			}

			const eventParts: string[] = eventSelector.split(':');
			const eventName: string = eventParts.pop();
			const handler = this[propertyKey].bind(this);

			this.addEventListener(eventName, (event: Event) => {
				const cssSelector: string = eventParts[0];
				const matches = (cssSelector && (event.target as Element).matches(cssSelector)) || true;
				if (matches) {
					handler(event);
				}
			});
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

export function domNode(cssSelector: string): DecoratorFactory {
	return function(targetPrototype: ICustomElement, propertyKey: string): void {
		const original = targetPrototype.render; // tslint:disable-line:no-unbound-method
		targetPrototype.render = function(): void {
			addEventListenerOnce(this, EVENTS.DONE_RENDERING, () => {
				this[propertyKey] = this.querySelector(cssSelector);
			});

			let value;
			if (original) {
				value = original.apply(this);
			}
			return value;
		};
	};
}
