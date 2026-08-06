export const forgeYFinanceResponse = (value: number, requestUrl?: string) => {
	const url = requestUrl ? new URL(requestUrl) : undefined;
	const period2 = url ? Number(url.searchParams.get('period2')) : undefined;
	const timestamp = period2 ? period2 - 24 * 60 * 60 : Math.floor(Date.now() / 1000);
	const close = Math.random() < 0.5 ? [value] : [value, null];

	return {
		chart: {
			result: [
				{
					timestamp: [timestamp],
					indicators: { quote: [{ close }] },
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
