# Hellow-JS
![Hellow-JS][logo]  
> _Yet another WebComponent builder..._  

Featuring typescript, decorators and JSX  
Thanks [awesome Javascript project names generator](https://mrsharpoblunto.github.io/foswig.js/) for that stunning name!  
Thanks [squarespace](https://logo.squarespace.com) for that outstanding logo!  

## Features
 - Declare custom elements using the `@component` decorator
 - Refresh the DOM when property decorated with `@state` changes
 - Listen to dom events using `@eventListener` decorator (support event delegation)
 - Watch attribute changes using `@attributeListener` decorator
 - Attach node directly using the @domNode` decorator
 - Render the UI using `JSX` via the `render` method
 - Uses virtual dom diff/patching to smartly apply changes to the UI
 - Virtual Dom diff/patching via Web Worker (when available)
 - Web Worker can explicitly be disbaled via the `@component` decorator : `@component('my-component', {useWorker: false})`
 - Uses Shadow DOM (when available)
 - Shadow DOM can explicitly be disbaled via the `@component` decorator : `@component('my-component', {useShadowDom: false})`
 - Support for extending native elements via the `@component` decorator : `@component('my-component', {extends: 'div'})`
 - Support custom element styling via the `@component` decorator : `@component('my-component', {style: {div: { background: 'red' }}})`

## See it in action
Demos are available here : https://rawgit.com/ben8p/hellow-js/master/demo/index.html

## TODO
- add tests

## Component example
```ts
@component('my-greetings', {
	style: {
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
export class MyGreetings extends HTMLElement implements JSX.ElementClass {

	@state() // any change to this property will re-render
	private userName: string = 'Mr. Nobody';

	@domNode('[data-node=inputNode]') // this will attach the node matching the css selector to the class member
	private inputNode: HTMLInputElement;

	private keyUpCount: number = 0;

	public render(): JSX.Element {
		return (<div>
			<h1>Hello <span>{ this.userName }</span></h1>
			<label data-refresh-count={ this.keyUpCount }>Fill in your name:</label>
			<input data-node='inputNode' type='text'/>
			</div>);
	}

	@eventListener('[data-node=inputNode]:keyup') // listen to key up using event delegation. Without delegation it would be @eventListener('keyup')
	public onKeyUp(): void {
		this.keyUpCount++;
		this.userName = this.inputNode.value;
	}
}
```

## Installation
First you need to clone the repository, then use `yarn install` (or `npm install`) to install all dependencies.  

## Build the library
Run `yarn build-lib` (or `npm run build:lib`) to make a one shot build of the library  
Run `yarn dev-lib` (or `npm run dev:lib`) to make an initial build of the library and keep watching for file changes.  

## Build the demos
Run `yarn build-demo` (or `npm run build:demo`) to make a one shot build of the demos  
Run `yarn dev-demo` (or `npm run dev:demo`) to make an initial build of the demos and keep watching for file changes.  
Run `yarn demo` (or `npm run demo`) to start the demo server. Then navigate to http://127.0.0.1:5555


[logo]: https://raw.githubusercontent.com/ben8p/hellow-js/master/Hellow-JS.png "Hellow-JS"
