<script lang="ts">
	export let loading: boolean;
</script>

{#if loading}
	<div aria-busy="true"></div>
{:else}
	<slot />
{/if}
