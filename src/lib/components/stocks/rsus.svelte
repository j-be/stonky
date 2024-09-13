<script lang="ts">
	import { stockPriceStore, rsuStore } from '$lib/stores';

	import Rsu from './rsu.svelte';
	import StocksHeader from './stocksHeader.svelte';

	let value = NaN;
	let stocks = [];

	$: stocks = $rsuStore;
	$: count = stocks.reduce((prev, current) => prev + current.count, 0);
	$: value = count * $stockPriceStore;
</script>

<details open>
	<summary><StocksHeader type="rsu" {count} {value} /></summary>
	<Rsu rsus={stocks} />
</details>
