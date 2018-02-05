
// tslint:disable:variable-name

import { getAttribute, setAttribute } from './_helpers';

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
				if (targetPrototype.__attributes__[propertyKey] !== undefined) {
					return getAttribute(this, propertyKey, targetPrototype.__attributes__[propertyKey]);
				}
				return value;
			},
			set(newValue: any): void { // tslint:disable-line:no-reserved-keywords
				value = newValue;
				if (this.__component__.isConnected && targetPrototype.__attributes__[propertyKey] !== undefined) {
					setAttribute(this, propertyKey, newValue, targetPrototype.__attributes__[propertyKey]);
				}
				if (typeof this.__component__.debounceRender === 'function') { // tslint:disable-line:no-unbound-method
					this.__component__.debounceRender();
				}
			},
		});
	};
}
