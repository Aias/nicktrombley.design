<script>
	import PageTitle from '../components/PageTitle.svelte';
</script>

<PageTitle>Contact</PageTitle>

<article class="layout__all">
	<iframe
		title="Contact form via Airtable"
		class="airtable-embed airtable-dynamic-height"
		src="https://airtable.com/embed/shrJoAnWxZHyd33nA"
		height="1681"
	></iframe>
	<script src="https://static.airtable.com/js/embed/embed_snippet_v1.js"></script>
</article>

<style>
	iframe {
		width: 100%;
		background: transparent;
		border: 1px solid rgba(0, 0, 0, 0.15);
	}
</style>
