import { expect, test } from '@playwright/test';
import { forgeYFinanceResponse } from './factory';

test('add RSUs', async ({ page }) => {
	await page.route('https://yfinance.great-horned-owl.dedyn.io/v8/finance/chart/DT?*', async (route) => {
		await route.fulfill({ json: forgeYFinanceResponse(100) });
	});
	await page.route('https://yfinance.great-horned-owl.dedyn.io/v8/finance/chart/EUR=X?*', async (route) => {
		await route.fulfill({ json: forgeYFinanceResponse(0.9) });
	});

	await page.goto('/');

	// Click add
	await page.getByRole('button', { name: 'Add stocks' }).click();

	// Input values
	await page.getByLabel('Number of shares').isVisible();
	await page.getByText('rsu', { exact: true }).click();
	await page.getByLabel('Number of shares').fill('128');
	await page.getByLabel('Granted').fill('2022-11-10');
	await page.locator('#firstVest').locator('input').nth(0).fill('25');
	await page.locator('#subsequentVests').locator('input').nth(0).fill('6.25');
	await page.locator('#subsequentVests').locator('input').nth(1).fill('3');
	await page.locator('#subsequentVests').getByRole('combobox').selectOption('months');
	await page.getByRole('button', { name: 'Save' }).click();

	// Check
	await expect(page.locator('.overview').getByText('RSU annual gross2,880.00 € (3,200.00 $)')).toBeVisible();
	const rsu = page.locator('details').nth(1);
	await expect(rsu).toBeVisible();
	await expect((await rsu.locator('summary').textContent())?.trim()).toContain('rsu 128 5,990.40 € (12,800.00 $)');

	rsu.click();
	const rows = rsu.getByRole('row');
	await expect(rows).toHaveCount(15);
	await expect((await rows.nth(1).textContent())?.trim()).toBe(
		'2023-11-1032.00100.00 $ @ 0.900 €/$1,497.60 € (3,200.00 $)',
	);
	for (let j = 0; j < 3; j++) {
		for (let i = 0; i < 4; i++) {
			await expect((await rows.nth(2 + i + 4 * j).textContent())?.trim()).toMatch(
				new RegExp(
					`202${4 + j}-${String(2 + i * 3).padStart(2, '0')}-108\\.00(100\\.00 \\$)? (@ 0\\.900 €/\\$)?374\\.40 € \\(800\\.00 \\$\\)`,
				),
			);
		}
	}
});

test('add ESPPs', async ({ page }) => {
	let requestCount = 0;
	await page.route('https://yfinance.great-horned-owl.dedyn.io/v8/finance/chart/DT?*', async (route) => {
		await route.fulfill({ json: forgeYFinanceResponse(100 + requestCount++) });
	});
	await page.route('https://yfinance.great-horned-owl.dedyn.io/v8/finance/chart/EUR=X?*', async (route) => {
		await route.fulfill({ json: forgeYFinanceResponse(0.9) });
	});

	await page.goto('/');

	// Click add
	await page.getByRole('button', { name: 'Add stocks' }).click();

	// Input values
	await page.getByText('espp').click();
	await page.getByLabel('Number of shares').fill('128');
	await page.getByLabel('Start').fill('2023-11-10');
	await expect(await page.getByLabel('End').inputValue()).toBe('2024-05-09');

	await page.getByRole('button', { name: 'Save' }).click();

	// Check
	await expect(page.locator('.overview').getByText('RSU annual gross0.00 € (0.00 $)')).toBeVisible();
	const espp = page.locator('details').nth(1);
	await expect(espp).toBeVisible();
	await expect(espp.getByText('espp 128 10,626.97 € (11,807.74 $)')).toBeVisible();

	espp.click();

	const overview = espp.getByRole('table').nth(0).getByRole('row');
	await expect(await overview.nth(1).textContent()).toBe('Price paid9,889.92 € (10,988.80 $)');
	await expect(await overview.nth(2).textContent()).toBe('Net if sold now10,626.97 € (11,807.74 $)');
	await expect(await overview.nth(3).textContent()).toBe('Net profit if kept1,630.08 € (1,811.20 $)');
	await expect(await overview.nth(4).textContent()).toBe('Net profit if sold now737.05 € (818.94 $)');

	const details = espp.getByRole('table').nth(1).getByRole('row');
	await expect(await details.nth(1).textContent()).toBe('Current value11,520.00 € (12,800.00 $)');
	await expect(await details.nth(2).textContent()).toBe('Capital gains-230.40 € (-256.00 $)');
	await expect(await details.nth(3).textContent()).toBe('Discount (untaxed)1,860.48 € (2,067.20 $)');
	await expect(await details.nth(4).textContent()).toBe('Discount (taxed)967.45 € (1,074.94 $)');
});
