import { component, eventListener, state, tsx } from '../../lib';
import { style } from './my-todo.style';
interface ITodoItem {
	text: string;
	checked: boolean;
}

@component('my-todo', {
	style,
})
export class MyTodo extends HTMLElement {
	@state()
	public list: ITodoItem[] = [
		{ text: 'my initial todo', checked: false },
		{ text: 'Learn about Web Components', checked: true },
	];

	@eventListener('onTodoInputSubmit')
	public onTodoInputSubmit(event: CustomEvent): void {
		this.list = [...this.list, { text: event.detail, checked: false }];
	}

	@eventListener('onTodoItemChecked')
	public onTodoItemChecked(event: CustomEvent): void {
		const list = [...this.list];
		const item = list[event.detail];
		list[event.detail] = {...item};
		list[event.detail].checked = !item.checked;
		this.list = list;
	}

	@eventListener('onTodoItemRemove')
	public onTodoItemRemove(event: CustomEvent): void {
		this.list = [...this.list.slice(0, event.detail), ...this.list.slice(+event.detail + 1)];
	}

	public render(): JSX.Element {
		return (
			<div>
				<h1>Todos HellowJS</h1>
				<section>
					<todo-input></todo-input>
					<ul id='list-container'>
						{ this.list.map((item, index) => (<todo-item checked={ item.checked } text={ item.text } index={ index }/>)) }
					</ul>
				</section>
			</div>
		);
	}
}
