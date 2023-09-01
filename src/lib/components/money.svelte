<script lang="ts">
	import FormattedNumber from './formattedNumber.svelte';

	import { TAX } from '$lib/constants';
	import { exchangeRateStore } from '$lib/stores';

	export let value: number;
	export let deductTax = true;

	let dollarToEuro: number | null = null;

	$: dollarToEuro = $exchangeRateStore;
</script>

{#if dollarToEuro}
	<FormattedNumber value={value * (deductTax ? 1 - TAX : 1) * dollarToEuro} unit="€" />
{:else}
	???
{/if}
<small class="muted">(<FormattedNumber {value} unit="$" />)</small>
