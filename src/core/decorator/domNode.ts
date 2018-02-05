import { addEventListenerOnce, EVENTS } from './_helpers';

export function domNode(cssSelector: string): DecoratorFactory<ICustomElement> {
	return (targetPrototype: ICustomElement, propertyKey: string): void => {
		if (!Object.getOwnPropertyDescriptor(targetPrototype, '__domNodes__')) {
			Object.defineProperty(targetPrototype, '__domNodes__', {
				value: {},
			});

			const original = targetPrototype.render; // tslint:disable-line:no-unbound-method
			targetPrototype.render = function(): JSX.Element {
				addEventListenerOnce(this, EVENTS.DONE_RENDERING, () => {
					Object.keys(targetPrototype.__domNodes__).forEach((selector) => {
						this[targetPrototype.__domNodes__[selector]] = this.querySelector(selector);
					});
				});

				return original.apply(this);
			};

		}
		targetPrototype.__domNodes__[cssSelector] = propertyKey;
	};
}
