<script lang="ts">
	import { stockPriceStore } from '$lib/stores';
	import { onDestroy, onMount } from 'svelte';
	import type { RestrictedStockUnits, RsuVest } from '../../model';

	import { flattenRsus, formatNumber } from '../../utils';
	import FormattedNumber from '../formattedNumber.svelte';
	import Money from '../money.svelte';

	export let rsus: RestrictedStockUnits[];

	let vests: RsuVest[] = [];
	let perMonth: number = NaN;

	$: flattenRsus(rsus).then((flattened) => {
		vests = flattened.vests;
		perMonth = flattened.perMonth;
	});

	let scrollContainer: Element;
	let mutationObserver: MutationObserver;

	onMount(() => {
		if (!window.MutationObserver) {
			return;
		}

		mutationObserver = new window.MutationObserver(() => {
			// Scroll to the last muted row, i.e. the last one that vested
			var mutedRows = scrollContainer?.querySelectorAll('tr.muted');
			if (mutedRows?.length > 2) {
				const top = mutedRows[mutedRows.length - 1].offsetTop - mutedRows[0].offsetTop;
				scrollContainer.scrollTo(0, top);
			}
		});
		mutationObserver.observe(scrollContainer, { childList: true, subtree: true });
	});

	onDestroy(() => {
		mutationObserver.disconnect();
	});
</script>

<div class="overflowing-table overflow-auto" bind:this={scrollContainer}>
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
						{#if vest.exchangeRate}
							@ {formatNumber(vest.exchangeRate, 3)} <sup>€</sup>/<sub>$</sub>
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
				<td>Per month</td>
				<td><FormattedNumber value={perMonth} /></td>
				<td><FormattedNumber value={$stockPriceStore} unit="$" /></td>
				<td><Money value={$stockPriceStore * perMonth} /></td>
			</tr>
		</tfoot>
	</table>
</div>
