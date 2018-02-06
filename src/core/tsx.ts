// JSX rendering

export function tsx(type: JSX.Element['type'], attributes: JSX.Element['attributes'], ...childNodes: JSX.Element['children']): JSX.Element { // tslint:disable-line:no-reserved-keywords
	let children = childNodes;
	// makes sure children is always an array of JSX.Element and not an array of arrays of JSXELEMENT (can happens when using loops in JSX)
	if (children && children[0] instanceof Array) {
		children = children.reduce((accumulator: JSX.Element['children'], currentValue: JSX.Element) => {
			accumulator.push(...currentValue as any);
			return accumulator;
		}, []);
	}
	return { type, attributes, children };
}

function createElement(virtualNode: JSX.Element): Node {
	// create dom element and populate attributes when needed...
	if (typeof virtualNode === 'string') {
		return document.createTextNode(virtualNode);
	}
	const node = document.createElement(virtualNode.type);
	updateAttributes(node, virtualNode);
	// ... and does it recursively
	Array.prototype.map.call(virtualNode.children, createElement).forEach(node.appendChild.bind(node));
	return node;
}

function updateAttributes(node: HTMLElement, newVirtualNode: JSX.Element, oldVirtualNode?: JSX.Element): void {
	const oldAttributes: JSX.Element['attributes'] = {};
	// keep track of previous node attributes
	Object.assign(oldAttributes, (oldVirtualNode && oldVirtualNode.attributes) || {});
	// populate the new and updated attributes
	Object.keys(newVirtualNode.attributes || {}).forEach((key) => {
		if ((newVirtualNode.attributes[key] as any) !== false) {
			node.setAttribute(key, newVirtualNode.attributes[key]);
		} else {
			node.removeAttribute(key);
		}
		delete oldAttributes[key];
	});
	// remove the left overs
	Object.keys(oldAttributes).forEach((key) => {
		node.removeAttribute(key);
	});
}

function nodeHasChanged(node1: JSX.Element, node2: JSX.Element): boolean {
	return typeof node1 !== typeof node2 || (typeof node1 === 'string' && node1 !== node2) || node1.type !== node2.type;
}
function attributesHaveChanged(node1: JSX.Element, node2: JSX.Element): boolean {
	if (typeof node2 === 'string') { return true; }
	return JSON.stringify(node1.attributes) !== JSON.stringify(node2.attributes);
}

const canUseWorker = 'Worker' in window && 'Blob' in window && 'URL' in window;

// tslint:disable-next-line:max-func-body-length
export function render(parentNode: Node, currentVirtualNode: JSX.Element, previousVirtualNode: JSX.Element, useWorker: boolean = true): Worker {
	// this takes care of the sunc/async rendering (depending if workers are used or not)

	const postMessage = (data: {[key: string]: any}, _transferList?: any) => {
		// a message can come from worker or be sync. It contains info about what to do and where to do it.
		let node: Node = parentNode;
		// because worker can't deal with node, it provides the path to reach a node,
		// so let's follow it...
		if (data.path.length > 0) {
			data.path.forEach((childIndex: number) => {
				node = node.childNodes[childIndex];
			});
		}
		switch (data.action) {
			case 'appendChild':
				node.appendChild(createElement(data.node));
				break;
			case 'removeChild':
				node.removeChild(node.childNodes[data.index]);
				break;
			case 'replaceChild':
				node.replaceChild(createElement(data.node), node.childNodes[data.index]);
				break;
			case 'updateAttributes':
				updateAttributes(node.childNodes[data.index] as HTMLElement, data.node, data.oldNode);
				break;
			default:
				// action unknown - do nothing
		}
	};

	function renderWorker(newVirtualNode: JSX.Element, oldVirtualNode: JSX.Element, path: number[] = [], index: number = 0): void {
		// this indirect render method is used sync or async (from worker)
		// it compute what needs to be done and pass it over to the postMessage. This way the worker does not have to deal with node, the action handleling can take place outside
		if (!oldVirtualNode) {
			postMessage({
				action: 'appendChild',
				node: newVirtualNode,
				path,
			});
		} else if (!newVirtualNode) {
			postMessage({
				action: 'removeChild',
				index,
				path,
			});
		} else if (nodeHasChanged(newVirtualNode, oldVirtualNode)) {
			postMessage({
				action: 'replaceChild',
				index,
				node: newVirtualNode,
				path,
			});
		} else if (newVirtualNode.type) {
			if (attributesHaveChanged(newVirtualNode, oldVirtualNode)) {
				postMessage({
					action: 'updateAttributes',
					index,
					node: newVirtualNode,
					oldNode: oldVirtualNode,
					path,
				});
			}
			const newLength = newVirtualNode.children.length;
			const oldLength = oldVirtualNode.children.length;
			for (let i = 0; i < newLength || i < oldLength; i++) {
				renderWorker(newVirtualNode.children[i], oldVirtualNode.children[i], [...path, index], i);
			}
		}
	}

	function onMessageReceivedByWorker(message: MessageEvent): void {
		// Executed only inside the worker.
		// when the code from the main thread talks to the workers, the message ends up here
		renderWorker(message.data.newVirtualNode, message.data.oldVirtualNode);
		// inform the worker is done
		postMessage({
			action: 'done',
		});
		// free the worker
		close();
	}

	if (useWorker && canUseWorker) {
		// create a blob containing all javascrit code needed to run inside the worker
		const blob = new Blob([`
			${nodeHasChanged.toString()}
			${attributesHaveChanged.toString()}
			${renderWorker.toString()}
			onmessage = ${onMessageReceivedByWorker.toString()}
		`]);
		// create the worker based on the previous inlined code
		const blobURL = URL.createObjectURL(blob);
		const worker: Worker = new Worker(blobURL);

		worker.onmessage = (message: MessageEvent) => {
			// when the worker post a message, it ends up here
			if (message.data.action === 'done') {
				return;
			}
			// this is the postMessage function defined at the beggining of the render function
			postMessage(message.data);
		};
		// ask the worker to do its job
		worker.postMessage({
			newVirtualNode: currentVirtualNode,
			oldVirtualNode: previousVirtualNode,
		});
		return worker;
	}
	// no worker, then we do a sync rendering
	renderWorker(currentVirtualNode, previousVirtualNode);
	return undefined;
}
