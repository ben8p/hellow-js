// tslint:disable:only-arrow-functions no-function-expression

import 'document-register-element'; // tslint:disable-line:no-import-side-effect
import { render } from './tsx';
import { debounce } from './debounce';
import { parse, ITSS } from './tss';

interface IConstructable {
	new(): any;
}
interface ICustomElementConstructor extends Function {
	observedAttributes?: string[];
}
interface ICustomElement extends HTMLElement {
	__stateRender__?: boolean | (() => JSX.Element);
	__messagingHub__?: DocumentFragment;
	constructor: ICustomElementConstructor; // tslint:disable-line:no-reserved-keywords
	// __stateRender__?(): JSX.Element;
	append?(...value: (Node|string)[]): void; // experimental feature
	prepend?(...value: (Node|string)[]): void; // experimental feature
	connectedCallback?(): void;
	attributeChangedCallback?(name: string, oldValue: string, newValue: string): void;
	render(): JSX.Element;
}
type DecoratorFactory = (targetPrototype: ICustomElement, propertyKey: string) => void;

function getMessagingHub(targetClass: ICustomElement): DocumentFragment {
	targetClass.__messagingHub__ = targetClass.__messagingHub__ || document.createDocumentFragment();
	return targetClass.__messagingHub__;
}

interface IComponentOptions {
	extends?: string; // tslint:disable-line:no-reserved-keywords
	useWorker?: boolean;
	useShadowDom?: boolean;
	style?: ITSS;
}

const EVENTS = {
	DONE_RENDERING: 'doneRendering',
};
function addEventListenerOnce(targetClass: ICustomElement, eventName: string, listener: (event: Event) => void): void {
	const doneRenderingListener = (event: Event) => {
		getMessagingHub(targetClass).removeEventListener(eventName, doneRenderingListener);
		listener.apply(targetClass, [event]);
	};
	getMessagingHub(targetClass).addEventListener(eventName, doneRenderingListener);
}

function createShadowDom(targetClass: ICustomElement): void {
	if (typeof targetClass.attachShadow === 'function' && !targetClass.shadowRoot) { // tslint:disable-line:no-unbound-method
		targetClass.attachShadow({mode: 'open'});
		targetClass.appendChild = targetClass.shadowRoot.appendChild.bind(targetClass.shadowRoot);
		targetClass.removeChild = targetClass.shadowRoot.removeChild.bind(targetClass.shadowRoot);
		targetClass.replaceChild = targetClass.shadowRoot.replaceChild.bind(targetClass.shadowRoot);
		targetClass.append = (targetClass.shadowRoot as any).append.bind(targetClass.shadowRoot);
		targetClass.prepend = (targetClass.shadowRoot as any).prepend.bind(targetClass.shadowRoot);
		targetClass.querySelector = targetClass.shadowRoot.querySelector.bind(targetClass.shadowRoot);
		targetClass.querySelectorAll = targetClass.shadowRoot.querySelectorAll.bind(targetClass.shadowRoot);
		Object.defineProperty(targetClass, 'childNodes', {
			get(): any { // tslint:disable-line:no-reserved-keywords
				return targetClass.shadowRoot.childNodes;
			},
		});
		Object.defineProperty(targetClass, 'children', {
			get(): any { // tslint:disable-line:no-reserved-keywords
				return targetClass.shadowRoot.children;
			},
		});
		Object.defineProperty(targetClass, 'childElementCount', {
			get(): any { // tslint:disable-line:no-reserved-keywords
				return targetClass.shadowRoot.childElementCount;
			},
		});
		Object.defineProperty(targetClass, 'firstElementChild', {
			get(): any { // tslint:disable-line:no-reserved-keywords
				return targetClass.shadowRoot.firstElementChild;
			},
		});
		Object.defineProperty(targetClass, 'lastElementChild', {
			get(): any { // tslint:disable-line:no-reserved-keywords
				return targetClass.shadowRoot.lastElementChild;
			},
		});
	}
}

export function component(name: string, options: IComponentOptions = {}): (targetClass: IConstructable) => void {
	return function(targetClass: IConstructable): void {

		let previousTemplate: JSX.Element = null;
		const originalRender = targetClass.prototype.render;
		targetClass.prototype.render = function(): JSX.Element {
			if (!originalRender) {
				return undefined;
			}
			const template = originalRender.apply(this);

			const worker = render(this, template, previousTemplate, options.useWorker !== false);
			if (worker) {
				const workerListener = (message: MessageEvent) => {
					if (message.data.action === 'done') {
						worker.removeEventListener('message', workerListener);
						getMessagingHub(this).dispatchEvent(new CustomEvent<{}>(EVENTS.DONE_RENDERING));
					}
				};
				worker.addEventListener('message', workerListener);
			} else {
				getMessagingHub(this).dispatchEvent(new CustomEvent<{}>(EVENTS.DONE_RENDERING));
			}
			previousTemplate = template;
			return template;
		};

		const original = targetClass.prototype.connectedCallback;
		let isStyleAdded = false;
		targetClass.prototype.connectedCallback = function(): void {
			if (options.useShadowDom !== false) {
				createShadowDom(this);
			}

			addEventListenerOnce(this, EVENTS.DONE_RENDERING, () => {
				if (options.style && !isStyleAdded) {
					isStyleAdded = true;
					const namespace: ITSS = {};
					namespace[this.shadowRoot ? ':host' : name] = options.style;
					const css = parse(namespace);
					const cssBlob = new Blob([css], {type : 'text/css'});
					const cssURL = URL.createObjectURL(cssBlob);
					const link = document.createElement('link');
					link.setAttribute('rel', 'stylesheet');
					link.setAttribute('type', 'text/css');
					link.setAttribute('href', cssURL);
					this.appendChild(link);
				}
			});

			this.render();

			if (original) {
				original.apply(this);
			}
		};

		let defineOptions: ElementDefinitionOptions;
		if (options.extends) {
			defineOptions = {
				extends: options.extends,
			};
		}

		customElements.define(name, targetClass, defineOptions);
	};
}

export function state(): DecoratorFactory {
	return function(targetPrototype: ICustomElement, propertyKey: string): void {
		if (!targetPrototype.__stateRender__) {
			const original = targetPrototype.render; // tslint:disable-line:no-unbound-method
			targetPrototype.render = function(): JSX.Element {
				if (typeof targetPrototype.__stateRender__ !== 'function') { // tslint:disable-line:no-unbound-method
					addEventListenerOnce(this, EVENTS.DONE_RENDERING, () => {
						targetPrototype.__stateRender__ = debounce(this.render.bind(this)) as any;
					});
				}

				let renderValue;
				if (original) {
					renderValue = original.apply(this);
				}
				return renderValue;
			};
			targetPrototype.__stateRender__ = true;
		}


		let value: any = null;
		Object.defineProperty(targetPrototype, propertyKey, {
			get(): any { // tslint:disable-line:no-reserved-keywords
				return value;
			},
			set(newValue: any): void { // tslint:disable-line:no-reserved-keywords
				value = newValue;
				if (typeof targetPrototype.__stateRender__ === 'function') { // tslint:disable-line:no-unbound-method
					targetPrototype.__stateRender__();
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
		targetPrototype.render = function(): JSX.Element {
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
