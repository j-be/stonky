<script lang="ts">
	import { formatNumber } from '$lib/utils';

	export let value: number;
	export let digits = 2;
	export let unit = '';

	$: formatted = `${formatNumber(value, digits)}${unit ? ' ' + unit : ''}`;
</script>

{formatted}
