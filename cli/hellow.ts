import commander from 'commander';
import child_process from 'child_process';
import chalk from 'chalk';
import browserify from 'browserify';
import watchify from 'watchify';
import tsify from 'tsify';
import fs from 'fs';
import path from 'path';
import stringify from 'stringify';

const isDirectory = (source) => fs.lstatSync(source).isDirectory();
const getDirectories = (source) => fs.readdirSync(source).map((name) => path.join(source, name)).filter(isDirectory);

function pipeStd(spawn: child_process.ChildProcess): void {
	spawn.stdout.on('data', (data) => {
		console.log(data.toString()); // tslint:disable-line:no-console
	});

	spawn.stderr.on('data', (data) => {
		console.log(chalk.red(data.toString())); // tslint:disable-line:no-console
	});

	spawn.on('exit', (code) => {
		let message = `tsc exited with code ${code.toString()}`;
		message = code === 0 ? chalk.green(message) : chalk.red(message);
		console.log(message); // tslint:disable-line:no-console
	});
}
function mkdirSync(dirPath: string): void {
	try {
		fs.mkdirSync(dirPath);
	} catch (err) {
		if (err.code !== 'EEXIST') { throw err; }
	}
}

commander.usage('<command> [options]');

commander
	.command('build')
	.option('-w, --watch', 'Watches code for changes')
	.description('Builds the library')
	.action((options) => {
		const spawnArguments = ['-p', path.join('.', 'tsconfig.json')];
		if (options.watch) {
			spawnArguments.push('-w');
		}

		pipeStd(child_process.spawn(path.join('.', 'node_modules', '.bin', 'tsc'), spawnArguments));
	});

commander
	.command('demo')
	.option('-w, --watch', 'Watches code for changes')
	.description('Build the demos')
	.action((options) => {
		const root = path.join(__dirname, '..', 'demo');

		const output = path.join(root, '.dist');
		mkdirSync(output);

		let entryPoint = path.join(root, 'demo.ts');
		if (!fs.existsSync(entryPoint)) {
			entryPoint += 'x'; // tsx files
		}
		const task = browserify({ cache: {}, packageCache: {} })
			.transform(stringify, {
				appliesTo: { includeExtensions: ['.html']},
			})
			.add(entryPoint)
			.plugin(tsify);
		if (options.watch) {
			task.plugin('watchify');
		}
		task
			.on('error', (data) => { console.log(chalk.red(data.toString())); }) // tslint:disable-line:no-console
			.on('update', bundle);

		function bundle(): void {
			const bundleFs = fs.createWriteStream(path.join(output, 'demo.js'));
			bundleFs.on('finish', () => {
				let message = `finished writing the browserify file`;

				if (!options.watch) {
					message = chalk.green(message);
				}

				console.log(message); // tslint:disable-line:no-console
			});

			task
			.bundle()
			.pipe(bundleFs);
		}

		bundle();
	});

commander.parse(process.argv);

if (!commander.args || !commander.args.length) {
	commander.help();
}
