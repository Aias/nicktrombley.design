<script context="module">
	export async function preload({ params, query }) {
		const res = await this.fetch(`/writing/all.json`);
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

	// console.log(writing);
</script>

<article class="layout__all longform">
	<p>
		This is an incomplete list of some of the long-form writing I've done
		and presentations I've given over the years. For more bite-size samples,
		check out <a href="http://the-innocent-i.net/">the innocent i</a>.
	</p>
	<ul>
		{#each writing as {meta, slug}}
		<li>
			{#if meta.link}
			<a href="{meta.link}" target="_blank">{meta.title}</a>
			{:else}
			<a href="/writing/{slug}">{meta.title}</a>
			{/if} {#if meta.subtitle}
			<div>{meta.subtitle}</div>
			{/if}
		</li>
		{/each}
	</ul>
</article>

<style>
	li {
		margin: 0.5em auto;
	}
</style>
