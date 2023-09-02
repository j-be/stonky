<script lang="ts">
	export let loading: boolean;
</script>

{#if loading}
	<div aria-busy="true" />
{:else}
	<slot />
{/if}
