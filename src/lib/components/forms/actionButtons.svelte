<script lang="ts">
	export let valid = true;
</script>

<div class="action-buttons">
	<button type="button" class="secondary" on:click={() => history.back()}>Cancel</button>
	<button type="submit" disabled={!valid}>Save</button>
</div>
