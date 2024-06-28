<script lang="ts">
	import { annualGrossStore, exchangeRateStore, stockPriceStore, taxStore } from '$lib/stores';
	import Money from '$lib/components/money.svelte';
	import { formatNumber } from '$lib/utils';

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
						{formatNumber(currentPrice)} $
					{:else}
						<span aria-busy="true" />
					{/if}
				</td>
			</tr>
			<tr>
				<th>Exchange rate</th>
				<td>
					{#if !isNaN(exchangeRate)}
						{formatNumber(exchangeRate, 3)} <sup>$</sup>/<sub>€</sub>
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
				<th>RSU annual gross</th>
				<td>
					{#if !isNaN(annualGross)}
						<em data-tooltip={`Net: ${formatNumber(annualGross * $taxStore * $exchangeRateStore, 2)} €`}>
							<Money value={annualGross} deductTax={false} />
						</em>
					{:else}
						<span aria-busy="true" />
					{/if}
				</td>
			</tr>
		</tbody>
	</table>
</article>
