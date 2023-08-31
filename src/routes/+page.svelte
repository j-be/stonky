<script lang="ts">
	import type { EmployeeStockPurchase, RestrictedStockUnits } from '$lib/model';

	import Stocks from '$lib/components/stocks.svelte';
	import { fetchForNow } from '$lib/yfinance-api';

	import { onMount } from 'svelte';
	import { esppStore, rsuStore } from '$lib/stores';

	let currentPrice: number | null = null;
	let espps: EmployeeStockPurchase[] = [];
	let rsus: RestrictedStockUnits[] = [];

	esppStore.subscribe((esppsFromStore) => (espps = esppsFromStore));
	rsuStore.subscribe((rsusFromStore) => (rsus = rsusFromStore));

	onMount(async () => {
		currentPrice = await fetchForNow('DT');
	});
</script>

<h1>Stonky</h1>

{#if currentPrice}
	{#each [espps, rsus] as stocks, i}
	{#each stocks as stock, id}
		<Stocks {id} {stock} {currentPrice} />
	{/each}
	{/each}
{:else}
	Loading current price
{/if}

<a href="/add" role="button"><b>+</b></a>
