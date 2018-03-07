export function debounce(method: Function, delay: number = 4): (...kwArgs: any[]) => void { // https://stackoverflow.com/questions/9647215/what-is-minimum-millisecond-value-of-settimeout
	// allow to debounce any method, while keeping the arguments of the last call
	let timeoutHandle: number;
	return (...kwArgs: any[]) => {
		if (timeoutHandle) {
			clearTimeout(timeoutHandle);
		}
		timeoutHandle = window.setTimeout(() => {
			method(...kwArgs);
		}, delay);
	};
}
