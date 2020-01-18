<script context="module">
	export async function preload({ params, query }) {
		const res = await this.fetch(`/writing/${params.slug}.json`);
		const data = await res.json();

		if (res.status === 200) {
			return { writing: data };
		} else {
			this.error(res.status, data.message);
		}
	}
</script>

<script>
	export let writing;
</script>

<article class="layout__all longform">
	<h2 class="doc-title">
		{writing.meta.title}
	</h2>
	{#if writing.meta.subtitle}
	<p class="subtitle">{writing.meta.subtitle}</p>
	{/if} {@html writing.html}
</article>

<style>
	.longform {
		max-width: 700px;
		margin: 0 auto;
	}

	.doc-title {
		margin-top: 0.5rem;
	}

	.intro {
		font-style: italic;
	}
</style>
