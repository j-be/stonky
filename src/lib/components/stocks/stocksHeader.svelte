<script lang="ts">
	import type { StockType } from '$lib/model';
	import Money from '../money.svelte';

	export let id: number;
	export let type: StockType;
	export let count: number;
	export let value: number;
</script>

<div class="title">
	<a href="/edit/{type}/{id}" class="icon edit">&#8288;</a>
	<span>
		<span class="uppercase">{type}</span>
		{count}
	</span>
</div>
<div><Money {value} deductTax={type == 'rsu'} /></div>
