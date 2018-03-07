interface ICustomElement extends HTMLElement {
	__attributes__?: {[key: string]: number};
	__attributeListeners__?: {[key: string]: string};
	__attributeListenersPending__?: {[key: string]: {newValue: string; oldValue: string}};
	__eventListeners__?: {[key: string]: string};
	__domNodes__?: {[key: string]: string};
	__component__?: {
		isConnected?: number;
		messagingHub?: DocumentFragment;
		previousRenderResult?: JSX.Element;
		isStyleAdded?: boolean;
		debounceRender(): void;
	};

	constructor: ICustomElementConstructor; // tslint:disable-line:no-reserved-keywords

	__attributesWatch__(): void;

	append?(...value: (Node|string)[]): void; // experimental feature
	prepend?(...value: (Node|string)[]): void; // experimental feature

	connectedCallback?(): void;
	disconnectedCallback?(): void;
	attributeChangedCallback?(name: string, oldValue: string, newValue: string): void;
	render(): JSX.Element;
}
interface ICustomElementConstructor extends Function {
	observedAttributes?: string[];
}

type DecoratorFactory<T> = (targetPrototype: T, propertyKey: string) => void;

type Constructor<T> = new (...args: any[]) => T;

declare module '*.html' {
	const value: string;
	export default value;
}
