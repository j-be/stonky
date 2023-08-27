<script lang="ts">
  import FormattedNumber from "./formattedNumber.svelte";

	import { TAX } from "$lib/constants";
	import { fetchForNow} from "$lib/yfinance-api";
	import { onMount } from "svelte";

	export let value: number;
	export let deductTax: boolean = true;

	let dollarToEuro = 0;

	onMount(async () => {
		dollarToEuro = await fetchForNow('EUR=X');
	})

</script>
<FormattedNumber value={value * (deductTax ? (1 - TAX) : 1) * dollarToEuro} unit="€" />
<small class="muted">(<FormattedNumber {value} unit="$" />)</small>
