<script lang="ts">
	import { stockPriceStore } from '$lib/stores';
	import type { EmployeeStockPurchase, RestrictedStockUnits } from '../model';

	import Espp from './espp.svelte';
	import Money from './money.svelte';
	import Rsu from './rsu.svelte';

	export let id: number;
	export let stock: RestrictedStockUnits | EmployeeStockPurchase;

	let value = NaN;

	const handleCurrentValue = (currentValue: CustomEvent<{ value: number }>) => {
		value = currentValue.detail.value;
	};

	$: if (stock.type === 'rsu') value = stock.count * $stockPriceStore;
</script>

<details>
	<summary>
		<div class="title">
			<a href="/edit/{stock.type}/{id}" class="icon edit">&#8288;</a>
			<span>
				<span class="uppercase">{stock.type}</span>
				{stock.count}
			</span>
		</div>
		<div><Money {value} deductTax={stock.type == 'rsu'} /></div>
	</summary>

	{#if stock.type === 'rsu'}
		<Rsu rsu={stock} />
	{:else if stock.type === 'espp'}
		<Espp on:currentNet={handleCurrentValue} espp={stock} />
	{:else}
		Unknown Type
	{/if}
</details>
