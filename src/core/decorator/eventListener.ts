export function eventListener(eventSelector: string): DecoratorFactory<ICustomElement> {
	return (targetPrototype: ICustomElement, propertyKey: string): void => {
		if (!Object.getOwnPropertyDescriptor(targetPrototype, '__eventListeners__')) {
			Object.defineProperty(targetPrototype, '__eventListeners__', {
				value: {},
			});

			const original = targetPrototype.connectedCallback; // tslint:disable-line:no-unbound-method
			targetPrototype.connectedCallback = function(): void {
				if (original) {
					original.apply(this);
				}

				Object.keys(targetPrototype.__eventListeners__).forEach((selector) => {
					const key = targetPrototype.__eventListeners__[selector];

					const eventParts: string[] = selector.split(':');
					const eventName: string = eventParts.pop();
					const handler = this[key].bind(this);

					this.addEventListener(eventName, (event: Event) => {
						const cssSelector: string = eventParts[0];
						const matches = cssSelector ? (event.target as Element).matches(cssSelector) : true;
						if (matches) {
							handler(event);
						}
					});

				});
			};

		}
		targetPrototype.__eventListeners__[eventSelector] = propertyKey;
	};
}
