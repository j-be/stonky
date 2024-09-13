<script lang="ts">
	import Disclaimer from '$lib/components/disclaimer.svelte';
	import Overview from '$lib/components/overview.svelte';
	import Espps from '$lib/components/stocks/espps.svelte';
	import Rsus from '$lib/components/stocks/rsus.svelte';
</script>

<Disclaimer />

<Overview />

<Espps />
<Rsus />

<a href="/add" role="button"><span class="icon add" />&nbsp;Add stocks</a>
