<script lang="ts">
	import { goto } from '$app/navigation';

	export let valid = true;
</script>

<div class="grid">
	<button class="secondary" on:click={() => goto('/', { replaceState: true })}>Cancel</button>
	<button type="submit" disabled={!valid}>Save</button>
</div>
