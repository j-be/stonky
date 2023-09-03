<script lang="ts">
	import Espp from '$lib/components/forms/espp.svelte';
	import Rsu from '$lib/components/forms/rsu.svelte';
	import type { StockType } from '$lib/model';

	let stockType: StockType = 'espp';
</script>

<h1>Add</h1>

<fieldset>
	<legend>Type</legend>
	{#each ['espp', 'rsu'] as type}
		<label>
			<input type="radio" name="type" value={type} bind:group={stockType} />
			<span class="uppercase">{type}</span>
		</label>
	{/each}
</fieldset>

{#if stockType === 'rsu'}
	<Rsu />
{:else}
	<Espp />
{/if}
