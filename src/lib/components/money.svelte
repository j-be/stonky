<script lang="ts">
  import FormattedNumber from "./formattedNumber.svelte";

	import { DOLLAR_TO_EURO, TAX } from "$lib/constants";

	export let value: number;
	export let deductTax: boolean = true;
</script>
<FormattedNumber value={value * (deductTax ? TAX : 1) * DOLLAR_TO_EURO} unit="€" />
<small class="muted">(<FormattedNumber {value} unit="$" />)</small>
