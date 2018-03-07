
import { debounce } from './debounce';

describe('debounce', () => {
	beforeEach(() => {
		(global as any).window = global;
		jasmine.clock().install();
	});
	afterEach(() => {
		jasmine.clock().uninstall();
	});

	it('should call debounced method only once', () => {
		const test = jasmine.createSpy('test');

		const debouncedTest = debounce(test);

		expect(test).not.toHaveBeenCalled();
		debouncedTest();
		debouncedTest();
		jasmine.clock().tick(100);
		expect(test).toHaveBeenCalledTimes(1);
	});

	it('should pass the arguments of the last call only', (done) => {
		const test = {
			foo: (...args) => {
				expect(args).toEqual(['bar', 'baz']);
				done();
			},
		};
		const spy = spyOn(test, 'foo').and.callThrough();

		const debouncedTest = debounce(test.foo);

		expect(spy).not.toHaveBeenCalled();
		debouncedTest('foo', 'bar');
		debouncedTest('bar', 'baz');
		jasmine.clock().tick(100);
		expect(spy).toHaveBeenCalledTimes(1);
	});
});
