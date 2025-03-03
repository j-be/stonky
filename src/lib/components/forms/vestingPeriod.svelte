<script lang="ts">
	import type { Duration, TemporalUnit } from '$lib/model';
	import { createEventDispatcher } from 'svelte';

	interface Props {
		amount: number;
		unit: TemporalUnit;
	}

	let { amount = $bindable(), unit = $bindable() }: Props = $props();

	const dispatch = createEventDispatcher<{ change: Duration }>();

	const onChangeHandler = () => {
		dispatch('change', { amount, unit });
	};
</script>

<div class="vesting-period">
	<input type="number" bind:value={amount} min="1" onchange={onChangeHandler} />
	<select bind:value={unit} onchange={onChangeHandler}>
		{#each ['years', 'quarters', 'months'] as option (option)}
			<option value={option}>{option}</option>
		{/each}
	</select>
</div>
