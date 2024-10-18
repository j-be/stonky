<script lang="ts">
	import { stockPriceStore } from '$lib/stores';
	import type { RestrictedStockUnits, RsuVest } from '../model';

	import { flattenRsu } from '../utils';
	import FormattedNumber from './formattedNumber.svelte';
	import Money from './money.svelte';

	export let rsu: RestrictedStockUnits;

	let durationMonths = 0;
	let vests: RsuVest[] = [];

	$: flattenRsu(rsu).then((flattened) => {
		durationMonths = flattened.durationMonths;
		vests = flattened.vests;
	});
	$: currentValue = $stockPriceStore * rsu.count;
</script>

<table>
	<thead>
		<tr>
			<th>Vesting date</th>
			<th>Amount</th>
			<th>Price</th>
			<th>Current net worth</th>
		</tr>
	</thead>
	<tbody>
		{#each vests as vest}
			<tr class:muted={vest.date.isInPast}>
				<td>{vest.date.dateString}</td>
				<td><FormattedNumber value={vest.count} /></td>
				<td>
					{#if vest.price}
						<FormattedNumber value={vest.price} unit="$" />
					{/if}
				</td>
				<td>
					{#if vest.price}
						<Money value={vest.price * vest.count} exchangeRate={vest.exchangeRate} />
					{:else}
						<Money value={$stockPriceStore * vest.count} />
					{/if}
				</td>
			</tr>
		{/each}
	</tbody>
	<tfoot>
		<tr>
			<td colspan="2" />
			<td>Per month</td>
			<td><Money value={currentValue / durationMonths} /></td>
		</tr>
	</tfoot>
</table>
