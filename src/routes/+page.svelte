<script lang="ts">
	const links = [
		{ href: 'https://barnsworthburning.net/creators/rec97tRUYZBhAs6rZ', label: 'Garden' },
		{ href: 'https://github.com/Aias', label: 'Github' },
		{ href: 'https://www.linkedin.com/in/nick-trombley/', label: 'LinkedIn' },
		{ href: 'https://glass.photo/barnsworthburning', label: 'Glass' },
	];
</script>

<section class="manifesto">
	<p class="line two">Make things.</p>
	<p class="line four">Not too many.</p>
	<p class="line six">Mostly free.</p>
	<p class="line symbol one" aria-hidden="true" role="presentation">Grow things</p>
	<p class="line symbol three" aria-hidden="true" role="presentation">All you can</p>
	<p class="line symbol five" aria-hidden="true" role="presentation">Mostly trees</p>
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
		gap: var(--flow, 1em);
		flex-direction: column;
		justify-content: center;
	}

	.line {
		margin: 0;
	}

	.one {
		order: 1;
	}
	.two {
		order: 2;
	}
	.three {
		order: 3;
	}
	.four {
		order: 4;
	}
	.five {
		order: 5;
	}
	.six {
		order: 6;
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
