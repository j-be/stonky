<script lang="ts">
	import type { StockType } from '$lib/model';
	import Espp from '$lib/components/forms/espp.svelte';
	import Rsu from '$lib/components/forms/rsu.svelte';

	export let data: { id: number; type: StockType };

	let { id, type } = data;
</script>

<h1>Edit {data.type} {data.id}</h1>

{#if type === 'rsu'}
	<Rsu {id} />
{:else}
	<Espp {id} />
{/if}
