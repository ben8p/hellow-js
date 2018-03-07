import express from 'express'; // tslint:disable-line:match-default-export-name
import path from 'path';

const app = express();

app.use('/', express.static(__dirname, {
	index: 'index.html',
}));

app.get('/*/index.html', (_request, response) => {
	response.sendFile(path.join(__dirname, 'index.html'));
});

const server = app.listen(5555, () => {
	console.log('server is listening at http://127.0.0.1:%s', server.address().port); // tslint:disable-line:no-console
});
