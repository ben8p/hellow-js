(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lib_1 = require("../../lib");
let MyGreetings = class MyGreetings extends HTMLElement {
    constructor() {
        super(...arguments);
        this.userName = 'Mr. Nobody';
        this.keyUpCount = 0;
    }
    render() {
        return (lib_1.tsx("div", null,
            lib_1.tsx("h1", null,
                "Hello ",
                lib_1.tsx("span", null, this.userName)),
            lib_1.tsx("label", { "data-refresh-count": this.keyUpCount }, "Fill in your name:"),
            lib_1.tsx("input", { "data-node": 'inputNode', type: 'text' })));
    }
    onKeyUp() {
        this.keyUpCount++;
        this.userName = this.inputNode.value;
    }
};
tslib_1.__decorate([
    lib_1.state() // any change to this property will re-render
], MyGreetings.prototype, "userName", void 0);
tslib_1.__decorate([
    lib_1.state() // any change to this property will re-render
], MyGreetings.prototype, "keyUpCount", void 0);
tslib_1.__decorate([
    lib_1.domNode('[data-node=inputNode]') // this will attach the node matching the css selector to the class member
], MyGreetings.prototype, "inputNode", void 0);
tslib_1.__decorate([
    lib_1.eventListener('[data-node=inputNode]:keyup') // listen to key up using event delegation. Without delegation it would be @eventListener('keyup')
], MyGreetings.prototype, "onKeyUp", null);
MyGreetings = tslib_1.__decorate([
    lib_1.component('my-greetings', {
        style: {
            border: '2px solid #eee',
            display: 'block',
            h1: {
                color: 'green',
                span: {
                    'font-style': 'italic',
                },
            },
            label: {
                'font-weight': 'bold',
                margin: '0 15px 0 0',
            },
        },
    }) // this adds the component to the CustomElementRegistry
], MyGreetings);
exports.MyGreetings = MyGreetings;

},{"../../lib":12,"tslib":14}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function debounce(method, delay = 4) {
    // allow to debounce any method, while keeping the arguments of the last call
    let timeoutHandle;
    return (...kwArgs) => {
        if (timeoutHandle) {
            clearTimeout(timeoutHandle);
        }
        timeoutHandle = setTimeout(() => {
            method(...kwArgs);
        }, delay);
    };
}
exports.debounce = debounce;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:variable-name
var ATTRIBUTE;
(function (ATTRIBUTE) {
    ATTRIBUTE[ATTRIBUTE["NUMBER"] = 0] = "NUMBER";
    ATTRIBUTE[ATTRIBUTE["BOOLEAN"] = 1] = "BOOLEAN";
    ATTRIBUTE[ATTRIBUTE["STRING"] = 2] = "STRING";
})(ATTRIBUTE = exports.ATTRIBUTE || (exports.ATTRIBUTE = {}));
var EVENTS;
(function (EVENTS) {
    EVENTS["DONE_RENDERING"] = "doneRendering";
})(EVENTS = exports.EVENTS || (exports.EVENTS = {}));
var CONNECTION_STATE;
(function (CONNECTION_STATE) {
    CONNECTION_STATE[CONNECTION_STATE["CONNECTED_MULTIPLE"] = 0] = "CONNECTED_MULTIPLE";
    CONNECTION_STATE[CONNECTION_STATE["CONNECTED_ONCE"] = 1] = "CONNECTED_ONCE";
    CONNECTION_STATE[CONNECTION_STATE["NEVER_CONNECTED"] = 2] = "NEVER_CONNECTED";
    CONNECTION_STATE[CONNECTION_STATE["NOT_CONNECTED"] = 3] = "NOT_CONNECTED";
})(CONNECTION_STATE = exports.CONNECTION_STATE || (exports.CONNECTION_STATE = {}));
// Allow to connect to to the renderDone event only once, then disconnect
function addEventListenerOnce(targetClass, eventName, listener) {
    const doneRenderingListener = (event) => {
        targetClass.__component__.messagingHub.removeEventListener(eventName, doneRenderingListener);
        listener.apply(targetClass, [event]);
    };
    targetClass.__component__.messagingHub.addEventListener(eventName, doneRenderingListener);
}
exports.addEventListenerOnce = addEventListenerOnce;
// Get an attribute and returns it with the correct type
function getAttribute(targetPrototype, propertyKey, attributeType) {
    const value = targetPrototype.getAttribute(propertyKey);
    if (attributeType === ATTRIBUTE.NUMBER) {
        return parseFloat(value);
    }
    if (attributeType === ATTRIBUTE.BOOLEAN) {
        return value !== null;
    }
    return value;
}
exports.getAttribute = getAttribute;
// Set an attribute (or remove it if boolean false)
function setAttribute(targetPrototype, propertyKey, value, attributeType) {
    if (attributeType === ATTRIBUTE.BOOLEAN) {
        if (value) {
            targetPrototype.setAttribute(propertyKey, '');
        }
        else {
            targetPrototype.removeAttribute(propertyKey);
        }
        return;
    }
    targetPrototype.setAttribute(propertyKey, value.toString());
}
exports.setAttribute = setAttribute;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:variable-name
const _helpers_1 = require("./_helpers");
const attributeListener_1 = require("./attributeListener");
// this decorator is used to declare a class member as a dom property.
// When used, the value won;t be store locally. It will instead come from get/setAttribute
// Attributes can be configured as state. In this case, any changes will trigger a render
function attribute(attributeType, options = {}) {
    return (targetPrototype, propertyKey) => {
        if (!Object.getOwnPropertyDescriptor(targetPrototype, '__attributes__')) {
            Object.defineProperty(targetPrototype, '__attributes__', {
                value: {},
            });
        }
        if (!Object.getOwnPropertyDescriptor(targetPrototype, '__attributesWatch__')) {
            Object.defineProperty(targetPrototype, '__attributesWatch__', {
                value: function __attributesWatch__() {
                    if (typeof this.__component__.debounceRender === 'function') {
                        this.__component__.debounceRender();
                    }
                },
            });
        }
        targetPrototype.__attributes__[propertyKey] = attributeType;
        if (options.state) {
            // add the property to the observed ones
            attributeListener_1.attributeListener(propertyKey)(targetPrototype, '__attributesWatch__');
        }
        if (!Object.getOwnPropertyDescriptor(targetPrototype, propertyKey)) {
            Object.defineProperty(targetPrototype, propertyKey, {
                configurable: true,
                get() {
                    return _helpers_1.getAttribute(this, propertyKey, attributeType);
                },
                set(newValue) {
                    if (this.__component__.isConnected === _helpers_1.CONNECTION_STATE.CONNECTED_MULTIPLE || this.__component__.isConnected === _helpers_1.CONNECTION_STATE.CONNECTED_ONCE) {
                        _helpers_1.setAttribute(this, propertyKey, newValue, attributeType);
                    }
                },
            });
        }
    };
}
exports.attribute = attribute;

},{"./_helpers":3,"./attributeListener":5}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _helpers_1 = require("./_helpers");
// this decorator is used to declare a attribute change listener.
// Every change to the attribute will trigger the defined change handler
function attributeListener(attributeName) {
    return (targetPrototype, propertyKey) => {
        targetPrototype.constructor.observedAttributes = [attributeName, ...(targetPrototype.constructor.observedAttributes || [])];
        if (!Object.getOwnPropertyDescriptor(targetPrototype, '__attributeListeners__')) {
            Object.defineProperty(targetPrototype, '__attributeListeners__', {
                value: {},
            });
            const originalAttributeChangedCallback = targetPrototype.attributeChangedCallback; // tslint:disable-line:no-unbound-method
            targetPrototype.attributeChangedCallback = function (name, oldValue, newValue) {
                if (this.__component__.isConnected === _helpers_1.CONNECTION_STATE.NEVER_CONNECTED || this.__component__.isConnected === _helpers_1.CONNECTION_STATE.NOT_CONNECTED) {
                    if (!Object.getOwnPropertyDescriptor(this, '__attributeListenersPending__')) {
                        Object.defineProperty(this, '__attributeListenersPending__', {
                            value: {},
                        });
                    }
                    this.__attributeListenersPending__[name] = { oldValue, newValue };
                    return;
                }
                if (originalAttributeChangedCallback) {
                    originalAttributeChangedCallback.apply(this, [name, oldValue, newValue]);
                }
                const key = this.__attributeListeners__[name];
                if (oldValue !== newValue && key) {
                    this[key].apply(this, [newValue, oldValue]);
                }
            };
            const originalConnectedCallback = targetPrototype.connectedCallback; // tslint:disable-line:no-unbound-method
            targetPrototype.connectedCallback = function () {
                if (originalConnectedCallback) {
                    originalConnectedCallback.apply(this);
                }
                Object.keys(this.__attributeListenersPending__).forEach((pendingAttribute) => {
                    const { newValue, oldValue } = this.__attributeListenersPending__[pendingAttribute];
                    delete this.__attributeListenersPending__[pendingAttribute];
                    this.attributeChangedCallback(pendingAttribute, oldValue, newValue);
                });
            };
        }
        targetPrototype.__attributeListeners__[attributeName] = propertyKey;
    };
}
exports.attributeListener = attributeListener;

},{"./_helpers":3}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("document-register-element"); // tslint:disable-line:no-import-side-effect
const tss_1 = require("../tss");
const tsx_1 = require("../tsx");
const _helpers_1 = require("./_helpers");
const __1 = require("../..");
// create the shadow root and map all dom method/property to the main node
function createShadowDom(targetClass) {
    if (typeof targetClass.attachShadow === 'function' && !targetClass.shadowRoot) {
        targetClass.attachShadow({ mode: 'open' });
        targetClass.addEventListener = targetClass.shadowRoot.addEventListener.bind(targetClass.shadowRoot);
        targetClass.removeEventListener = targetClass.shadowRoot.removeEventListener.bind(targetClass.shadowRoot);
        targetClass.appendChild = targetClass.shadowRoot.appendChild.bind(targetClass.shadowRoot);
        targetClass.removeChild = targetClass.shadowRoot.removeChild.bind(targetClass.shadowRoot);
        targetClass.replaceChild = targetClass.shadowRoot.replaceChild.bind(targetClass.shadowRoot);
        targetClass.append = targetClass.shadowRoot.append.bind(targetClass.shadowRoot);
        targetClass.prepend = targetClass.shadowRoot.prepend.bind(targetClass.shadowRoot);
        targetClass.querySelector = targetClass.shadowRoot.querySelector.bind(targetClass.shadowRoot);
        targetClass.querySelectorAll = targetClass.shadowRoot.querySelectorAll.bind(targetClass.shadowRoot);
        Object.defineProperty(targetClass, 'childNodes', {
            get() {
                return targetClass.shadowRoot.childNodes;
            },
        });
        Object.defineProperty(targetClass, 'children', {
            get() {
                return targetClass.shadowRoot.children;
            },
        });
        Object.defineProperty(targetClass, 'childElementCount', {
            get() {
                return targetClass.shadowRoot.childElementCount;
            },
        });
        Object.defineProperty(targetClass, 'firstElementChild', {
            get() {
                return targetClass.shadowRoot.firstElementChild;
            },
        });
        Object.defineProperty(targetClass, 'lastElementChild', {
            get() {
                return targetClass.shadowRoot.lastElementChild;
            },
        });
    }
}
// this decorator is used to declare a custom element.
// It wil configure it, register it and render its style
function component(name, options = {}) {
    return (targetClass) => {
        if (!Object.getOwnPropertyDescriptor(targetClass.prototype, '__component__')) {
            Object.defineProperty(targetClass.prototype, '__component__', {
                value: {
                    debounceRender: null,
                    isConnected: _helpers_1.CONNECTION_STATE.NEVER_CONNECTED,
                    isStyleAdded: false,
                    messagingHub: null,
                    previousRenderResult: null,
                },
            });
        }
        const originalRender = targetClass.prototype.render;
        targetClass.prototype.render = function () {
            const renderResult = originalRender.apply(this);
            const worker = tsx_1.render(this, renderResult, this.__component__.previousRenderResult, options.useWorker !== false);
            if (worker) {
                const workerListener = (message) => {
                    if (message.data.action === 'done') {
                        worker.removeEventListener('message', workerListener);
                        this.__component__.messagingHub.dispatchEvent(new CustomEvent(_helpers_1.EVENTS.DONE_RENDERING, { bubbles: false }));
                    }
                };
                worker.addEventListener('message', workerListener);
            }
            else {
                this.__component__.messagingHub.dispatchEvent(new CustomEvent(_helpers_1.EVENTS.DONE_RENDERING, { bubbles: false }));
            }
            this.__component__.previousRenderResult = renderResult;
            return renderResult;
        };
        const originalConnectedCallback = targetClass.prototype.connectedCallback;
        targetClass.prototype.connectedCallback = function () {
            if (!Object.getOwnPropertyDescriptor(this, '__component__')) {
                Object.defineProperty(this, '__component__', {
                    value: {
                        debounceRender: this.__component__.debounceRender = __1.debounce(this.render.bind(this)),
                        isConnected: _helpers_1.CONNECTION_STATE.CONNECTED_ONCE,
                        isStyleAdded: false,
                        messagingHub: document.createDocumentFragment(),
                        previousRenderResult: null,
                    },
                });
            }
            else {
                this.__component__.isConnected = _helpers_1.CONNECTION_STATE.CONNECTED_MULTIPLE;
            }
            if (this.__component__.isConnected === _helpers_1.CONNECTION_STATE.CONNECTED_ONCE) {
                if (options.useShadowDom !== false) {
                    createShadowDom(this);
                }
                _helpers_1.addEventListenerOnce(this, _helpers_1.EVENTS.DONE_RENDERING, () => {
                    if (options.style && !this.__component__.isStyleAdded) {
                        this.__component__.isStyleAdded = true;
                        const namespace = {};
                        namespace[this.shadowRoot ? ':host' : name] = options.style;
                        const css = tss_1.parse(namespace);
                        const cssBlob = new Blob([css], { type: 'text/css' });
                        const cssURL = URL.createObjectURL(cssBlob);
                        const link = document.createElement('link');
                        link.setAttribute('rel', 'stylesheet');
                        link.setAttribute('type', 'text/css');
                        link.setAttribute('href', cssURL);
                        this.appendChild(link);
                    }
                });
                this.render();
            }
            if (originalConnectedCallback) {
                originalConnectedCallback.apply(this);
            }
        };
        const originalDisconnectedCallback = targetClass.prototype.disconnectedCallback;
        targetClass.prototype.disconnectedCallback = function () {
            this.__component__.isConnected = _helpers_1.CONNECTION_STATE.NOT_CONNECTED;
            if (originalDisconnectedCallback) {
                originalDisconnectedCallback.apply(this);
            }
        };
        let defineOptions;
        if (options.extends) {
            defineOptions = {
                extends: options.extends,
            };
        }
        customElements.define(name, targetClass, defineOptions);
    };
}
exports.component = component;

},{"../..":12,"../tss":10,"../tsx":11,"./_helpers":3,"document-register-element":13}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _helpers_1 = require("./_helpers");
// this decorator is used to reference a dom node inside your code.
// It will execute the querySelector and attach any result provided
function domNode(cssSelector) {
    return (targetPrototype, propertyKey) => {
        if (!Object.getOwnPropertyDescriptor(targetPrototype, '__domNodes__')) {
            Object.defineProperty(targetPrototype, '__domNodes__', {
                value: {},
            });
            const original = targetPrototype.render; // tslint:disable-line:no-unbound-method
            targetPrototype.render = function () {
                _helpers_1.addEventListenerOnce(this, _helpers_1.EVENTS.DONE_RENDERING, () => {
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
exports.domNode = domNode;

},{"./_helpers":3}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _helpers_1 = require("./_helpers");
// this decorator is used to declare a dom event listener.
// It will connect the event to the main node and use event delegation
function eventListener(eventSelector) {
    return (targetPrototype, propertyKey) => {
        if (!Object.getOwnPropertyDescriptor(targetPrototype, '__eventListeners__')) {
            Object.defineProperty(targetPrototype, '__eventListeners__', {
                value: {},
            });
            const original = targetPrototype.connectedCallback; // tslint:disable-line:no-unbound-method
            targetPrototype.connectedCallback = function () {
                if (original) {
                    original.apply(this);
                }
                if (this.__component__.isConnected === _helpers_1.CONNECTION_STATE.CONNECTED_ONCE) {
                    Object.keys(targetPrototype.__eventListeners__).forEach((selector) => {
                        const key = targetPrototype.__eventListeners__[selector];
                        const eventParts = selector.split(':');
                        const eventName = eventParts.pop();
                        const handler = this[key].bind(this);
                        this.addEventListener(eventName, (event) => {
                            const cssSelector = eventParts[0];
                            const matches = cssSelector ? event.target.matches(cssSelector) : true;
                            if (matches) {
                                handler(event);
                            }
                        });
                    });
                }
            };
        }
        targetPrototype.__eventListeners__[eventSelector] = propertyKey;
    };
}
exports.eventListener = eventListener;

},{"./_helpers":3}],9:[function(require,module,exports){
"use strict";
// tslint:disable:variable-name
Object.defineProperty(exports, "__esModule", { value: true });
const _helpers_1 = require("./_helpers");
// this decorator is used to declare a state property.
// A state property will trigger a render every time it is changed
function state() {
    return (targetPrototype, propertyKey) => {
        if (!Object.getOwnPropertyDescriptor(targetPrototype, '__attributes__')) {
            Object.defineProperty(targetPrototype, '__attributes__', {
                value: {},
            });
        }
        let value = null;
        Object.defineProperty(targetPrototype, propertyKey, {
            configurable: false,
            get() {
                // if the property is an attribute, we don't use local value, we use the attribute one
                if (targetPrototype.__attributes__[propertyKey] !== undefined) {
                    return _helpers_1.getAttribute(this, propertyKey, targetPrototype.__attributes__[propertyKey]);
                }
                return value;
            },
            set(newValue) {
                value = newValue;
                // if the property is an attribute, we don't use local value, we use the attribute one
                if ((this.__component__.isConnected === _helpers_1.CONNECTION_STATE.CONNECTED_MULTIPLE || this.__component__.isConnected === _helpers_1.CONNECTION_STATE.CONNECTED_ONCE) && targetPrototype.__attributes__[propertyKey] !== undefined) {
                    _helpers_1.setAttribute(this, propertyKey, newValue, targetPrototype.__attributes__[propertyKey]);
                }
                // make sure we render after the update
                if (typeof this.__component__.debounceRender === 'function') {
                    this.__component__.debounceRender();
                }
            },
        });
    };
}
exports.state = state;

},{"./_helpers":3}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parse(tss) {
    // recursively parse some json and convert it into real CSS
    const parseTSS = (json) => {
        const selectors = Object.keys(json);
        return selectors.map((selector) => {
            const definitions = json[selector];
            const rules = Object.keys(definitions);
            const subDefinitons = [];
            const result = rules.map((rule) => {
                if (typeof definitions[rule] === 'object') {
                    const newSelector = `${selector} ${rule}`.replace(/ &/g, '');
                    const subset = {};
                    subset[newSelector] = definitions[rule];
                    subDefinitons.push(subset);
                    return undefined;
                }
                else {
                    return `${rule}:${definitions[rule]};`;
                }
            }).join('');
            const subsetResult = subDefinitons.map((subDefiniton) => {
                return parseTSS(subDefiniton);
            }).join('');
            return `${selector}{${result}}${subsetResult}`;
        }).join('');
    };
    return parseTSS(tss);
}
exports.parse = parse;

},{}],11:[function(require,module,exports){
"use strict";
// JSX rendering
Object.defineProperty(exports, "__esModule", { value: true });
function tsx(type, attributes, ...childNodes) {
    let children = childNodes;
    // makes sure children is always an array of JSX.Element and not an array of arrays of JSXELEMENT (can happens when using loops in JSX)
    if (children && children[0] instanceof Array) {
        children = children.reduce((accumulator, currentValue) => {
            accumulator.push(...currentValue);
            return accumulator;
        }, []);
    }
    return { type, attributes, children };
}
exports.tsx = tsx;
function createElement(virtualNode) {
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
function updateAttributes(node, newVirtualNode, oldVirtualNode) {
    const oldAttributes = {};
    // keep track of previous node attributes
    Object.assign(oldAttributes, (oldVirtualNode && oldVirtualNode.attributes) || {});
    // populate the new and updated attributes
    Object.keys(newVirtualNode.attributes || {}).forEach((key) => {
        if (newVirtualNode.attributes[key] !== false) {
            node.setAttribute(key, newVirtualNode.attributes[key]);
        }
        else {
            node.removeAttribute(key);
        }
        delete oldAttributes[key];
    });
    // remove the left overs
    Object.keys(oldAttributes).forEach((key) => {
        node.removeAttribute(key);
    });
}
function nodeHasChanged(node1, node2) {
    return typeof node1 !== typeof node2 || (typeof node1 === 'string' && node1 !== node2) || node1.type !== node2.type;
}
function attributesHaveChanged(node1, node2) {
    if (typeof node2 === 'string') {
        return true;
    }
    return JSON.stringify(node1.attributes) !== JSON.stringify(node2.attributes);
}
const canUseWorker = 'Worker' in window && 'Blob' in window && 'URL' in window;
// tslint:disable-next-line:max-func-body-length
function render(parentNode, currentVirtualNode, previousVirtualNode, useWorker = true) {
    // this takes care of the sunc/async rendering (depending if workers are used or not)
    const postMessage = (data, _transferList) => {
        // a message can come from worker or be sync. It contains info about what to do and where to do it.
        let node = parentNode;
        // because worker can't deal with node, it provides the path to reach a node,
        // so let's follow it...
        if (data.path.length > 0) {
            data.path.forEach((childIndex) => {
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
                updateAttributes(node.childNodes[data.index], data.node, data.oldNode);
                break;
            default:
        }
    };
    function renderWorker(newVirtualNode, oldVirtualNode, path = [], index = 0) {
        // this indirect render method is used sync or async (from worker)
        // it compute what needs to be done and pass it over to the postMessage. This way the worker does not have to deal with node, the action handleling can take place outside
        if (!oldVirtualNode) {
            postMessage({
                action: 'appendChild',
                node: newVirtualNode,
                path,
            });
        }
        else if (!newVirtualNode) {
            postMessage({
                action: 'removeChild',
                index,
                path,
            });
        }
        else if (nodeHasChanged(newVirtualNode, oldVirtualNode)) {
            postMessage({
                action: 'replaceChild',
                index,
                node: newVirtualNode,
                path,
            });
        }
        else if (newVirtualNode.type) {
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
    function onMessageReceivedByWorker(message) {
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
        const worker = new Worker(blobURL);
        worker.onmessage = (message) => {
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
exports.render = render;

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var attribute_1 = require("./core/decorator/attribute");
exports.attribute = attribute_1.attribute;
var attributeListener_1 = require("./core/decorator/attributeListener");
exports.attributeListener = attributeListener_1.attributeListener;
var component_1 = require("./core/decorator/component");
exports.component = component_1.component;
var domNode_1 = require("./core/decorator/domNode");
exports.domNode = domNode_1.domNode;
var eventListener_1 = require("./core/decorator/eventListener");
exports.eventListener = eventListener_1.eventListener;
var state_1 = require("./core/decorator/state");
exports.state = state_1.state;
var _helpers_1 = require("./core/decorator/_helpers");
exports.ATTRIBUTE = _helpers_1.ATTRIBUTE;
var tsx_1 = require("./core/tsx");
exports.tsx = tsx_1.tsx;
var debounce_1 = require("./core/debounce");
exports.debounce = debounce_1.debounce;

},{"./core/debounce":2,"./core/decorator/_helpers":3,"./core/decorator/attribute":4,"./core/decorator/attributeListener":5,"./core/decorator/component":6,"./core/decorator/domNode":7,"./core/decorator/eventListener":8,"./core/decorator/state":9,"./core/tsx":11}],13:[function(require,module,exports){
/*! (C) Andrea Giammarchi - @WebReflection - Mit Style License */
(function(e,t){"use strict";function Ht(){var e=wt.splice(0,wt.length);Et=0;while(e.length)e.shift().call(null,e.shift())}function Bt(e,t){for(var n=0,r=e.length;n<r;n++)Jt(e[n],t)}function jt(e){for(var t=0,n=e.length,r;t<n;t++)r=e[t],Pt(r,A[It(r)])}function Ft(e){return function(t){ut(t)&&(Jt(t,e),O.length&&Bt(t.querySelectorAll(O),e))}}function It(e){var t=ht.call(e,"is"),n=e.nodeName.toUpperCase(),r=_.call(L,t?N+t.toUpperCase():T+n);return t&&-1<r&&!qt(n,t)?-1:r}function qt(e,t){return-1<O.indexOf(e+'[is="'+t+'"]')}function Rt(e){var t=e.currentTarget,n=e.attrChange,r=e.attrName,i=e.target,s=e[y]||2,o=e[w]||3;kt&&(!i||i===t)&&t[h]&&r!=="style"&&(e.prevValue!==e.newValue||e.newValue===""&&(n===s||n===o))&&t[h](r,n===s?null:e.prevValue,n===o?null:e.newValue)}function Ut(e){var t=Ft(e);return function(e){wt.push(t,e.target),Et&&clearTimeout(Et),Et=setTimeout(Ht,1)}}function zt(e){Ct&&(Ct=!1,e.currentTarget.removeEventListener(S,zt)),O.length&&Bt((e.target||n).querySelectorAll(O),e.detail===l?l:a),st&&Vt()}function Wt(e,t){var n=this;vt.call(n,e,t),Lt.call(n,{target:n})}function Xt(e,t){nt(e,t),Mt?Mt.observe(e,yt):(Nt&&(e.setAttribute=Wt,e[o]=Ot(e),e[u](x,Lt)),e[u](E,Rt)),e[m]&&kt&&(e.created=!0,e[m](),e.created=!1)}function Vt(){for(var e,t=0,n=at.length;t<n;t++)e=at[t],M.contains(e)||(n--,at.splice(t--,1),Jt(e,l))}function $t(e){throw new Error("A "+e+" type is already registered")}function Jt(e,t){var n,r=It(e),i;-1<r&&(Dt(e,A[r]),r=0,t===a&&!e[a]?(e[l]=!1,e[a]=!0,i="connected",r=1,st&&_.call(at,e)<0&&at.push(e)):t===l&&!e[l]&&(e[a]=!1,e[l]=!0,i="disconnected",r=1),r&&(n=e[t+f]||e[i+f])&&n.call(e))}function Kt(){}function Qt(e,t,r){var i=r&&r[c]||"",o=t.prototype,u=tt(o),a=t.observedAttributes||j,f={prototype:u};ot(u,m,{value:function(){if(Q)Q=!1;else if(!this[W]){this[W]=!0,new t(this),o[m]&&o[m].call(this);var e=G[Z.get(t)];(!V||e.create.length>1)&&Zt(this)}}}),ot(u,h,{value:function(e){-1<_.call(a,e)&&o[h].apply(this,arguments)}}),o[d]&&ot(u,p,{value:o[d]}),o[v]&&ot(u,g,{value:o[v]}),i&&(f[c]=i),e=e.toUpperCase(),G[e]={constructor:t,create:i?[i,et(e)]:[e]},Z.set(t,e),n[s](e.toLowerCase(),f),en(e),Y[e].r()}function Gt(e){var t=G[e.toUpperCase()];return t&&t.constructor}function Yt(e){return typeof e=="string"?e:e&&e.is||""}function Zt(e){var t=e[h],n=t?e.attributes:j,r=n.length,i;while(r--)i=n[r],t.call(e,i.name||i.nodeName,null,i.value||i.nodeValue)}function en(e){return e=e.toUpperCase(),e in Y||(Y[e]={},Y[e].p=new K(function(t){Y[e].r=t})),Y[e].p}function tn(){X&&delete e.customElements,B(e,"customElements",{configurable:!0,value:new Kt}),B(e,"CustomElementRegistry",{configurable:!0,value:Kt});for(var t=function(t){var r=e[t];if(r){e[t]=function(t){var i,s;return t||(t=this),t[W]||(Q=!0,i=G[Z.get(t.constructor)],s=V&&i.create.length===1,t=s?Reflect.construct(r,j,i.constructor):n.createElement.apply(n,i.create),t[W]=!0,Q=!1,s||Zt(t)),t},e[t].prototype=r.prototype;try{r.prototype.constructor=e[t]}catch(i){z=!0,B(r,W,{value:e[t]})}}},r=i.get(/^HTML[A-Z]*[a-z]/),o=r.length;o--;t(r[o]));n.createElement=function(e,t){var n=Yt(t);return n?gt.call(this,e,et(n)):gt.call(this,e)},St||(Tt=!0,n[s](""))}var n=e.document,r=e.Object,i=function(e){var t=/^[A-Z]+[a-z]/,n=function(e){var t=[],n;for(n in s)e.test(n)&&t.push(n);return t},i=function(e,t){t=t.toLowerCase(),t in s||(s[e]=(s[e]||[]).concat(t),s[t]=s[t.toUpperCase()]=e)},s=(r.create||r)(null),o={},u,a,f,l;for(a in e)for(l in e[a]){f=e[a][l],s[l]=f;for(u=0;u<f.length;u++)s[f[u].toLowerCase()]=s[f[u].toUpperCase()]=l}return o.get=function(r){return typeof r=="string"?s[r]||(t.test(r)?[]:""):n(r)},o.set=function(n,r){return t.test(n)?i(n,r):i(r,n),o},o}({collections:{HTMLAllCollection:["all"],HTMLCollection:["forms"],HTMLFormControlsCollection:["elements"],HTMLOptionsCollection:["options"]},elements:{Element:["element"],HTMLAnchorElement:["a"],HTMLAppletElement:["applet"],HTMLAreaElement:["area"],HTMLAttachmentElement:["attachment"],HTMLAudioElement:["audio"],HTMLBRElement:["br"],HTMLBaseElement:["base"],HTMLBodyElement:["body"],HTMLButtonElement:["button"],HTMLCanvasElement:["canvas"],HTMLContentElement:["content"],HTMLDListElement:["dl"],HTMLDataElement:["data"],HTMLDataListElement:["datalist"],HTMLDetailsElement:["details"],HTMLDialogElement:["dialog"],HTMLDirectoryElement:["dir"],HTMLDivElement:["div"],HTMLDocument:["document"],HTMLElement:["element","abbr","address","article","aside","b","bdi","bdo","cite","code","command","dd","dfn","dt","em","figcaption","figure","footer","header","i","kbd","mark","nav","noscript","rp","rt","ruby","s","samp","section","small","strong","sub","summary","sup","u","var","wbr"],HTMLEmbedElement:["embed"],HTMLFieldSetElement:["fieldset"],HTMLFontElement:["font"],HTMLFormElement:["form"],HTMLFrameElement:["frame"],HTMLFrameSetElement:["frameset"],HTMLHRElement:["hr"],HTMLHeadElement:["head"],HTMLHeadingElement:["h1","h2","h3","h4","h5","h6"],HTMLHtmlElement:["html"],HTMLIFrameElement:["iframe"],HTMLImageElement:["img"],HTMLInputElement:["input"],HTMLKeygenElement:["keygen"],HTMLLIElement:["li"],HTMLLabelElement:["label"],HTMLLegendElement:["legend"],HTMLLinkElement:["link"],HTMLMapElement:["map"],HTMLMarqueeElement:["marquee"],HTMLMediaElement:["media"],HTMLMenuElement:["menu"],HTMLMenuItemElement:["menuitem"],HTMLMetaElement:["meta"],HTMLMeterElement:["meter"],HTMLModElement:["del","ins"],HTMLOListElement:["ol"],HTMLObjectElement:["object"],HTMLOptGroupElement:["optgroup"],HTMLOptionElement:["option"],HTMLOutputElement:["output"],HTMLParagraphElement:["p"],HTMLParamElement:["param"],HTMLPictureElement:["picture"],HTMLPreElement:["pre"],HTMLProgressElement:["progress"],HTMLQuoteElement:["blockquote","q","quote"],HTMLScriptElement:["script"],HTMLSelectElement:["select"],HTMLShadowElement:["shadow"],HTMLSlotElement:["slot"],HTMLSourceElement:["source"],HTMLSpanElement:["span"],HTMLStyleElement:["style"],HTMLTableCaptionElement:["caption"],HTMLTableCellElement:["td","th"],HTMLTableColElement:["col","colgroup"],HTMLTableElement:["table"],HTMLTableRowElement:["tr"],HTMLTableSectionElement:["thead","tbody","tfoot"],HTMLTemplateElement:["template"],HTMLTextAreaElement:["textarea"],HTMLTimeElement:["time"],HTMLTitleElement:["title"],HTMLTrackElement:["track"],HTMLUListElement:["ul"],HTMLUnknownElement:["unknown","vhgroupv","vkeygen"],HTMLVideoElement:["video"]},nodes:{Attr:["node"],Audio:["audio"],CDATASection:["node"],CharacterData:["node"],Comment:["#comment"],Document:["#document"],DocumentFragment:["#document-fragment"],DocumentType:["node"],HTMLDocument:["#document"],Image:["img"],Option:["option"],ProcessingInstruction:["node"],ShadowRoot:["#shadow-root"],Text:["#text"],XMLDocument:["xml"]}});typeof t!="object"&&(t={type:t||"auto"});var s="registerElement",o="__"+s+(e.Math.random()*1e5>>0),u="addEventListener",a="attached",f="Callback",l="detached",c="extends",h="attributeChanged"+f,p=a+f,d="connected"+f,v="disconnected"+f,m="created"+f,g=l+f,y="ADDITION",b="MODIFICATION",w="REMOVAL",E="DOMAttrModified",S="DOMContentLoaded",x="DOMSubtreeModified",T="<",N="=",C=/^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+$/,k=["ANNOTATION-XML","COLOR-PROFILE","FONT-FACE","FONT-FACE-SRC","FONT-FACE-URI","FONT-FACE-FORMAT","FONT-FACE-NAME","MISSING-GLYPH"],L=[],A=[],O="",M=n.documentElement,_=L.indexOf||function(e){for(var t=this.length;t--&&this[t]!==e;);return t},D=r.prototype,P=D.hasOwnProperty,H=D.isPrototypeOf,B=r.defineProperty,j=[],F=r.getOwnPropertyDescriptor,I=r.getOwnPropertyNames,q=r.getPrototypeOf,R=r.setPrototypeOf,U=!!r.__proto__,z=!1,W="__dreCEv1",X=e.customElements,V=!/^force/.test(t.type)&&!!(X&&X.define&&X.get&&X.whenDefined),$=r.create||r,J=e.Map||function(){var t=[],n=[],r;return{get:function(e){return n[_.call(t,e)]},set:function(e,i){r=_.call(t,e),r<0?n[t.push(e)-1]=i:n[r]=i}}},K=e.Promise||function(e){function i(e){n=!0;while(t.length)t.shift()(e)}var t=[],n=!1,r={"catch":function(){return r},then:function(e){return t.push(e),n&&setTimeout(i,1),r}};return e(i),r},Q=!1,G=$(null),Y=$(null),Z=new J,et=function(e){return e.toLowerCase()},tt=r.create||function sn(e){return e?(sn.prototype=e,new sn):this},nt=R||(U?function(e,t){return e.__proto__=t,e}:I&&F?function(){function e(e,t){for(var n,r=I(t),i=0,s=r.length;i<s;i++)n=r[i],P.call(e,n)||B(e,n,F(t,n))}return function(t,n){do e(t,n);while((n=q(n))&&!H.call(n,t));return t}}():function(e,t){for(var n in t)e[n]=t[n];return e}),rt=e.MutationObserver||e.WebKitMutationObserver,it=(e.HTMLElement||e.Element||e.Node).prototype,st=!H.call(it,M),ot=st?function(e,t,n){return e[t]=n.value,e}:B,ut=st?function(e){return e.nodeType===1}:function(e){return H.call(it,e)},at=st&&[],ft=it.attachShadow,lt=it.cloneNode,ct=it.dispatchEvent,ht=it.getAttribute,pt=it.hasAttribute,dt=it.removeAttribute,vt=it.setAttribute,mt=n.createElement,gt=mt,yt=rt&&{attributes:!0,characterData:!0,attributeOldValue:!0},bt=rt||function(e){Nt=!1,M.removeEventListener(E,bt)},wt,Et=0,St=s in n&&!/^force-all/.test(t.type),xt=!0,Tt=!1,Nt=!0,Ct=!0,kt=!0,Lt,At,Ot,Mt,_t,Dt,Pt;St||(R||U?(Dt=function(e,t){H.call(t,e)||Xt(e,t)},Pt=Xt):(Dt=function(e,t){e[o]||(e[o]=r(!0),Xt(e,t))},Pt=Dt),st?(Nt=!1,function(){var e=F(it,u),t=e.value,n=function(e){var t=new CustomEvent(E,{bubbles:!0});t.attrName=e,t.prevValue=ht.call(this,e),t.newValue=null,t[w]=t.attrChange=2,dt.call(this,e),ct.call(this,t)},r=function(e,t){var n=pt.call(this,e),r=n&&ht.call(this,e),i=new CustomEvent(E,{bubbles:!0});vt.call(this,e,t),i.attrName=e,i.prevValue=n?r:null,i.newValue=t,n?i[b]=i.attrChange=1:i[y]=i.attrChange=0,ct.call(this,i)},i=function(e){var t=e.currentTarget,n=t[o],r=e.propertyName,i;n.hasOwnProperty(r)&&(n=n[r],i=new CustomEvent(E,{bubbles:!0}),i.attrName=n.name,i.prevValue=n.value||null,i.newValue=n.value=t[r]||null,i.prevValue==null?i[y]=i.attrChange=0:i[b]=i.attrChange=1,ct.call(t,i))};e.value=function(e,s,u){e===E&&this[h]&&this.setAttribute!==r&&(this[o]={className:{name:"class",value:this.className}},this.setAttribute=r,this.removeAttribute=n,t.call(this,"propertychange",i)),t.call(this,e,s,u)},B(it,u,e)}()):rt||(M[u](E,bt),M.setAttribute(o,1),M.removeAttribute(o),Nt&&(Lt=function(e){var t=this,n,r,i;if(t===e.target){n=t[o],t[o]=r=Ot(t);for(i in r){if(!(i in n))return At(0,t,i,n[i],r[i],y);if(r[i]!==n[i])return At(1,t,i,n[i],r[i],b)}for(i in n)if(!(i in r))return At(2,t,i,n[i],r[i],w)}},At=function(e,t,n,r,i,s){var o={attrChange:e,currentTarget:t,attrName:n,prevValue:r,newValue:i};o[s]=e,Rt(o)},Ot=function(e){for(var t,n,r={},i=e.attributes,s=0,o=i.length;s<o;s++)t=i[s],n=t.name,n!=="setAttribute"&&(r[n]=t.value);return r})),n[s]=function(t,r){p=t.toUpperCase(),xt&&(xt=!1,rt?(Mt=function(e,t){function n(e,t){for(var n=0,r=e.length;n<r;t(e[n++]));}return new rt(function(r){for(var i,s,o,u=0,a=r.length;u<a;u++)i=r[u],i.type==="childList"?(n(i.addedNodes,e),n(i.removedNodes,t)):(s=i.target,kt&&s[h]&&i.attributeName!=="style"&&(o=ht.call(s,i.attributeName),o!==i.oldValue&&s[h](i.attributeName,i.oldValue,o)))})}(Ft(a),Ft(l)),_t=function(e){return Mt.observe(e,{childList:!0,subtree:!0}),e},_t(n),ft&&(it.attachShadow=function(){return _t(ft.apply(this,arguments))})):(wt=[],n[u]("DOMNodeInserted",Ut(a)),n[u]("DOMNodeRemoved",Ut(l))),n[u](S,zt),n[u]("readystatechange",zt),it.cloneNode=function(e){var t=lt.call(this,!!e),n=It(t);return-1<n&&Pt(t,A[n]),e&&O.length&&jt(t.querySelectorAll(O)),t});if(Tt)return Tt=!1;-2<_.call(L,N+p)+_.call(L,T+p)&&$t(t);if(!C.test(p)||-1<_.call(k,p))throw new Error("The type "+t+" is invalid");var i=function(){return o?n.createElement(f,p):n.createElement(f)},s=r||D,o=P.call(s,c),f=o?r[c].toUpperCase():p,p,d;return o&&-1<_.call(L,T+f)&&$t(f),d=L.push((o?N:T)+p)-1,O=O.concat(O.length?",":"",o?f+'[is="'+t.toLowerCase()+'"]':f),i.prototype=A[d]=P.call(s,"prototype")?s.prototype:tt(it),O.length&&Bt(n.querySelectorAll(O),a),i},n.createElement=gt=function(e,t){var r=Yt(t),i=r?mt.call(n,e,et(r)):mt.call(n,e),s=""+e,o=_.call(L,(r?N:T)+(r||s).toUpperCase()),u=-1<o;return r&&(i.setAttribute("is",r=r.toLowerCase()),u&&(u=qt(s.toUpperCase(),r))),kt=!n.createElement.innerHTMLHelper,u&&Pt(i,A[o]),i}),Kt.prototype={constructor:Kt,define:V?function(e,t,n){if(n)Qt(e,t,n);else{var r=e.toUpperCase();G[r]={constructor:t,create:[r]},Z.set(t,r),X.define(e,t)}}:Qt,get:V?function(e){return X.get(e)||Gt(e)}:Gt,whenDefined:V?function(e){return K.race([X.whenDefined(e),en(e)])}:en};if(!X||/^force/.test(t.type))tn();else if(!t.noBuiltIn)try{(function(t,r,i){r[c]="a",t.prototype=tt(HTMLAnchorElement.prototype),t.prototype.constructor=t,e.customElements.define(i,t,r);if(ht.call(n.createElement("a",{is:i}),"is")!==i||V&&ht.call(new t,"is")!==i)throw r})(function on(){return Reflect.construct(HTMLAnchorElement,[],on)},{},"document-register-element-a")}catch(nn){tn()}if(!t.noBuiltIn)try{mt.call(n,"a","a")}catch(rn){et=function(e){return{is:e.toLowerCase()}}}})(window);
},{}],14:[function(require,module,exports){
(function (global){
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global global, define, System, Reflect, Promise */
var __extends;
var __assign;
var __rest;
var __decorate;
var __param;
var __metadata;
var __awaiter;
var __generator;
var __exportStar;
var __values;
var __read;
var __spread;
var __await;
var __asyncGenerator;
var __asyncDelegator;
var __asyncValues;
var __makeTemplateObject;
var __importStar;
var __importDefault;
(function (factory) {
    var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) {
        define("tslib", ["exports"], function (exports) { factory(createExporter(root, createExporter(exports))); });
    }
    else if (typeof module === "object" && typeof module.exports === "object") {
        factory(createExporter(root, createExporter(module.exports)));
    }
    else {
        factory(createExporter(root));
    }
    function createExporter(exports, previous) {
        if (exports !== root) {
            if (typeof Object.create === "function") {
                Object.defineProperty(exports, "__esModule", { value: true });
            }
            else {
                exports.__esModule = true;
            }
        }
        return function (id, v) { return exports[id] = previous ? previous(id, v) : v; };
    }
})
(function (exporter) {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

    __extends = function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };

    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    __rest = function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
                t[p[i]] = s[p[i]];
        return t;
    };

    __decorate = function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };

    __param = function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };

    __metadata = function (metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    };

    __awaiter = function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

    __generator = function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [0, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };

    __exportStar = function (m, exports) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    };

    __values = function (o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    };

    __read = function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };

    __spread = function () {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    };

    __await = function (v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    };

    __asyncGenerator = function (thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    };

    __asyncDelegator = function (o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { if (o[n]) i[n] = function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; }; }
    };

    __asyncValues = function (o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator];
        return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
    };

    __makeTemplateObject = function (cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    __importStar = function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result["default"] = mod;
        return result;
    };

    __importDefault = function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    exporter("__extends", __extends);
    exporter("__assign", __assign);
    exporter("__rest", __rest);
    exporter("__decorate", __decorate);
    exporter("__param", __param);
    exporter("__metadata", __metadata);
    exporter("__awaiter", __awaiter);
    exporter("__generator", __generator);
    exporter("__exportStar", __exportStar);
    exporter("__values", __values);
    exporter("__read", __read);
    exporter("__spread", __spread);
    exporter("__await", __await);
    exporter("__asyncGenerator", __asyncGenerator);
    exporter("__asyncDelegator", __asyncDelegator);
    exporter("__asyncValues", __asyncValues);
    exporter("__makeTemplateObject", __makeTemplateObject);
    exporter("__importStar", __importStar);
    exporter("__importDefault", __importDefault);
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);
