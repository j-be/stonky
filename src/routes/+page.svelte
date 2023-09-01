<script lang="ts">
	import type { EmployeeStockPurchase, RestrictedStockUnits } from '$lib/model';

	import Stocks from '$lib/components/stocks.svelte';
	import { fetchForNow } from '$lib/yfinance-api';

	import { onMount } from 'svelte';
	import { stocksStore } from '$lib/stores';

	let currentPrice: number | null = null;
	let espps: EmployeeStockPurchase[] = [];
	let rsus: RestrictedStockUnits[] = [];

	onMount(async () => {
		currentPrice = await fetchForNow('DT');
	});

	$: espps = $stocksStore.espp.stocks;
	$: rsus = $stocksStore.rsu.stocks;
</script>

<h1>Stonky</h1>

{#if currentPrice}
	{#each [espps, rsus] as stocks}
		{#each stocks as stock, id}
			<Stocks {id} {stock} {currentPrice} />
		{/each}
	{/each}
{:else}
	Loading current price
{/if}

<a href="/add" role="button"><b>+</b></a>
