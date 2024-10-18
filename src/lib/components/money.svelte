<script lang="ts">
	import FormattedNumber from './formattedNumber.svelte';
	import { exchangeRateStore, taxStore } from '$lib/stores';

	export let value: number;
	export let deductTax = true;
	export let exchangeRate: number | null = null;

	$: dollarToEuro = exchangeRate ?? $exchangeRateStore;
</script>

{#if isNaN(dollarToEuro) || isNaN(value)}
	???
{:else}
	<FormattedNumber value={value * (deductTax ? 1 - $taxStore : 1) * dollarToEuro} unit="€" />
{/if}
{#if !isNaN(value)}
	<small class="muted">(<FormattedNumber {value} unit="$" />)</small>
{/if}
