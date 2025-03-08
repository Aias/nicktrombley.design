<script lang="ts">
	const links = [
		{ href: 'https://barnsworthburning.net/creators/rec97tRUYZBhAs6rZ', label: 'Portfolio' },
		{ href: 'https://github.com/Aias', label: 'Github' },
		{ href: 'https://www.linkedin.com/in/nick-trombley/', label: 'LinkedIn' },
		{ href: 'https://glass.photo/barnsworthburning', label: 'Photography' },
	];
</script>

<main>
	<div class="content">
		<section class="bio">
			<header class="header">
				<h1 class="name">Nicholas Trombley</h1>
				<p class="tagline">Digital designer-builder.</p>
			</header>
			<nav class="links">
				<ul>
					{#each links as link}
						<li><a href={link.href} target="_blank">{link.label}</a></li>
					{/each}
				</ul>
			</nav>
		</section>

		<section class="manifesto">
			<p class="line two"><em>Make things.</em></p>
			<p class="line four"><em>Not too many.</em></p>
			<p class="line six"><em>Mostly free.</em></p>
			<p class="line symbol one" aria-hidden="true" role="presentation">Grow things</p>
			<p class="line symbol three" aria-hidden="true" role="presentation">All you can</p>
			<p class="line symbol five" aria-hidden="true" role="presentation">Mostly trees</p>
		</section>
	</div>
</main>

<style>
	main {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.content {
		display: flex;
		justify-content: center;
		gap: 8rem;
		padding-block: 3rem;
		padding-inline: 3.5rem;
		border: 3px double var(--clr-border);
		border-style: double;
	}
	.bio {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 2rem;
		flex: 0 0 auto;
	}
	.bio .tagline {
		color: var(--clr-secondary);
	}
	.manifesto {
		text-align: center;
		display: flex;
		gap: calc(2em / 3);
		flex-direction: column;
		justify-content: center;
		flex: 0 0 auto;
	}

	@media (max-width: 720px) {
		main {
			text-align: center;
			padding-block-end: 2rem;
		}
		.content,
		.bio {
			display: contents;
		}
		.header,
		.links,
		.manifesto {
			text-align: inherit;
		}

		.header {
			margin-bottom: 4rem;
		}

		.links {
			position: fixed;
			inset-inline: 1rem;
			inset-block-end: 2rem;
		}
		.links ul {
			display: flex;
			justify-content: center;
			gap: 1rem;
		}
	}

	.line {
		margin: 0;
	}

	.symbol {
		color: var(--clr-secondary);
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
</style>
