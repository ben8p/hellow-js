export function attributeListener(attributeName: string): DecoratorFactory<ICustomElement> {
	return (targetPrototype: ICustomElement, propertyKey: string): void => {
		targetPrototype.constructor.observedAttributes = [attributeName, ...(targetPrototype.constructor.observedAttributes || [])];
		if (!Object.getOwnPropertyDescriptor(targetPrototype, '__attributeListeners__')) {
			Object.defineProperty(targetPrototype, '__attributeListeners__', {
				value: {},
			});

			const original = targetPrototype.attributeChangedCallback; // tslint:disable-line:no-unbound-method
			targetPrototype.attributeChangedCallback = function(name: string, oldValue: string, newValue: string): void {
				if (!(this as ICustomElement).__component__.isConnected) {
					return;
				}
				if (original) {
					original.apply(this, [name, oldValue, newValue]);
				}
				const key = (this as ICustomElement).__attributeListeners__[name];
				if (oldValue !== newValue && key) {
					this[key].apply(this, [newValue, oldValue]);
				}
			};

		}
		targetPrototype.__attributeListeners__[attributeName] = propertyKey;
	};
}
