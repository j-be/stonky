<script lang="ts">
	import type { EmployeeStockPurchase, RestrictedStockUnits } from '../model';

	import Espp from './espp.svelte';
	import Money from './money.svelte';
	import Rsu from './rsu.svelte';

	export let id: number;
	export let stock: RestrictedStockUnits | EmployeeStockPurchase;
	export let currentPrice: number;

	let value = 0;

	const handleCurrentValue = (currentValue: CustomEvent<{ value: number }>) => {
		value = currentValue.detail.value;
	};

	$: if (stock.type === 'rsu') value = stock.count * currentPrice;
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
	<p>
		{#if stock.type === 'rsu'}
			<Rsu rsu={stock} {currentPrice} />
		{:else if stock.type === 'espp'}
			<Espp on:currentNet={handleCurrentValue} espp={stock} {currentPrice} />
		{:else}
			Unknown Type
		{/if}
	</p>
</details>
