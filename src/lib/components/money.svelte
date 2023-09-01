<script lang="ts">
	import FormattedNumber from './formattedNumber.svelte';
	import { exchangeRateStore, taxStore } from '$lib/stores';

	export let value: number;
	export let deductTax = true;

	let dollarToEuro: number | null = null;

	$: dollarToEuro = $exchangeRateStore;
</script>

{#if dollarToEuro}
	<FormattedNumber value={value * (deductTax ? 1 - $taxStore : 1) * dollarToEuro} unit="€" />
{:else}
	???
{/if}
<small class="muted">(<FormattedNumber {value} unit="$" />)</small>
