import { component, attributeListener, state, tsx } from '../../lib';

function formatAmount(amount: string): string {
	return amount.split('').reverse().join('').replace(/([0-9]{3})([.0-9])/g, '$1.$2').split('').reverse().join('');
}

@component('my-currency', {
	style: {
		'.amount': {
			'font-style': 'italic',
		},
		'.currency': {
			'font-weight': 'bold',
		},
	},
})
export class MyCurrency extends HTMLElement implements JSX.ElementClass {
	@state()
	private currentCurrency: string = '';

	@state()
	private currentAmount: string = '';

	public render(): JSX.Element {
		return (<span>
			<span class='currency'>{ this.currentCurrency }</span>
			<span class='amount'>{ formatAmount(this.currentAmount) }</span>
		</span>);
	}

	@attributeListener('data-currency')
	protected onCurrencyChange(value: string): void {
		this.currentCurrency = value;
	}

	@attributeListener('data-amount')
	protected onAmountChange(value: string): void {
		this.currentAmount = value;
	}

}
