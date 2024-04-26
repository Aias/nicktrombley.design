<script>
	export let status;
	export let error;

	const dev = process.env.NODE_ENV === 'development';
</script>

<svelte:head>
	<title>{status}</title>
</svelte:head>

{#if error}
<div class="layout__all">
	<h2>{status}</h2>

	<p>{error.message}</p>

	{#if dev && error.stack}
	<pre>{error.stack}</pre>
	{/if}
</div>
{/if}
