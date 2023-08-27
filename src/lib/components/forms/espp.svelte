<script lang="ts">
	import type { EmployeeStockPurchase } from '$lib/model';
	import { addDays, addMonths, format } from 'date-fns';
	import ActionButtons from './actionButtons.svelte';
	import { goto } from '$app/navigation';

	let periodStart = '';
	let periodEnd = '';
	let count = 0;

	let valid = false;

	const handlePeriodStartChange = () => {
		if (periodEnd) {
			return;
		}
		periodEnd = format(addDays(addMonths(new Date(periodStart), 6), -1), 'yyyy-MM-dd');
	};

	const reset = () => {
		periodStart = '';
		periodEnd = '';
		count = 0;
	};

	const save = () => {
		if (!valid) {
			return;
		}

		const espps: EmployeeStockPurchase[] = JSON.parse(localStorage.getItem('espp') ?? '[]');
		espps.push({
			type: 'espp',
			count: count!,
			periodStart,
			periodEnd,
		});
		localStorage.setItem('espp', JSON.stringify(espps));

		goto('/');
	};

	$: valid = !!periodStart && !!periodEnd && !!count;
</script>

<form on:submit|preventDefault={save}>
	<label for="count">
		Number of shares
		<input id="count" type="number" bind:value={count} min="0" />
	</label>
	<div class="grid">
		<label for="periodStart">
			Start
			<input id="periodStart" type="date" bind:value={periodStart} on:change={handlePeriodStartChange} />
		</label>
		<label for="periodEnd">
			End
			<input id="periodEnd" type="date" bind:value={periodEnd} />
		</label>
	</div>

	<ActionButtons {valid} {reset} />
</form>
