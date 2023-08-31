<script lang="ts">
	import { intervalToDuration } from 'date-fns';
	import type { RestrictedStockUnits } from '../model';

	import { getDate } from '../utils';
	import FormattedNumber from './formattedNumber.svelte';
	import Money from './money.svelte';

	export let rsu: RestrictedStockUnits;
	export let currentPrice: number;

	let flattened = [
		{
			date: getDate(rsu.granted, 1, rsu.firstVest.duration),
			count: rsu.count * rsu.firstVest.percentage,
		},
	];

	let vested = rsu.firstVest.percentage;
	let i = 0;
	while (Math.abs(vested - 1) > 0.0000001) {
		vested += rsu.subsequentVests.percentage;
		i++;

		flattened = [
			...flattened,
			{
				date: getDate(flattened[0].date.dateString, i, rsu.subsequentVests.duration),
				count: rsu.count * rsu.subsequentVests.percentage,
			},
		];
	}

	let duration = intervalToDuration({
		start: new Date(rsu.granted),
		end: new Date(flattened[flattened.length - 1].date.dateString),
	});
	let durationMonths = (duration.years ?? 0) * 12 + (duration.months ?? 0);
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
		{#each flattened as vest}
			<tr>
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
			<td><Money value={currentPrice * rsu.count} /></td>
		</tr>
		<tr>
			<td></td>
			<td>Per month</td>
			<td><Money value={currentPrice * rsu.count / durationMonths} /></td>
		</tr>
	</tfoot>
</table>
