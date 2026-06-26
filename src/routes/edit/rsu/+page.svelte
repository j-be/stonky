<script lang="ts">
	import { rsuStore } from '$lib/stores';
	import { isRsuFullyVested } from '$lib/utils';
</script>

{#each $rsuStore as stock, id}
	<article class:muted={isRsuFullyVested(stock)}>
		<a href="/edit/{stock.type}/{id}" class="icon edit">&#8288;</a>
		Count: {stock.count}, Granted: {stock.granted}
	</article>
{/each}
