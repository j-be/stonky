<script lang="ts">
	import type { Duration } from '$lib/model';
	import { insertOrUpdate, stocksStore } from '$lib/stores';
	import ActionButtons from './actionButtons.svelte';
	import { goto } from '$app/navigation';
	import VestingPeriod from './vestingPeriod.svelte';

	const defaultDuration: Duration = { amount: 1, unit: 'years' };

	export let id: number | null = null;

	let count = 0;
	let granted = '';
	let firstVestPercentage = 0;
	let firstVestDuration: Duration = { ...defaultDuration };
	let subsequentVestsPercentage = 0;
	let subsequentVestsDuration: Duration = { ...defaultDuration };

	let valid = false;

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
							percentage: firstVestPercentage,
							duration: firstVestDuration,
						},
						subsequentVests: {
							percentage: subsequentVestsPercentage,
							duration: subsequentVestsDuration,
						},
					},
					id,
				),
			},
		}));

		goto('/');
	};

	const reset = () => {
		count = 0;
		granted = '';
		firstVestPercentage = 0;
		firstVestDuration = { ...defaultDuration };
		subsequentVestsPercentage = 0;
		subsequentVestsDuration = { ...defaultDuration };
	};

	const firstVestDurationChanged = (event: CustomEvent<Duration>) => {
		firstVestDuration = event.detail;
	};

	const subsequentVestsDurationChanged = (event: CustomEvent<Duration>) => {
		subsequentVestsDuration = event.detail;
	};

	$: valid =
		!!count &&
		!!granted &&
		!!firstVestPercentage &&
		!!firstVestDuration.amount &&
		!!firstVestDuration.unit &&
		!!subsequentVestsDuration.amount &&
		!!subsequentVestsDuration.unit;
	$: id !== null &&
		$stocksStore.rsu.stocks[id] &&
		({
			count,
			granted,
			firstVest: { percentage: firstVestPercentage, duration: firstVestDuration },
			subsequentVests: { percentage: subsequentVestsPercentage, duration: subsequentVestsDuration },
		} = $stocksStore.rsu.stocks[id]);
</script>

<form on:submit|preventDefault={save}>
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
			<input type="number" bind:value={firstVestPercentage} min="0" step="0.0000000001" />
			<span>% after</span>
			<VestingPeriod {...firstVestDuration} on:change={firstVestDurationChanged} />
			<div />
		</div>
	</label>

	<label for="subsequentVests">
		Subsequent vests
		<div id="subsequentVests" class="vest-row">
			<input type="number" bind:value={subsequentVestsPercentage} min="0" step="0.0000000001" />
			<span>% every</span>
			<VestingPeriod {...subsequentVestsDuration} on:change={subsequentVestsDurationChanged} />
			<div />
		</div>
	</label>

	<ActionButtons {valid} secondaryButtonLabel="Reset" on:secondaryClick={reset} />
</form>
