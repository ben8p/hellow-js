import { component, eventListener, state, tsx } from '../../lib';
import { domNode } from '../../src/core/decorators';

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

	@state() // any change to this property will re-render
	private keyUpCount: number = 0;

	@domNode('[data-node=inputNode]') // this will attach the node matching the css selector to the class member
	private inputNode: HTMLInputElement;

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
