<script lang="ts">
	const links = [
		{ href: 'https://barnsworthburning.net/creators/rec97tRUYZBhAs6rZ', label: 'Garden' },
		{ href: 'https://github.com/Aias', label: 'Github' },
		{ href: 'https://www.linkedin.com/in/nick-trombley/', label: 'LinkedIn' },
		{ href: 'https://glass.photo/barnsworthburning', label: 'Glass' },
	];
</script>

<section class="manifesto">
	<p class="symbol" aria-hidden="true" role="presentation">Grow things</p>
	<p>Make things.</p>
	<p class="symbol" aria-hidden="true" role="presentation">All you can</p>
	<p>Not too many.</p>
	<p class="symbol" aria-hidden="true" role="presentation">Mostly trees</p>
	<p>Mostly free.</p>
</section>

<ul class="links">
	{#each links as link}
		<li><a href={link.href}>{link.label}</a></li>
	{/each}
</ul>

<style>
	.manifesto {
		text-align: center;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.links {
		position: fixed;
		inset-block-end: 2rem;
		inset-inline: 2rem;
		display: flex;
		gap: 1rem;
		justify-content: center;
	}
</style>
