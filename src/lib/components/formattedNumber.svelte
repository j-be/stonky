<script lang="ts">
	import { formatNumber } from '$lib/utils';

	export let value: number;
	export let digits: number = 2;
	export let unit: string = '';

	$: formatted = `${formatNumber(value, digits)}${unit ? ' ' + unit : ''}`;
</script>

{formatted}
