# Hellow-JS
Yet another WebComponent builder...  
Featuring typescript, decorators and JSX  
Thanks [awesome Javascript project names generator](https://mrsharpoblunto.github.io/foswig.js/) for that stunning name!  

## features
 - Declare custom elements using the `@component` decorator
 - Refresh the DOM when property decorated with `@state` changes
 - Listen to dom events using `@eventListener` decorator (support event delegation)
 - Watch attribute changes using `@attributeListener` decorator
 - Attach node directly using the @domNode` decorator
 - Render the UI using `JSX` via the `render` method
 - Uses virtual dom diff/patching to smartly apply changes to the UI
 - Virtual Dom diff/patching via Web Worker (when available)

## installation
First you need to clone the repository, then use `yarn install` (or `npm install`) to install all dependencies.  

## build the library
Run `yarn build-lib` (or `npm run build-lib`) to make a one shot build of the library  
Run `yarn dev-lib` (or `npm run dev-lib`) to make an initial build of the library and keep watching for file changes.  

## build the demos
Run `yarn build-demo` (or `npm run build-demo`) to make a one shot build of the demos  
Run `yarn dev-demo` (or `npm run dev-demo`) to make an initial build of the demos and keep watching for file changes.  
Then open the file `./demo/index.html` into a browser (using `file://` protocol)  