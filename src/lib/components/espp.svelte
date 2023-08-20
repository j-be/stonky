<script lang="ts">
	import { fetchForDateString } from '$lib/yfinance-api';
	import { onMount } from 'svelte';
	import type { EmployeeStockPurchase } from '../model';
	import FormattedNumber from './formattedNumber.svelte';
	import Money from './money.svelte';

	export let espp: EmployeeStockPurchase;
	export let currentPrice: number;

	let startPrice = 0;
	let endPrice = 0;
	let purchasePrice = 0;

	onMount(async () => {
		startPrice = await fetchForDateString(espp.periodStart);
		endPrice = await fetchForDateString(espp.periodEnd);
		purchasePrice = Math.min(startPrice, endPrice) * 0.85;
	});
</script>


<div class="grid">
	<div>
		Start: {espp.periodStart}
		<FormattedNumber value={startPrice} unit="$" />
	</div>
	<div>
		End: {espp.periodEnd}
		<FormattedNumber value={endPrice} unit="$" />
	</div>
	<div>
		Purchase price:
		<FormattedNumber value={purchasePrice} unit="$" />
	</div>
</div>
<div class="grid">
	<div>Number of stocks: {espp.count}</div>
	<!--<div>Current price: <Money value={currentPrice} deductTax={false} /></div>-->
	<div>Bought for: <Money value={espp.count * purchasePrice} deductTax={false} /></div>
	<div>Current value: <Money value={espp.count * currentPrice} deductTax={false} /></div>
</div>
<div class="grid">
	<div />
	<div>Salary (gross): <Money value={espp.count * (endPrice - purchasePrice)} deductTax={false} /></div>
	<div>Kapitalertrag: <Money value={espp.count * (currentPrice - endPrice)} deductTax={false} /></div>
</div>
