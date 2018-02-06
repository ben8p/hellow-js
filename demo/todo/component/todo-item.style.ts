export const style: { [key: string]: any } = {
	display: 'block',

	li: {
		'border-bottom': '1px solid #ededed',
		display: 'block',
		'font-size': '24px',
		position: 'relative',
	},

	'li input': {
		'-webkit-appearance': 'none',
		appearance: 'none',
		border: 'none',
		bottom: '0',
		height: 'auto',
		margin: 'auto 0',
		position: 'absolute',
		'text-align': 'center',
		top: '9px',
		width: '40px',
	},

	'li input:after': {
		content: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-10 -18 100 135"><circle cx="50" cy="50" r="50" fill="none" stroke="#ededed" stroke-width="3"/></svg>');`,
	},

	'li input:checked:after': {
		content: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-10 -18 100 135"><circle cx="50" cy="50" r="50" fill="none" stroke="#bddad5" stroke-width="3"/><path fill="#5dc2af" d="M72 25L42 71 27 56l-4 4 20 20 34-52z"/></svg>');`,
	},

	'li label': {
		display: 'block',
		'line-height': '1.2',
		'margin-left': '45px',
		padding: '15px 60px 15px 15px',
		transition: 'color 0.4s',
		'white-space': 'pre',
		'word-break': 'break-word',
	},

	'li.completed label': {
		color: '#d9d9d9',
		'text-decoration': 'line-through',
	},

	'li button': {
		outline: 'none',

		'-moz-font-smoothing': 'antialiased',
		'-webkit-appearance': 'none',
		'-webkit-font-smoothing': 'antialiased',
		appearance: 'none',
		background: 'none',
		border: '0',
		bottom: '0',
		color: '#cc9a9a',
		'font-family': 'inherit',
		'font-size': '30px',
		'font-smoothing': 'antialiased',
		'font-weight': 'inherit',
		height: '40px',
		margin: 'auto 0',
		'margin-bottom': '11px',
		padding: '0',
		position: 'absolute',
		right: '10px',
		top: '0',
		transition: 'color 0.2s ease-out',
		'vertical-align': 'baseline',
		width: '40px',

		'&:hover ': {
			color: '#af5b5e',
		},
	},

	'li input[type = "checkbox"]': {
		outline: 'none',
	},
};
