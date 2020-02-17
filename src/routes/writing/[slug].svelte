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

<article class="layout__all longform" class:slides="{writing.meta.slides}">
	<header>
		<h2 class="doc-title">
			{writing.meta.title}
		</h2>
		{#if writing.meta.subtitle}
		<p class="subtitle">{writing.meta.subtitle}</p>
		{/if}
	</header>
	{@html writing.html}
</article>

<style>
	:global(.slides img) {
		margin: 2rem 0;
		border: var(--border);
	}
</style>
