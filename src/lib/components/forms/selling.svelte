
<script lang="ts">
	import { insertOrUpdate, stocksStore } from '$lib/stores';
	import { onMount } from 'svelte';
	import Loading from '../loading.svelte';
	import ActionButtons from './actionButtons.svelte';
	import { format } from 'date-fns';

	export let rsuId: number;
	export let sellingId: number | null = null;

	let count = 0;
	let price = 0;
	let date = '';
	let loading = true;

	onMount(() => {
		if (rsuId === null || !$stocksStore.rsu.stocks[rsuId]) {
			console.log("Not found", rsuId, $stocksStore.rsu.stocks);
			loading = false;
			return;
		}

		const stock = $stocksStore.rsu.stocks[rsuId];
		if (sellingId !== null && stock.sellings[sellingId]) {
			({ count, price, date } = stock.sellings[sellingId]);
		} else {
			date = format(new Date(), 'yyyy-MM-dd');
		}

		loading = false;
	});

	const save = () => {
		if (!valid) {
			return;
		}

		stocksStore.update((current) => {
			const stock = {
				...current.rsu.stocks[rsuId],
				sellings: insertOrUpdate(
					current.rsu.stocks[rsuId].sellings ?? [],
					{ count, price, date },
					sellingId,
				),
			};

			return {
				...current,
				rsu: {
					...current.rsu,
					stocks: insertOrUpdate(current.rsu.stocks, stock, rsuId),
				},
			};
		});

		history.back();
	};

	$: valid =
		!!count &&
		!!price && price > 0 &&
		!!date;

</script>

<Loading {loading}>

	<form on:submit|preventDefault={save}>
		<label for="count">
			Number of shares
			<input id="count" type="number" bind:value={count} min="0" step="1" />
		</label>

		<label for="date">
			Date
			<input id="date" type="date" bind:value={date} />
		</label>

		<label for="price">
			Price [$]
			<input id="price" type="number" bind:value={price} min="0" step="0.0000000000000001" />
		</label>

		<ActionButtons {valid} />
	</form>
</Loading>
