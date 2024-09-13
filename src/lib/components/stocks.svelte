<script lang="ts">
	import { stockPriceStore } from '$lib/stores';
	import type { EmployeeStockPurchase, RestrictedStockUnits } from '../model';

	import Rsu from './rsu.svelte';
	import StocksHeader from './stocks/stocksHeader.svelte';

	export let id: number;
	export let stock: RestrictedStockUnits | EmployeeStockPurchase;

	let value = NaN;

	$: value = stock.count * $stockPriceStore;
</script>

<details>
	<summary><StocksHeader {id} type={stock.type} count={stock.count} {value} /></summary>

	{#if stock.type === 'rsu'}
		<Rsu rsu={stock} />
	{:else}
		Unknown Type
	{/if}
</details>
