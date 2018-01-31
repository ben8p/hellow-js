import { component, eventListener, state, tsx } from '../../lib';

@component('my-greetings')
export class MyGreetings extends HTMLElement {

	@state()
	private userName: string = 'Mr. Nobody';

	public render(): JSX.Element {
		return (<div>
			<h1>Hello <span>{ this.userName }</span></h1>
			<label>Fill in your name:</label>
			<input type='text'/>
			</div>);
	}

	@eventListener('keyup')
	public onKeyUp(): void {
		this.userName = this.querySelector('input').value;
	}

}
