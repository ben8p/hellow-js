import { component, eventListener, tsx, attribute, ATTRIBUTE } from '../../lib';
import { style } from './todo-item.style';

@component('todo-item', {
	style,
})
export class TodoItem extends HTMLElement {
	@attribute(ATTRIBUTE.BOOLEAN, { state: true })
	public checked: boolean = false;
	@attribute(ATTRIBUTE.STRING, { state: true })
	public text: string = '';
	@attribute(ATTRIBUTE.NUMBER, { state: true })
	public index: number = 0;

	@eventListener('[type=checkbox]:click')
	public onCheckboxChange(): void {
		this.dispatchEvent(new CustomEvent('onTodoItemChecked', { bubbles: true, detail: this.index }));
	}

	@eventListener('button:click')
	public onButtonClick(): void {
		this.dispatchEvent(new CustomEvent('onTodoItemRemove', { bubbles: true, detail: this.index }));
	}

	public render(): JSX.Element {
		return (
			<li class={ this.checked ? 'completed' : '' }>
				<input type='checkbox' aria-checked={ this.checked } checked={ this.checked } />
				<label>{ this.text }</label>
				<button>x</button>
			</li>
		);
	}
}
