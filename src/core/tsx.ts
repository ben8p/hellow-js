export function tsx(type: JSX.Element['type'], attributes: JSX.Element['attributes'], ...children: JSX.Element['children']): JSX.Element { // tslint:disable-line:no-reserved-keywords
	return { type, attributes, children };
}

function createElement(virtualNode: JSX.Element): Node {
	if (typeof virtualNode === 'string') {
		return document.createTextNode(virtualNode);
	}
	const node = document.createElement(virtualNode.type);
	updateAttributes(node, virtualNode);
	Array.prototype.map.call(virtualNode.children, createElement).forEach(node.appendChild.bind(node));
	return node;
}

function updateAttributes(node: HTMLElement, newVirtualNode: JSX.Element, oldVirtualNode?: JSX.Element): void {
	const oldAttributes: JSX.Element['attributes'] = {};
	Object.assign(oldAttributes, (oldVirtualNode && oldVirtualNode.attributes) || {});
	Object.keys(newVirtualNode.attributes || {}).forEach((key) => {
		node.setAttribute(key, newVirtualNode.attributes[key]);
		delete oldAttributes[key];
	});
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
let worker: Worker;

export function render(parentNode: Node, currentVirtualNode: JSX.Element, previousVirtualNode: JSX.Element, useWorker: boolean = true): Worker {
	const postMessage = (data: {[key: string]: any}, _transferList?: any) => {
		let node: Node = parentNode;
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
				// do nothing
		}
	};

	function renderWorker(newVirtualNode: JSX.Element, oldVirtualNode: JSX.Element, path: number[] = [], index: number = 0): void {
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
		renderWorker(message.data.newVirtualNode, message.data.oldVirtualNode);
		postMessage({
			action: 'done',
		});
	}

	if (useWorker && canUseWorker) {
		if (!worker) {
			const blob = new Blob([`
				${nodeHasChanged.toString()}
				${attributesHaveChanged.toString()}
				${renderWorker.toString()}
				onmessage = ${onMessageReceivedByWorker.toString()}
			`]);
			const blobURL = URL.createObjectURL(blob);
			worker = new Worker(blobURL);
		}
		worker.onmessage = (message: MessageEvent) => {
			if (message.data.action === 'done') {
				return;
			}
			postMessage(message.data);
		};
		worker.postMessage({
			newVirtualNode: currentVirtualNode,
			oldVirtualNode: previousVirtualNode,
		});
		return worker;
	}
	renderWorker(currentVirtualNode, previousVirtualNode);
	return undefined;
}
