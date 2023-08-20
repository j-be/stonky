<script lang="ts">
	export let value: number;
	export let digits: number = 2;
	export let unit: string = '';

	$: formatted = `${value.toLocaleString(undefined, {
		minimumFractionDigits: digits,
		maximumFractionDigits: digits,
	})}${unit ? ' ' + unit : ''}`;
</script>
{formatted}
