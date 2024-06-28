<script lang="ts">
	import { annualGrossStore, exchangeRateStore, stockPriceStore, taxStore } from '$lib/stores';
	import Money from '$lib/components/money.svelte';

	let currentPrice = NaN;
	let exchangeRate = NaN;

	$: exchangeRate = $exchangeRateStore;
	$: currentPrice = $stockPriceStore;
	$: annualGross = $annualGrossStore;
</script>

<article class="overview">
	<table>
		<tbody>
			<tr>
				<th>Stock price</th>
				<td>
					{#if !isNaN(currentPrice)}
						{currentPrice} $
					{:else}
						<span aria-busy="true" />
					{/if}
				</td>
			</tr>
			<tr>
				<th>Exchange rate</th>
				<td>
					{#if !isNaN(exchangeRate)}
						{exchangeRate} <sup>$</sup>/<sub>€</sub>
					{:else}
						<span aria-busy="true" />
					{/if}
				</td>
			</tr>
			<tr>
				<th>Income tax</th>
				<td>
					{$taxStore * 100} %
					<a href="/settings" class="icon settings">&#8288;</a>
				</td>
			</tr>
			<tr>
				<th>RSU annual</th>
				<td>
					{#if !isNaN(annualGross)}
						<Money value={annualGross} />
					{:else}
						<span aria-busy="true" />
					{/if}
				</td>
			</tr>
		</tbody>
	</table>
</article>
