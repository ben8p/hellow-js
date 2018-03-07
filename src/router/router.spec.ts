import { JSDOM } from 'jsdom';

import { Router } from './router';

describe('Router', () => {
	describe('methods', () => {
		beforeEach(() => {
			const dom = new JSDOM('<!DOCTYPE html><html><head><base href="http://localhost:8080/"></base></head><body></body></html>', {
				url: 'http://localhost:8080/',
			});
			(global as any).window = dom.window;
			(global as any).document = dom.window.document;
		});

		describe('add()', () => {
			it('should add a route and return itsef', () => {
				const router = new Router();
				expect(router.add('/', () => 0)).toBe(router);
			});

			it('should support string matcher', (done) => {
				const router = new Router();
				router.add('/foo', () => {
					done();
				});
				expect(router.navigate('/foo')).toBe(router);
			});

			it('should support regexp matcher', (done) => {
				const router = new Router();
				router.add(/.*foo.*/, () => {
					done();
				});
				expect(router.navigate('/boo-foo-bee')).toBe(router);
			});

			it('should support function matcher', (done) => {
				const router = new Router();
				router.add(() => true, () => {
					done();
				});
				expect(router.navigate('/meh')).toBe(router);
			});
		});

		describe('remove()', () => {
			it('should not navigate to removed route', () => {
				const router = new Router();
				const route = () => {
					fail('should not end up here');
				};
				router.add('/foo', route);

				router.remove('/foo', route);

				expect(router.navigate('/foo')).toBe(router);
			});
		});

		describe('navigate()', () => {
			it('should navigate to a route', (done) => {
				const router = new Router();

				router.add('/bar', () => {
					fail('should not end up here');
				});
				router.add('/foo', () => {
					done();
				});
				expect(router.navigate('/foo')).toBe(router);
			});
		});

		describe('pause()', () => {
			it('should not navigate when paused', () => {
				const router = new Router();
				router.add('/foo', () => {
					fail('should not end up here');
				});

				router.pause();

				expect(router.navigate('/foo')).toBe(router);
			});
		});

		describe('listen()', () => {
			it('should navigate when listening', (done) => {
				const router = new Router();
				router.add('/foo', () => {
					done();
				});

				router.pause();
				router.listen();
				expect(router.navigate('/foo')).toBe(router);
			});
		});
	});

	describe('behaviors', () => {
		beforeEach(() => {
			const dom = new JSDOM('<!DOCTYPE html><html><head><base href="http://localhost:8080/foo"></base></head><body></body></html>', {
				url: 'http://localhost:8080/foo',
			});
			(global as any).window = dom.window;
			(global as any).document = dom.window.document;
		});

		it('should navigate when route is added and match current page', (done) => {
			const router = new Router();
			router.add('/foo', () => {
				done();
			});
		});

		it('should not navigate when route is added and match current page but router is paused', () => {
			const router = new Router();
			router
				.pause()
				.add('/foo', () => {
					fail('should not end up here');
				})
				.listen();
		});

		it('should not navigate when page does not match root', () => {
			const router = new Router('/bar');
			router.add('/foo', () => {
				fail('should not end up here');
			});
		});

		it('should navigate when popstate event is fired', (done) => {
			const router = new Router();
			router
				.pause()
				.add('/foo', () => {
					done();
				})
				.listen(); // uses pause() and listen() to not niguate on page load

			const event = new (window as any).PopStateEvent('popstate', {});
			window.dispatchEvent(event);
		});
	});
});
