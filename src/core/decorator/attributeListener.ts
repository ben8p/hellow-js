import { CONNECTION_STATE } from './_helpers';

// this decorator is used to declare a attribute change listener.
// Every change to the attribute will trigger the defined change handler
export function attributeListener(attributeName: string): DecoratorFactory<ICustomElement> {
	return (targetPrototype: ICustomElement, propertyKey: string): void => {
		targetPrototype.constructor.observedAttributes = [attributeName, ...(targetPrototype.constructor.observedAttributes || [])];
		if (!Object.getOwnPropertyDescriptor(targetPrototype, '__attributeListeners__')) {
			Object.defineProperty(targetPrototype, '__attributeListeners__', {
				value: {},
			});

			const originalAttributeChangedCallback = targetPrototype.attributeChangedCallback; // tslint:disable-line:no-unbound-method
			targetPrototype.attributeChangedCallback = function(name: string, oldValue: string, newValue: string): void {
				if ((this as ICustomElement).__component__.isConnected === CONNECTION_STATE.NEVER_CONNECTED || (this as ICustomElement).__component__.isConnected === CONNECTION_STATE.NOT_CONNECTED) {
					if (!Object.getOwnPropertyDescriptor(this, '__attributeListenersPending__')) {
						Object.defineProperty(this, '__attributeListenersPending__', {
							value: {},
						});
					}
					(this as ICustomElement).__attributeListenersPending__[name] = {oldValue, newValue};
					return;
				}
				if (originalAttributeChangedCallback) {
					originalAttributeChangedCallback.apply(this, [name, oldValue, newValue]);
				}
				const key = (this as ICustomElement).__attributeListeners__[name];
				if (oldValue !== newValue && key) {
					this[key].apply(this, [newValue, oldValue]);
				}
			};

			const originalConnectedCallback = targetPrototype.connectedCallback; // tslint:disable-line:no-unbound-method
			targetPrototype.connectedCallback = function(): void {
				if (originalConnectedCallback) {
					originalConnectedCallback.apply(this);
				}
				Object.keys((this as ICustomElement).__attributeListenersPending__).forEach((pendingAttribute: string) => {
					const { newValue, oldValue } = (this as ICustomElement).__attributeListenersPending__[pendingAttribute];
					delete (this as ICustomElement).__attributeListenersPending__[pendingAttribute];
					this.attributeChangedCallback(pendingAttribute, oldValue, newValue);
				});
			};

		}
		targetPrototype.__attributeListeners__[attributeName] = propertyKey;
	};
}
