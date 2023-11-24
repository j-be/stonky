<script lang="ts">
	import Selling from '$lib/components/forms/selling.svelte';

	export let data: { rsuId: number };

	let { rsuId } = data;
</script>

<Selling {rsuId} />
