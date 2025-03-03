<script lang="ts">
	import { formatNumber } from '$lib/utils';

	interface Props {
		value: number;
		digits?: number;
		unit?: string;
	}

	let { value, digits = 2, unit = '' }: Props = $props();
</script>

{#if isNaN(value)}
	???
{:else}
	{formatNumber(value, digits)}{unit ? ' ' + unit : ''}
{/if}
