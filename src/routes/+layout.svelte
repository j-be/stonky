<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../app.scss';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();
</script>

<nav>
	<div class="container">
		<h1>Stonky&nbsp;&#129297;</h1>
	</div>
</nav>
<main class="container">
	{@render children?.()}
</main>
<footer>
	<div class="container">
		Juri Berlanda<br />
		Erlaaer Stra&szlig;e 53 / 1 / 1, 1230 Wien
	</div>
</footer>
