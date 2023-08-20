<script lang="ts">
	import type { EmployeeStockPurchase, RestrictedStockUnits } from '../model';

	import Espp from './espp.svelte';
	import Money from './money.svelte';
	import Rsu from './rsu.svelte';

	export let stock: RestrictedStockUnits | EmployeeStockPurchase;
	export let currentPrice: number;
</script>

<details>
	<summary style="display: flex; flex-direction: row;">
		<div style="flex-grow: 1;"><span style="text-transform: uppercase">{stock.type}</span> {stock.count}</div>
		<div style="white-space: nowrap;"><Money value={stock.count * currentPrice} deductTax={stock.type == 'rsu'} /></div>
	</summary>
	<p>
		{#if stock.type === 'rsu'}
			<Rsu rsu={stock} {currentPrice} />
		{:else if stock.type === 'espp'}
			<Espp espp={stock} {currentPrice} />
		{:else}
			Unknown Type
		{/if}
	</p>
</details>
