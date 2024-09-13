<script lang="ts">
	import { esppStore } from '$lib/stores';
	import StocksHeader from '$lib/components/stocks/stocksHeader.svelte';
	import Espp from '$lib/components/stocks/espp.svelte';

	let values = new Map<number, number>();

	const handleCurrentEsppValue = (id: number) => (currentValue: CustomEvent<{ value: number }>) => {
		values = new Map([...values, [id, currentValue.detail.value]]);
	};
</script>

{#each [$esppStore] as stocks}
	{#each stocks as stock, id}
		<details>
			<summary><StocksHeader {id} type={stock.type} count={stock.count} value={values.get(id) ?? NaN} /></summary>
			<Espp on:currentNet={handleCurrentEsppValue(id)} espp={stock} />
		</details>
	{/each}
{/each}
