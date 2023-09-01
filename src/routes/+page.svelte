<script lang="ts">
	import type { EmployeeStockPurchase, RestrictedStockUnits } from '$lib/model';
	import { exchangeRateStore, stockPriceStore, stocksStore, taxStore } from '$lib/stores';

	import Stocks from '$lib/components/stocks.svelte';

	let currentPrice: number = -1;
	let exchangeRate: number | null = null;
	let espps: EmployeeStockPurchase[] = [];
	let rsus: RestrictedStockUnits[] = [];

	$: espps = $stocksStore.espp.stocks;
	$: rsus = $stocksStore.rsu.stocks;
	$: exchangeRate = $exchangeRateStore;
	$: currentPrice = $stockPriceStore;
	$: tax = $taxStore;
</script>

<h1>Stonky</h1>

<article class="overview">
	<table>
		<tbody>
			<tr>
				<th>Stock price</th>
				<td>
					{#if currentPrice > 0}
						{currentPrice} $
					{:else}
						<span aria-busy="true" />
					{/if}</td
				>
			</tr>
			<tr>
				<th>Exchange rate</th>
				<td
					>{#if exchangeRate}
						{exchangeRate} <sup>$</sup>/<sub>€</sub>
					{:else}
						<span aria-busy="true" />
					{/if}</td
				>
			</tr>
			<tr>
				<th>Income tax</th>
				<td>{tax * 100} %</td>
			</tr>
		</tbody>
	</table>
</article>

{#if currentPrice > 0}
	{#each [espps, rsus] as stocks}
		{#each stocks as stock, id}
			<Stocks {id} {stock} />
		{/each}
	{/each}
{:else}
	Loading current price
{/if}

<a href="/add" role="button"><b>+</b></a>
