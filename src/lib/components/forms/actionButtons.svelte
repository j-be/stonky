<script lang="ts">
	interface Props {
		valid?: boolean;
	}

	let { valid = true }: Props = $props();
</script>

<div class="action-buttons">
	<button type="button" class="secondary" onclick={() => history.back()}>Cancel</button>
	<button type="submit" disabled={!valid}>Save</button>
</div>
