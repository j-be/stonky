<script lang="ts">
	import { rsuStore } from '$lib/stores';
</script>

{#each $rsuStore as stock, id}
	<article>
		<a href="/edit/{stock.type}/{id}" class="icon edit">&#8288;</a>
		Count: {stock.count}, Granted: {stock.granted}
	</article>
{/each}
