<script lang="ts">
	import { fetchForDateString } from '$lib/yfinance-api';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { EmployeeStockPurchase } from '../model';
	import Money from './money.svelte';
	import { formatNumber } from '$lib/utils';
	import { TAX } from '$lib/constants';
	import { intervalToDuration } from 'date-fns';
	import { stockPriceStore } from '$lib/stores';

	export let espp: EmployeeStockPurchase;

	let startPrice = 0;
	let endPrice = 0;

	let purchasePrice = 0;
	let discount = 0;
	let capitalGains = 0;
	let currentValue = 0;
	let netValue = 0;

	const dispatch = createEventDispatcher();

	onMount(async () => {
		startPrice = await fetchForDateString(espp.periodStart, 'DT');
		endPrice = await fetchForDateString(espp.periodEnd, 'DT');
	});

	// 15% discount on the lower of the two prices
	$: purchasePrice = Math.min(startPrice, endPrice) * 0.85;
	$: paid = espp.count * purchasePrice;
	$: discount = espp.count * (endPrice - purchasePrice);
	$: capitalGains = espp.count * ($stockPriceStore - endPrice);
	$: currentValue = espp.count * $stockPriceStore;
	$: isTaxFree = (intervalToDuration({ start: new Date(espp.periodEnd), end: new Date() }).years ?? 0) > 4;
	$: netValue = currentValue - (isTaxFree ? 0 : discount * TAX) - Math.max(capitalGains, 0) * 0.25;
	$: dispatch('currentNet', { value: netValue });
</script>

<div class="grid">
	<div>
		<table>
			<thead>
				<tr>
					<th colspan="2">Overview</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Price paid</td>
					<td>
						<em data-tooltip="{espp.count} x {formatNumber(purchasePrice)} $">
							<Money value={paid} deductTax={false} />
						</em>
					</td>
				</tr>
				<tr>
					<td>Net if sold now</td>
					<td>
						<em data-tooltip="CurrentValue - TaxOnDiscount - CapitalGainTax">
							<Money value={netValue} deductTax={false} />
						</em>
					</td>
				</tr>
				<tr>
					<td>Net profit if sold now</td>
					<td><Money value={netValue - paid} deductTax={false} /></td>
				</tr>
			</tbody>
		</table>
	</div>
	<div>
		<table>
			<thead>
				<tr>
					<th>Details</th>
					<th>{espp.periodStart} - {espp.periodEnd}</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Current value</td>
					<td><Money value={currentValue} deductTax={false} /></td>
				</tr>
				{#if isTaxFree}
					<tr>
						<td>Discount (untaxed)</td>
						<td><Money value={discount} deductTax={false} /></td>
					</tr>
				{:else}
					<tr>
						<td>Discount (taxed)</td>
						<td><Money value={discount * (1 - TAX)} deductTax={false} /></td>
					</tr>
				{/if}
				<tr>
					<td>Capital gains</td>
					<td><Money value={capitalGains} deductTax={false} /></td>
				</tr>
			</tbody>
		</table>
	</div>
</div>
