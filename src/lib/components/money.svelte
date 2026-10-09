<script lang="ts">
	import FormattedNumber from './formattedNumber.svelte';
	import { exchangeRateStore, taxStore } from '#lib/stores.js';

	interface Props {
		value: number;
		deductTax?: boolean;
		exchangeRate?: number | null;
	}

	let { value, deductTax = true, exchangeRate = null }: Props = $props();

	let dollarToEuro = $derived(exchangeRate ?? $exchangeRateStore);
</script>

{#if isNaN(dollarToEuro) || isNaN(value)}
	???
{:else}
	<FormattedNumber value={value * (deductTax ? 1 - $taxStore : 1) * dollarToEuro} unit="€" />
{/if}
{#if !isNaN(value)}
	<small class="muted">(<FormattedNumber {value} unit="$" />)</small>
{/if}
