const program = require('commander');
const child_process = require('child_process');
const chalk = require('chalk');
const browserify = require('browserify');
const watchify = require('watchify');
const tsify = require('tsify');
const fs = require('fs');
const path = require('path')

const isDirectory = source => fs.lstatSync(source).isDirectory()
const getDirectories = source => fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory)

function pipeStd(spawn) {
	spawn.stdout.on('data', data => {
		console.log(data.toString());
	});

	spawn.stderr.on('data', data => {
		console.log(chalk.red(data.toString()));
	});

	spawn.on('exit', code => {
		let message = 'tsc exited with code ' + code.toString();
		if(code === 0) {
			message = chalk.green(message);
		} else {
			message = chalk.red(message);
		}
		console.log(message);
	});
}
const mkdirSync = function (dirPath) {
	try {
		fs.mkdirSync(dirPath)
	} catch (err) {
		if (err.code !== 'EEXIST') throw err
	}
}

program.usage('<command> [options]');

program
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

program
	.command('demo')
	.option('-n, --name [name]', 'Build a specific demo')
	.option('-w, --watch', 'Watches code for changes')
	.description('Build the specified demo')
	.action((options) => {
		const demoRoot = path.join(__dirname, '..', 'demo');
		function run(name) {
			const root = path.join(demoRoot, name);
			const output = path.join(root, 'dist');
			mkdirSync(output);

			let entryPoint = path.join(root, `${name}.ts`);
			if (!fs.existsSync(entryPoint)) {
				entryPoint += 'x'; // tsx files
			}

			const task = browserify({ cache: {}, packageCache: {} })
				.add(entryPoint)
				.plugin(tsify)
			if(options.watch) {
				task.plugin('watchify')
			}
			task
				.on('error', function (data) { console.log(chalk.red(data.toString())); })
				.on('update', bundle);

			function bundle() {
				const bundleFs = fs.createWriteStream(path.join(output, `${name}.js`));
				bundleFs.on('finish', () => {
					let message = `finished writing the browserify file for ${name}`;

					if(!options.watch) {
						message = chalk.green(message);
					}

					console.log(message);
				});

				task
				.bundle()
				.pipe(bundleFs);
			}

			bundle();
		}
		if (typeof options.name === 'string') {
			run(options.name);
		} else {
			getDirectories(demoRoot).forEach((demoName) => {
				run(demoName.split(path.sep).pop());
			});
		}
	});

program
	.parse(process.argv);

if (!program.args || !program.args.length) {
	program.help();
}
