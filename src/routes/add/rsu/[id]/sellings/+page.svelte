<script lang="ts">
	import Selling from '$lib/components/forms/selling.svelte';

	interface Props {
		data: { rsuId: number };
	}

	let { data }: Props = $props();

	let { rsuId } = data;
</script>

<Selling {rsuId} />
