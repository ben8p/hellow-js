interface IRoute {
	matcher: RegExp|((pathName: string) => boolean)|string;
	handler(): void;
}
export class Router {
	private routes: IRoute[] = [];
	private isListening: boolean;

	constructor(private readonly root: string = '/') {
		window.addEventListener('popstate', this.onPopState.bind(this));
		this.listen();
	}

	public add(matcher: IRoute['matcher'], handler: IRoute['handler']): Router {
		this.routes.push({ matcher, handler });
		this.go();
		return this;
	}

	public remove(matcher: IRoute['matcher'], handler: IRoute['handler']): Router {
		this.routes = this.routes.filter((route) => !(route.handler === handler && route.matcher === matcher));
		return this;
	}

	public navigate(path?: string): Router {
		window.history.pushState(null, null, this.pathJoin(this.root, path));
		this.go();
		return this;
	}

	public pause(): Router {
		this.isListening = false;
		return this;
	}

	public listen(): Router {
		this.isListening = true;
		return this;
	}

	private pathJoin(...chunks: string[]): string {
		return chunks.map((chunk) => chunk.replace(/^\/|\/$/g, '')).join('/');
	}

	private onPopState(): void {
		this.go();
	}

	private go(): void {
		if (!this.isListening) {
			return;
		}
		const pathName = document.location.pathname;
		if (pathName.indexOf(this.root) === -1) {
			return;
		}
		this.routes.some((route) => {
			const result = (route.matcher instanceof RegExp && route.matcher.test(pathName)) || (route.matcher instanceof Function && route.matcher(pathName)) || route.matcher === pathName;
			if (result) {
				route.handler();
			}
			return result;
		});
	}
}
