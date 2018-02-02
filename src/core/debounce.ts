export function debounce(method: Function, delay: number = 4): Function { // https://stackoverflow.com/questions/9647215/what-is-minimum-millisecond-value-of-settimeout
	let timeoutHandle: number;
	return (...kwArgs: any[]) => {
		if (timeoutHandle) {
			clearTimeout(timeoutHandle);
		}

		timeoutHandle = setTimeout(() => {
			method(...kwArgs);
		}, delay);
	};
}
