<script lang="ts">
	import type { Duration, TemporalUnit } from '$lib/model';
	import { createEventDispatcher } from 'svelte';

	export let amount: number;
	export let unit: TemporalUnit;

	const dispatch = createEventDispatcher<{ change: Duration }>();

	const onChangeHandler = () => {
		dispatch('change', { amount, unit });
	};
</script>

<div class="vesting-period">
	<input type="number" bind:value={amount} min="1" on:change={onChangeHandler} />
	<select bind:value={unit} on:change={onChangeHandler}>
		{#each ['years', 'quarters', 'months'] as option (option)}
			<option value={option}>{option}</option>
		{/each}
	</select>
</div>
