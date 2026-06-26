import { expect, test } from '@playwright/test';
import { forgeRsu, forgeYFinanceResponse } from './factory';

const initStocks = (stocks) => {
	if (!localStorage.getItem('stocks')) {
		localStorage.setItem('stocks', JSON.stringify(stocks));
	}
};

test('fully vested RSU excluded from totals and marked in edit', async ({ page }) => {
	page.clock.setFixedTime(new Date('2026-01-01T12:00:00Z'));

	await page.route('https://yfinance.great-horned-owl.dedyn.io/v8/finance/chart/DT?*', async (route) => {
		await route.fulfill({ json: forgeYFinanceResponse(100) });
	});
	await page.route('https://yfinance.great-horned-owl.dedyn.io/v8/finance/chart/EUR=X?*', async (route) => {
		await route.fulfill({ json: forgeYFinanceResponse(0.9) });
	});

	const fullyVested = forgeRsu({ granted: '2018-01-01', count: 100 });
	const stillVesting = forgeRsu({ granted: '2025-01-01', count: 50 });

	await page.addInitScript(initStocks, { rsu: { stocks: [fullyVested, stillVesting] }, espp: { stocks: [] } });

	await page.goto('/');

	// Make sure the fully vested RSU is not included in the totals
	await expect(page.locator('.overview').getByText('RSU annual gross2,250.00 € (2,500.00 $)')).toBeVisible();

	// Make sure only the fully vested RSU is marked as muted in the edit page
	await page.goto('/edit/rsu');

	const rsus = page.locator('article');
	await expect(rsus).toHaveCount(2);
	await expect(rsus.nth(0)).toHaveClass('muted');
	await expect(rsus.nth(1)).not.toHaveClass('muted');
});
