<script lang="ts">
	import type { Duration, Selling } from '$lib/model';
	import Loading from '../loading.svelte';
	import { insertOrUpdate, stocksStore } from '$lib/stores';
	import ActionButtons from './actionButtons.svelte';
	import VestingPeriod from './vestingPeriod.svelte';
	import { onMount } from 'svelte';
	import Money from '../money.svelte';
	import { formatNumber } from '$lib/utils';

	interface Props {
		id?: number | null;
	}

	let { id = null }: Props = $props();

	let count = $state(0);
	let granted = $state('');
	let firstVestPercentage = $state(33.3333333333);
	let firstVestDuration: Duration = $state({ amount: 1, unit: 'years' });
	let subsequentVestsPercentage = $state(8.3333333333);
	let subsequentVestsDuration: Duration = $state({ amount: 1, unit: 'quarters' });
	let sellings: Selling[] = $state([]);

	let loading = false;

	onMount(() => {
		if (id !== null && $stocksStore.rsu.stocks[id]) {
			const stock = $stocksStore.rsu.stocks[id];
			({
				count,
				granted,
				firstVest: { duration: firstVestDuration },
				subsequentVests: { duration: subsequentVestsDuration },
				sellings,
			} = stock);
			firstVestPercentage = stock.firstVest.percentage * 100;
			subsequentVestsPercentage = stock.subsequentVests.percentage * 100;
		}
	});

	const save = () => {
		if (!valid) {
			return;
		}

		stocksStore.update((current) => ({
			...current,
			rsu: {
				...current.rsu,
				stocks: insertOrUpdate(
					current.rsu.stocks,
					{
						type: 'rsu',
						count,
						granted,
						firstVest: {
							percentage: firstVestPercentage / 100,
							duration: firstVestDuration,
						},
						subsequentVests: {
							percentage: subsequentVestsPercentage / 100,
							duration: subsequentVestsDuration,
						},
						sellings,
					},
					id,
				),
			},
		}));

		history.back();
	};

	const firstVestDurationChanged = (event: CustomEvent<Duration>) => {
		firstVestDuration = event.detail;
	};

	const subsequentVestsDurationChanged = (event: CustomEvent<Duration>) => {
		subsequentVestsDuration = event.detail;
	};

	let valid = $derived(
		!!count &&
			!!granted &&
			!!firstVestPercentage &&
			!!firstVestDuration.amount &&
			!!firstVestDuration.unit &&
			!!subsequentVestsDuration.amount &&
			!!subsequentVestsDuration.unit,
	);
</script>

<Loading {loading}>
	<form onsubmit={save}>
		<label for="count">
			Number of shares
			<input id="count" type="number" bind:value={count} min="0" step="1" />
		</label>
		<label for="granted">
			Granted
			<input id="granted" type="date" bind:value={granted} />
		</label>

		<label for="firstVest">
			First vest
			<div id="firstVest" class="vest-row">
				<input type="number" bind:value={firstVestPercentage} min="0" max="100" step="0.0000000001" />
				<span>% after</span>
				<VestingPeriod {...firstVestDuration} on:change={firstVestDurationChanged} />
				<div></div>
			</div>
		</label>

		<label for="subsequentVests">
			Subsequent vests
			<div id="subsequentVests" class="vest-row">
				<input type="number" bind:value={subsequentVestsPercentage} min="0" max="100" step="0.0000000001" />
				<span>% every</span>
				<VestingPeriod {...subsequentVestsDuration} on:change={subsequentVestsDurationChanged} />
				<div></div>
			</div>
		</label>

		<article>
			<header>
				<h2>Sellings</h2>
			</header>

			{#if sellings?.length}
				<div>
					{#each sellings as selling, i}
						<a href="/edit/rsu/{id}/sellings/{i}" class="icon edit">&#8288;</a>
						<span class="muted">On</span>
						{selling.date}
						<span class="muted">sold</span>
						{selling.count} stocks <span class="muted">for</span>
						{formatNumber(selling.price)} $ each <span class="muted">=</span>
						<Money value={selling.count * selling.price} deductTax={false} />
						<hr />
					{/each}
				</div>
			{:else}
				<p>Nothing sold yet</p>
			{/if}
			<footer>
				<a href="/add/rsu/{id}/sellings/" role="button"><span class="icon add"></span>&nbsp;Add selling</a>
			</footer>
		</article>

		<ActionButtons {valid} />
	</form>
</Loading>
