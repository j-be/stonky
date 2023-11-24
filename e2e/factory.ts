export const forgeYFinanceResponse = (value: number) => ({
	chart: { result: [{ indicators: { adjclose: [{ adjclose: [value] }] } }] },
});

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
