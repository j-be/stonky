import { expect, test } from '@playwright/test';
import { forgeRsu, forgeYFinanceResponse } from './factory';

const initStocks = (stocks) => {
	if (!localStorage.getItem('stocks')) {
		localStorage.setItem('stocks', JSON.stringify(stocks));
	}
};

test('add RSU selling', async ({ page }) => {
	await page.route('https://yfinance.great-horned-owl.dedyn.io/v8/finance/chart/EUR=X?*', async (route) => {
		await route.fulfill({ json: forgeYFinanceResponse(0.9) });
	});
	await page.addInitScript(initStocks, { rsu: { stocks: [forgeRsu()] }, espp: { stocks: [] } });

	await page.goto('/');
	await expect(page.getByText('RSU 123')).toBeVisible();

	await page.goto('/edit/rsu/0');
	const addButton = page.getByRole('button', { name: 'Add selling' });
	await expect(addButton).toBeVisible();
	await addButton.click();

	await expect(page.getByText('Number of shares')).toBeVisible();
	await page.locator('input').nth(0).fill('23');
	const dateInput = page.locator('input').nth(1);
	await expect(dateInput).not.toBeEmpty();
	await dateInput.fill('2023-11-15');
	await page.locator('input').nth(2).fill('12');

	await page.getByRole('button', { name: 'Save' }).click();
	await expect(page.getByText('On 2023-11-15 sold 23 stocks for 12.00 $ each = 248.40 € (276.00 $)')).toBeVisible();
});

test('edit RSU selling', async ({ page }) => {
	await page.route('https://yfinance.great-horned-owl.dedyn.io/v8/finance/chart/EUR=X?*', async (route) => {
		await route.fulfill({ json: forgeYFinanceResponse(0.9) });
	});
	await page.addInitScript(initStocks, {
		rsu: { stocks: [forgeRsu({ sellings: [{ count: 12, price: 24, date: '2023-11-24' }] })] },
		espp: { stocks: [] },
	});

	await page.goto('/');
	await expect(page.getByText('RSU 123')).toBeVisible();

	await page.goto('/edit/rsu/0');
	await expect(page.getByText('On 2023-11-24 sold 12 stocks for 24.00 $ each = 259.20 € (288.00 $)')).toBeVisible();
	const editButton = page.locator('a').first();
	await expect(editButton).toBeVisible();
	await editButton.click();

	await expect(page.getByText('Number of shares')).toBeVisible();
	const countInput = page.locator('input').nth(0);
	await expect(await countInput.inputValue()).toBe('12');
	await countInput.fill('36');
	const dateInput = page.locator('input').nth(1);
	await expect(await dateInput.inputValue()).toBe('2023-11-24');
	await dateInput.fill('2023-11-10');
	const priceInput = page.locator('input').nth(2);
	await expect(await priceInput.inputValue()).toBe('24');
	await priceInput.fill('48');

	await page.getByRole('button', { name: 'Save' }).click();
	await expect(page.getByText('On 2023-11-10 sold 36 stocks for 48.00 $ each = 1,555.20 € (1,728.00 $)')).toBeVisible();
});

test('RSU editing', async ({ page }) => {
	await page.addInitScript(initStocks, { rsu: { stocks: [forgeRsu()] }, espp: { stocks: [] } });

	await page.goto('/');
	await page.goto('/edit/rsu/0');
	await expect(page.getByText('Number of shares')).toBeVisible();
	const countInput = page.locator('input').nth(0);
	await expect(await countInput.inputValue()).toBe('123');
	await countInput.fill('456');

	await page.getByRole('button', { name: 'Save' }).click();
	await expect(page.getByText('RSU 456')).toBeVisible();
});

test('canel RSU editing', async ({ page }) => {
	await page.addInitScript(initStocks, { rsu: { stocks: [forgeRsu()] }, espp: { stocks: [] } });

	await page.goto('/');
	await page.goto('/edit/rsu/0');
	await expect(page.getByText('Number of shares')).toBeVisible();
	const countInput = page.locator('input').nth(0);
	await expect(await countInput.inputValue()).toBe('123');
	await countInput.fill('456');

	await page.getByRole('button', { name: 'Cancel' }).click();
	await expect(page.getByText('RSU 123')).toBeVisible();
});
