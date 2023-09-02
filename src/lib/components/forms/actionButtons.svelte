<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let valid = true;
	export let secondaryButtonLabel: string;

	const dispatch = createEventDispatcher();
	const onSecondaryClickHandler = () => dispatch('secondaryClick');
</script>

<div class="grid">
	<button type="reset" class="secondary" on:click|preventDefault={onSecondaryClickHandler}>
		{secondaryButtonLabel}
	</button>
	<button type="submit" disabled={!valid}>Save</button>
</div>
