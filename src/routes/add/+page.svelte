<script lang="ts">
	import Espp from '$lib/components/forms/espp.svelte';
	import Rsu from '$lib/components/forms/rsu.svelte';
	import type { StockType } from '$lib/model';

	let stockType: StockType = $state('espp');
</script>

<fieldset>
	<legend>Type</legend>
	{#each ['espp', 'rsu'] as type (type)}
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
