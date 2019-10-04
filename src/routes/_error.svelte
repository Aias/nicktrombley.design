<script>
	export let status;
	export let error;

	const dev = process.env.NODE_ENV === 'development';
</script>

<svelte:head>
	<title>{status}</title>
</svelte:head>

<div class="layout__primary centered">
	<h1>{status}</h1>

	<p>{error.message}</p>

	{#if dev && error.stack}
	<pre>{error.stack}</pre>
	{/if}
</div>
