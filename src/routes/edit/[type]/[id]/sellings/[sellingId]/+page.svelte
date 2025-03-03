<script lang="ts">
	import Selling from '$lib/components/forms/selling.svelte';

	interface Props {
		data: { rsuId: number; sellingId: number };
	}

	let { data }: Props = $props();

	let { rsuId, sellingId } = data;
</script>

<Selling {rsuId} {sellingId} />
