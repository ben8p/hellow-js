import { component, eventListener, tsx, domNode } from '../../../lib';
import { style } from './todo-input.style';
@component('todo-input', {
	style,
})
export class TodoInput extends HTMLElement {
	@domNode('[type=text]')
	private inputNode: HTMLInputElement;

	@eventListener('form:submit')
	public onInputBlur(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
		if (!this.inputNode.value) {
			return;
		}
		this.dispatchEvent(new CustomEvent('onTodoInputSubmit', { bubbles: true, detail: this.inputNode.value }));
		this.inputNode.value = '';
	}

	public render(): JSX.Element {
		return (
			<form>
				<input
					value=''
					type='text'
					placeholder='What needs to be done?'
				/>
			</form>
		);
	}
}
