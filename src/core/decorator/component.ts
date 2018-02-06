
import 'document-register-element'; // tslint:disable-line:no-import-side-effect

import { parse, ITSS } from '../tss';
import { render } from '../tsx';
import { addEventListenerOnce, EVENTS, CONNECTION_STATE } from './_helpers';
import { debounce } from '../..';

interface IComponentOptions {
	extends?: string; // tslint:disable-line:no-reserved-keywords
	useWorker?: boolean;
	useShadowDom?: boolean;
	style?: ITSS;
}

// create the shadow root and map all dom method/property to the main node
function createShadowDom(targetClass: ICustomElement): void {
	if (typeof targetClass.attachShadow === 'function' && !targetClass.shadowRoot) { // tslint:disable-line:no-unbound-method
		targetClass.attachShadow({mode: 'open'});
		targetClass.addEventListener = targetClass.shadowRoot.addEventListener.bind(targetClass.shadowRoot);
		targetClass.removeEventListener = targetClass.shadowRoot.removeEventListener.bind(targetClass.shadowRoot);
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

// this decorator is used to declare a custom element.
// It wil configure it, register it and render its style
export function component(name: string, options: IComponentOptions = {}): (targetClass: Constructor<ICustomElement>) => void {
	return (targetClass: Constructor<ICustomElement>): void => {
		if (!Object.getOwnPropertyDescriptor(targetClass.prototype, '__component__')) {
			Object.defineProperty(targetClass.prototype, '__component__', {
				value: {
					debounceRender: null,
					isConnected: CONNECTION_STATE.NEVER_CONNECTED,
					isStyleAdded: false,
					messagingHub: null,
					previousRenderResult: null,
				},
			});
		}

		const originalRender = targetClass.prototype.render;
		targetClass.prototype.render = function(): JSX.Element {
			const renderResult = originalRender.apply(this);
			const worker = render(this, renderResult, this.__component__.previousRenderResult, options.useWorker !== false);
			if (worker) {
				const workerListener = (message: MessageEvent) => {
					if (message.data.action === 'done') {
						worker.removeEventListener('message', workerListener);
						(this as ICustomElement).__component__.messagingHub.dispatchEvent(new CustomEvent<{}>(EVENTS.DONE_RENDERING, { bubbles: false }));
					}
				};
				worker.addEventListener('message', workerListener);
			} else {
				(this as ICustomElement).__component__.messagingHub.dispatchEvent(new CustomEvent<{}>(EVENTS.DONE_RENDERING, { bubbles: false }));
			}
			(this as ICustomElement).__component__.previousRenderResult = renderResult;
			return renderResult;
		};

		const originalConnectedCallback = targetClass.prototype.connectedCallback;
		targetClass.prototype.connectedCallback = function(): void {
			if (!Object.getOwnPropertyDescriptor(this, '__component__')) {
				Object.defineProperty(this, '__component__', {
					value: {
						debounceRender: (this as ICustomElement).__component__.debounceRender = debounce(this.render.bind(this)),
						isConnected: CONNECTION_STATE.CONNECTED_ONCE,
						isStyleAdded: false,
						messagingHub: document.createDocumentFragment(),
						previousRenderResult: null,
					},
				});
			} else {
				(this as ICustomElement).__component__.isConnected = CONNECTION_STATE.CONNECTED_MULTIPLE;
			}

			if ((this as ICustomElement).__component__.isConnected === CONNECTION_STATE.CONNECTED_ONCE) {
				if (options.useShadowDom !== false) {
					createShadowDom(this);
				}

				addEventListenerOnce(this, EVENTS.DONE_RENDERING, () => {
					if (options.style && !(this as ICustomElement).__component__.isStyleAdded) {
						(this as ICustomElement).__component__.isStyleAdded = true;
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
			}

			if (originalConnectedCallback) {
				originalConnectedCallback.apply(this);
			}
		};

		const originalDisconnectedCallback = targetClass.prototype.disconnectedCallback;
		targetClass.prototype.disconnectedCallback = function(): void {
			(this as ICustomElement).__component__.isConnected = CONNECTION_STATE.NOT_CONNECTED;
			if (originalDisconnectedCallback) {
				originalDisconnectedCallback.apply(this);
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
