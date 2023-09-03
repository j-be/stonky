<script lang="ts">
	import type { StockType } from '$lib/model';
	import Espp from '$lib/components/forms/espp.svelte';
	import Rsu from '$lib/components/forms/rsu.svelte';
	import { stocksStore } from '$lib/stores';

	export let data: { id: number; type: StockType };

	let { id, type } = data;

	const handleDelete = () => {
		stocksStore.update((current) => ({
			...current,
			[type]: {
				...current[type],
				stocks: [...current[type].stocks.slice(0, id), ...current[type].stocks.slice(id + 1)],
			},
		}));

		history.back();
	};
</script>

{#if type === 'rsu'}
	<Rsu {id} />
{:else}
	<Espp {id} />
{/if}

<details class="danger-zone">
	<summary>Danger zone</summary>
	<div class="entry">
		<div>
			<div>Deletion cannot be undone!</div>
			<div>
				<small class="muted"
					>There will be no "are you sure", no undo, no safety net. Once that button is clicked, it's gone.</small
				>
			</div>
		</div>
		<div>
			<button on:click={handleDelete}>Delete</button>
		</div>
	</div>
</details>
