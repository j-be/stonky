<script lang="ts">
	export let valid = true;
	export let reset: () => void;
</script>

<div class="grid">
	<button type="reset" class="secondary" on:click|preventDefault={reset}>Reset</button>
	<button type="submit" disabled={!valid}>Save</button>
</div>
