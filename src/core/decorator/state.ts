
// tslint:disable:variable-name

import { getAttribute, setAttribute, CONNECTION_STATE } from './_helpers';

// this decorator is used to declare a state property.
// A state property will trigger a render every time it is changed
export function state(): DecoratorFactory<ICustomElement> {
	return (targetPrototype: ICustomElement, propertyKey: string): void => {
		if (!Object.getOwnPropertyDescriptor(targetPrototype, '__attributes__')) {
			Object.defineProperty(targetPrototype, '__attributes__', {
				value: {},
			});
		}

		let value: any = null;
		Object.defineProperty(targetPrototype, propertyKey, {
			configurable: false,
			get(): any { // tslint:disable-line:no-reserved-keywords
				// if the property is an attribute, we don't use local value, we use the attribute one
				if (targetPrototype.__attributes__[propertyKey] !== undefined) {
					return getAttribute(this, propertyKey, targetPrototype.__attributes__[propertyKey]);
				}
				return value;
			},
			set(newValue: any): void { // tslint:disable-line:no-reserved-keywords
				value = newValue;
				// if the property is an attribute, we don't use local value, we use the attribute one
				if ((this.__component__.isConnected === CONNECTION_STATE.CONNECTED_MULTIPLE || this.__component__.isConnected === CONNECTION_STATE.CONNECTED_ONCE) && targetPrototype.__attributes__[propertyKey] !== undefined) {
					setAttribute(this, propertyKey, newValue, targetPrototype.__attributes__[propertyKey]);
				}
				// make sure we render after the update
				if (typeof this.__component__.debounceRender === 'function') { // tslint:disable-line:no-unbound-method
					this.__component__.debounceRender();
				}
			},
		});
	};
}
