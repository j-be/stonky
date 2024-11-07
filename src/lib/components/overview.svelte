<script lang="ts">
	import { annualGrossStore, exchangeRateStore, stockPriceStore, taxStore } from '$lib/stores';
	import Money from '$lib/components/money.svelte';
	import { formatNumber } from '$lib/utils';
</script>

<article class="overview">
	<table>
		<tbody>
			<tr>
				<th>Stock price</th>
				<td>
					{#if !isNaN($stockPriceStore)}
						{formatNumber($stockPriceStore)} $
					{:else}
						<span aria-busy="true"></span>
					{/if}
				</td>
			</tr>
			<tr>
				<th>Exchange rate</th>
				<td>
					{#if !isNaN($exchangeRateStore)}
						{formatNumber($exchangeRateStore, 3)} <sup>€</sup>/<sub>$</sub>
					{:else}
						<span aria-busy="true"></span>
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
					{#if !isNaN($annualGrossStore)}
						<em data-tooltip={`Net: ${formatNumber($annualGrossStore * $taxStore * $exchangeRateStore, 2)} €`}>
							<Money value={$annualGrossStore} deductTax={false} />
						</em>
					{:else}
						<span aria-busy="true"></span>
					{/if}
				</td>
			</tr>
		</tbody>
	</table>
</article>
