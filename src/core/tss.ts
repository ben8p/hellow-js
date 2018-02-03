export interface ITSS {
	[key: string]: CSS.CSSProperties | ITSS;
}
export function parse(tss: ITSS): string {
	const parseTSS = (json: ITSS): string => {
		const selectors = Object.keys(json);
		return selectors.map((selector) => {
			const definitions = json[selector];
			const rules = Object.keys(definitions);
			const subDefinitons: ITSS[] = [];
			const result = rules.map((rule) => {
				if (typeof definitions[rule] === 'object') {
					const newSelector = `${selector} ${rule}`.replace(/ &/g, '');
					const subset: ITSS = {};
					subset[newSelector] = definitions[rule];
					subDefinitons.push(subset);
					return undefined;
				} else {
					return `${rule}:${definitions[rule]};`;
				}
			}).join('');
			const subsetResult = subDefinitons.map((subDefiniton) => {
				return parseTSS(subDefiniton);
			}).join('');
			return `${selector}{${result}}${subsetResult}`;
		}).join('');
	};

	return parseTSS(tss);
}
