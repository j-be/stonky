export const forgeYFinanceResponse = (value: number) => {
	const adjclose = Math.random() < 0.5 ? [value] : undefined;

	return {
		chart: {
			result: [
				{
					indicators: { adjclose: [{ adjclose }] },
					meta: { chartPreviousClose: value },
				},
			],
		},
	};
};

export const forgeRsu = (values?: object) => ({
	count: 123,
	type: 'rsu',
	granted: '2022-11-15',
	firstVest: {
		percentage: 0.5,
		duration: { amount: 1, unit: 'years' },
	},
	subsequentVests: {
		percentage: 0.5,
		duration: { amount: 1, unit: 'years' },
	},
	sellings: [],
	...values,
});
