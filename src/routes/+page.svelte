<script lang="ts">
	import { rsuStore } from '$lib/stores';
	import Stocks from '$lib/components/stocks.svelte';
	import Disclaimer from '$lib/components/disclaimer.svelte';
	import Overview from '$lib/components/overview.svelte';
	import Espps from '$lib/components/stocks/espps.svelte';
</script>

<Disclaimer />

<Overview />

<Espps />

{#each [$rsuStore] as stocks}
	{#each stocks as stock, id}
		<Stocks {id} {stock} />
	{/each}
{/each}

<a href="/add" role="button"><span class="icon add" />&nbsp;Add stocks</a>
