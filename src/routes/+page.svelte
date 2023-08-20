<script lang="ts">
	import type { EmployeeStockPurchase, RestrictedStockUnits } from '$lib/model';

	import Stocks from '$lib/components/stocks.svelte';
	import { fetchForDate } from '$lib/yfinance-api';
	import Money from '$lib/components/money.svelte';

	import { onMount } from 'svelte';

	const stocks: (RestrictedStockUnits | EmployeeStockPurchase)[] = [
	];

	let currentPrice: number | null = null;

	onMount(async () => {
		currentPrice = await fetchForDate(new Date().getTime() / 1000 - 24 * 60 * 60);
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
