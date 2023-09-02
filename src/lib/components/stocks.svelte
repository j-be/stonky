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
	<summary style="display: flex; flex-direction: row;">
		<div class="title" style="flex-grow: 1;">
			<a href="/edit/{stock.type}/{id}" class="outline">Edit</a>
			<span>
				<span style="text-transform: uppercase">{stock.type}</span>
				{stock.count}
			</span>
		</div>
		<div style="white-space: nowrap;"><Money {value} deductTax={stock.type == 'rsu'} /></div>
	</summary>

	{#if stock.type === 'rsu'}
		<Rsu rsu={stock} />
	{:else if stock.type === 'espp'}
		<Espp on:currentNet={handleCurrentValue} espp={stock} />
	{:else}
		Unknown Type
	{/if}
</details>
