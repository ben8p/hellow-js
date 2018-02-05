// tslint:disable:variable-name
import { ATTRIBUTE, getAttribute, setAttribute } from './_helpers';
import { attributeListener } from './attributeListener';

interface IAttributeOptions {
	state?: boolean;
}

export function attribute(attributeType: ATTRIBUTE, options: IAttributeOptions = {}): DecoratorFactory<ICustomElement> {
	return (targetPrototype: ICustomElement, propertyKey: string): void => {
		if (!Object.getOwnPropertyDescriptor(targetPrototype, '__attributes__')) {
			Object.defineProperty(targetPrototype, '__attributes__', {
				value: {},
			});
		}
		if (!Object.getOwnPropertyDescriptor(targetPrototype, '__attributesWatch__')) {
			Object.defineProperty(targetPrototype, '__attributesWatch__', {
				value: function __attributesWatch__(): void {
					if (typeof (this as ICustomElement).__component__.debounceRender === 'function') { // tslint:disable-line:no-unbound-method
						(this as ICustomElement).__component__.debounceRender();
					}
				},
			});
		}
		targetPrototype.__attributes__[propertyKey] = attributeType;

		if (options.state) {
			// add the property to the observed ones
			attributeListener(propertyKey)(targetPrototype, '__attributesWatch__');
		}

		if (!Object.getOwnPropertyDescriptor(targetPrototype, propertyKey)) {
			Object.defineProperty(targetPrototype, propertyKey, {
				configurable: true, // so it can be overridden by state()
				get(): any { // tslint:disable-line:no-reserved-keywords
					return getAttribute(this, propertyKey, attributeType);
				},
				set(newValue: any): void { // tslint:disable-line:no-reserved-keywords
					if ((this as ICustomElement).__component__.isConnected) {
						setAttribute(this, propertyKey, newValue, attributeType);
					}
				},
			});
		}
	};
}
