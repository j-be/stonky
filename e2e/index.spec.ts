import { expect, test } from '@playwright/test';
import { forgeYFinanceResponse } from './factory';

test('index page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h1')).toBeVisible();
	await expect(page.locator('h1')).toHaveText(/Stonky.*/);
});

test('stock price and exchange rate are displayed', async ({ page }) => {
	await page.route('https://yfinance.great-horned-owl.dedyn.io/v8/finance/chart/DT?*', async (route) => {
		await route.fulfill({ json: forgeYFinanceResponse(123.45) });
	});
	await page.route('https://yfinance.great-horned-owl.dedyn.io/v8/finance/chart/EUR=X?*', async (route) => {
		await route.fulfill({ json: forgeYFinanceResponse(67.89) });
	});

	await page.goto('/');

	const overview = page.locator('.overview');
	await expect(overview.getByText('Stock price123.45 $')).toBeVisible();
	await expect(overview.getByText('Exchange rate67.890 €/$')).toBeVisible();
	await expect(overview.getByText('RSU annual gross0.00 € (0.00 $)')).toBeVisible();
});
