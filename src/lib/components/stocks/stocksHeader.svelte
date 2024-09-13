<script lang="ts">
	import type { StockType } from '$lib/model';
	import Money from '../money.svelte';

	export let id: number | null = null;
	export let type: StockType;
	export let count: number | undefined;
	export let value: number;
</script>

<div class="title">
	{#if id !== null}
		<a href="/edit/{type}/{id}" class="icon edit">&#8288;</a>
	{:else}
		<a href="/edit/{type}" class="icon edit">&#8288;</a>
	{/if}
	<span>
		<span class="uppercase">{type}</span>
		{count}
	</span>
</div>
<div><Money {value} deductTax={type == 'rsu'} /></div>
