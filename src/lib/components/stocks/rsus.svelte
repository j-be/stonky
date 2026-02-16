<script lang="ts">
	import { stockPriceStore, rsuStore } from '$lib/stores';

	import Rsu from './rsu.svelte';
	import StocksHeader from './stocksHeader.svelte';

	let count = $derived($rsuStore.reduce((prev, current) => prev + current.count, 0));
	let value = $derived(count * $stockPriceStore);
</script>

<details open>
	<summary><StocksHeader type="rsu" {count} {value} /></summary>
	<Rsu rsus={$rsuStore} />
</details>
