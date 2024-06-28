<script lang="ts">
	import { esppStore, rsuStore } from '$lib/stores';
	import Stocks from '$lib/components/stocks.svelte';
	import Disclaimer from '$lib/components/disclaimer.svelte';
	import Overview from '$lib/components/overview.svelte';
</script>

<Disclaimer />

<Overview />

{#each [$esppStore, $rsuStore] as stocks}
	{#each stocks as stock, id}
		<Stocks {id} {stock} />
	{/each}
{/each}

<a href="/add" role="button"><span class="icon add" />&nbsp;Add stocks</a>
