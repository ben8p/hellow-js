export function tsx(type: JSX.Element['type'], props: JSX.Element['props'], ...children: JSX.Element['children']): JSX.Element { // tslint:disable-line:no-reserved-keywords
	return { type, props, children };
}

function createElement(virtualNode: JSX.Element): Node {
	if (typeof virtualNode === 'string') {
		return document.createTextNode(virtualNode);
	}
	const node = document.createElement(virtualNode.type);
	Array.prototype.map.call(virtualNode.children, createElement).forEach(node.appendChild.bind(node));
	return node;
}

function changed(node1: JSX.Element, node2: JSX.Element): boolean {
	return typeof node1 !== typeof node2 || typeof node1 === 'string' && node1 !== node2 || node1.type !== node2.type;
}

export function render(parentNode: Node, newVirtualNode: JSX.Element, oldVirtualNode: JSX.Element, index: number = 0): void {
	if (!oldVirtualNode) {
		parentNode.appendChild(createElement(newVirtualNode));
	} else if (!newVirtualNode) {
		parentNode.removeChild(parentNode.childNodes[index]);
	} else if (changed(newVirtualNode, oldVirtualNode)) {
		parentNode.replaceChild(createElement(newVirtualNode), parentNode.childNodes[index]);
	} else if (newVirtualNode.type) {
		const newLength = newVirtualNode.children.length;
		const oldLength = oldVirtualNode.children.length;
		for (let i = 0; i < newLength || i < oldLength; i++) {
			render(parentNode.childNodes[index], newVirtualNode.children[i], oldVirtualNode.children[i], i);
		}
	}
}
