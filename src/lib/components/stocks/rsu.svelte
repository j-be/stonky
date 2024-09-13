<script lang="ts">
	import { stockPriceStore } from '$lib/stores';
	import type { RestrictedStockUnits, RsuVest } from '../../model';

	import { flattenRsus } from '../../utils';
	import FormattedNumber from '../formattedNumber.svelte';
	import Money from '../money.svelte';

	export let rsus: RestrictedStockUnits[];

	let vests: RsuVest[] = [];

	$: flattenRsus(rsus).then((flattened) => {
		vests = flattened;
	});
</script>

<div class="overflowing-table overflow-auto">
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
							<Money value={vest.price * vest.count} />
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
				<td><Money value={NaN} /></td>
			</tr>
		</tfoot>
	</table>
</div>
