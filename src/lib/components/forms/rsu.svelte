<script lang="ts">
	import type { Duration } from '$lib/model';
	import { insertOrUpdate, rsuStore } from '$lib/stores';
	import { onMount } from 'svelte';
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

	onMount(() => {
		if (id === null) {
			return;
		}
		rsuStore.subscribe((rsus) => {
			({
				count,
				granted,
				firstVest: { percentage: firstVestPercentage, duration: firstVestDuration },
				subsequentVests: { percentage: subsequentVestsPercentage, duration: subsequentVestsDuration },
			} = rsus[id!]);
		});
	});

	const save = () => {
		if (!valid) {
			return;
		}

		rsuStore.update((current) =>
			insertOrUpdate(
				current,
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
		);

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

	<h4>First vest</h4>
	<label for="firstVestPercentage">
		Percentage
		<input id="firstVestPercentage" type="number" bind:value={firstVestPercentage} min="0" step="0.0000000001" />
	</label>
	<VestingPeriod {...firstVestDuration} on:change={firstVestDurationChanged} />

	<h4>Subsequent vests</h4>
	<label for="firstVestPercentage">
		Percentage
		<input
			id="subsequentVestsPercentage"
			type="number"
			bind:value={subsequentVestsPercentage}
			min="0"
			step="0.0000000001"
		/>
	</label>
	<VestingPeriod {...subsequentVestsDuration} on:change={subsequentVestsDurationChanged} />

	<ActionButtons {valid} {reset} />
</form>
