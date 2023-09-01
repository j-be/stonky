<script lang="ts">
	import type { RestrictedStockUnits, RsuVest } from '../model';

	import { flattenRsu } from '../utils';
	import FormattedNumber from './formattedNumber.svelte';
	import Money from './money.svelte';

	export let rsu: RestrictedStockUnits;
	export let currentPrice: number;

	let durationMonths: number = 0;
	let vests: RsuVest[];

	$: ({ durationMonths, vests } = flattenRsu(rsu));
	$: currentValue = currentPrice * rsu.count;
</script>

<table>
	<thead>
		<tr>
			<th>Vesting date</th>
			<th>Amount</th>
			<th>Current net worth</th>
		</tr>
	</thead>
	<tbody>
		{#each vests as vest}
			<tr class:muted={vest.date.isInPast}>
				<td>{vest.date.dateString}</td>
				<td><FormattedNumber value={vest.count} /></td>
				<td><Money value={currentPrice * vest.count} /></td>
			</tr>
		{/each}
	</tbody>
	<tfoot>
		<tr>
			<td>Sum</td>
			<td>{rsu.count}</td>
			<td><Money value={currentValue} /></td>
		</tr>
		<tr>
			<td />
			<td>Per month</td>
			<td><Money value={currentValue / durationMonths} /></td>
		</tr>
	</tfoot>
</table>
