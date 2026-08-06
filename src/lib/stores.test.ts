import { get } from 'svelte/store';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const fetchForNow = vi.fn();

vi.mock('./yfinance-api', () => ({ fetchForNow }));

describe('stock price refresh', () => {
	beforeEach(() => {
		vi.resetModules();
		fetchForNow.mockReset();
	});

	it('forces a fresh stock price fetch and updates the store', async () => {
		fetchForNow.mockResolvedValue(123.45);
		const { stockPriceStore, refreshStockPrice } = await import('./stores');

		await refreshStockPrice();

		expect(fetchForNow).toHaveBeenCalledWith('DT', true);
		expect(get(stockPriceStore)).toBe(123.45);
	});
});
