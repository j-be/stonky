<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		loading: boolean;
		children: Snippet;
	}

	let { loading, children }: Props = $props();
</script>

{#if loading}
	<div aria-busy="true"></div>
{:else}
	{@render children?.()}
{/if}
