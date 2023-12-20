<script lang="ts">
	import Selling from '$lib/components/forms/selling.svelte';

	export let data: { rsuId: number; sellingId: number };

	let { rsuId, sellingId } = data;
</script>

<Selling {rsuId} {sellingId} />
