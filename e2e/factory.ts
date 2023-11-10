export const forgeYFinanceResponse = (value: number) => ({
	chart: { result: [{ indicators: { adjclose: [{ adjclose: [value] }] } }] },
});
