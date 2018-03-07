import { Router } from '../lib';
import demoTemplateHtml from './demo.template.html'; // tslint:disable-line:match-default-export-name

import './currency/currency'; // tslint:disable-line:no-import-side-effect
import currencyTemplateHtml from './currency/currency.template.html'; // tslint:disable-line:match-default-export-name

import './todo/todo'; // tslint:disable-line:no-import-side-effect
import todoTemplateHtml from './todo/todo.template.html'; // tslint:disable-line:match-default-export-name

import './greetings/greetings'; // tslint:disable-line:no-import-side-effect
import greetingsTemplateHtml from './greetings/greetings.template.html'; // tslint:disable-line:match-default-export-name

enum DEMO {
	CURRENCY,
	TODO,
	GREETINGS,
	DEFAULT,
}


function navigateTo(endpoint: DEMO): void {
	if (endpoint === DEMO.DEFAULT) {
		document.body.innerHTML = demoTemplateHtml;
	}
	if (endpoint === DEMO.CURRENCY) {
		document.body.innerHTML = currencyTemplateHtml;
	}
	if (endpoint === DEMO.TODO) {
		document.body.innerHTML = todoTemplateHtml;
	}
	if (endpoint === DEMO.GREETINGS) {
		document.body.innerHTML = greetingsTemplateHtml;
	}
}


const router = new Router();
router
.add('/currency/index.html', () => {
	navigateTo(DEMO.CURRENCY);
})
.add('/greetings/index.html', () => {
	navigateTo(DEMO.GREETINGS);
})
.add('/todo/index.html', () => {
	navigateTo(DEMO.TODO);
})
.add('/', () => {
	navigateTo(DEMO.DEFAULT);
});
