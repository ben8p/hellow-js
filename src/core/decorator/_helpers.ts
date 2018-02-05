// tslint:disable:variable-name
export enum ATTRIBUTE {
	NUMBER,
	BOOLEAN,
	STRING,
}

export enum EVENTS {
	DONE_RENDERING = 'doneRendering',
}

export function addEventListenerOnce(targetClass: ICustomElement, eventName: string, listener: (event: Event) => void): void {
	const doneRenderingListener = (event: Event) => {
		targetClass.__component__.messagingHub.removeEventListener(eventName, doneRenderingListener);
		listener.apply(targetClass, [event]);
	};
	targetClass.__component__.messagingHub.addEventListener(eventName, doneRenderingListener);
}

export function getAttribute(targetPrototype: ICustomElement, propertyKey: string, attributeType: ATTRIBUTE): string|number|boolean {
	const value = targetPrototype.getAttribute(propertyKey);
	if (attributeType === ATTRIBUTE.NUMBER) {
		return parseFloat(value);
	}
	if (attributeType === ATTRIBUTE.BOOLEAN) {
		return value !== null;
	}
	return value;
}

export function setAttribute(targetPrototype: ICustomElement, propertyKey: string, value: any, attributeType: ATTRIBUTE): void {
	if (attributeType === ATTRIBUTE.BOOLEAN) {
		if (value) {
			targetPrototype.setAttribute(propertyKey, '');
		} else {
			targetPrototype.removeAttribute(propertyKey);
		}
		return;
	}
	targetPrototype.setAttribute(propertyKey, value.toString());
}
