<script lang="ts">
	import { rsuStore } from '$lib/stores';
	import ActionButtons from './actionButtons.svelte';
	import { goto } from '$app/navigation';

	let count = 0;
	let granted = '';
	let firstVestPercentage = 0;
	let firstVestAfterMonths = 0;
	let subsequentVestsPercentage = 0;
	let subsequentVestsAfterMonths = 0;

	let valid = false;

	const save = () => {
		if (!valid) {
			return;
		}

		rsuStore.update((current) => [
			...current,
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
		]);

		goto('/');
	};

	const reset = () => {
		count = 0;
		granted = '';
		firstVestPercentage = 0;
		firstVestAfterMonths = 0;
		subsequentVestsPercentage = 0;
		subsequentVestsAfterMonths = 0;
	};

	$: valid =
		!!count &&
		!!granted &&
		!!firstVestAfterMonths &&
		!!firstVestAfterMonths &&
		!!subsequentVestsAfterMonths &&
		!!subsequentVestsPercentage;
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
	<label for="firstVestMonths">
		Number of months
		<input id="firstVestAfterMonths" type="number" bind:value={firstVestAfterMonths} min="0" />
	</label>

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
	<label for="firstVestMonths">
		Number of month
		<input id="subsequentVestsAfterMonths" type="number" bind:value={subsequentVestsAfterMonths} min="0" />
	</label>

	<ActionButtons {valid} {reset} />
</form>
