<script lang="ts">
	import type { EmployeeStockPurchase, RestrictedStockUnits } from '$lib/model';

	import Stocks from '$lib/components/stocks.svelte';
	import { fetchForNow } from '$lib/yfinance-api';

	import { onMount } from 'svelte';

	const stocks: (RestrictedStockUnits | EmployeeStockPurchase)[] = [
	];

	let currentPrice: number | null = null;

	onMount(async () => {
		currentPrice = await fetchForNow('DT');
	});
</script>

<h1>Stonky</h1>

{#if currentPrice}
	{#each stocks as stock}
		<Stocks {stock} {currentPrice} />
	{/each}
{:else}
	Loading current price
{/if}
