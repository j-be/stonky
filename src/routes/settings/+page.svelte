<script lang="ts">
	import ActionButtons from '$lib/components/forms/actionButtons.svelte';
	import { settingsStore } from '$lib/stores';
	import { onMount } from 'svelte';
	import Loading from '$lib/components/loading.svelte';

	let incomeTaxPercents: number = $state(0);
	let loading = $state(true);

	const save = () => {
		if (incomeTaxPercents) {
			settingsStore.update((current) => ({ ...current, incomeTax: incomeTaxPercents / 100 }));
		}
		history.back();
	};

	onMount(() => {
		incomeTaxPercents = $settingsStore.incomeTax * 100;
		loading = false;
	});

	let valid = $derived(incomeTaxPercents !== null);
</script>

<Loading {loading}>
	<form onsubmit={save}>
		<label for="income_tax">
			Income tax [%]
			<input id="income_tax" type="number" bind:value={incomeTaxPercents} min="0" max="100" step="0.1" />
			<small>
				For ausrian tariff levels see
				<a href="https://www.usp.gv.at/en/steuern-finanzen/einkommensteuer/tarifstufen.html" target="_blank"> here </a>
			</small>
		</label>
		<ActionButtons {valid} />
	</form>
</Loading>
