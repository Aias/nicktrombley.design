<script lang="ts">
	const links = [
		{ href: 'https://barnsworthburning.net/creators/rec97tRUYZBhAs6rZ', label: 'Portfolio' },
		{ href: 'https://github.com/Aias', label: 'Github' },
		{ href: 'https://www.linkedin.com/in/nick-trombley/', label: 'LinkedIn' },
		{ href: 'https://glass.photo/barnsworthburning', label: 'Photography' },
	];
</script>

<main>
	<p class="trees" aria-hidden="true" role="presentation">Hello</p>
	<div class="content">
		<section class="bio">
			<header class="header">
				<h1 class="name">Nicholas Trombley</h1>
				<p class="tagline"><em>Digital designer-builder.</em></p>
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
			<p>
				<strong>
					Craft-oriented creator of digital tools with an eye towards simplicity, fine detail, and
					information density.</strong
				>
			</p>
			<p>
				Over a decade of experience building useful software at all scales, from complex enterprise
				solutions to bespoke artifacts of the small, personal web.
			</p>
		</section>
	</div>
	<p class="trees secondary" aria-hidden="true" role="presentation">Goodbye</p>
</main>

<style>
	main {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 0.25rem;
	}
	.content {
		display: flex;
		justify-content: center;
		gap: 6rem;
		padding-block: 3rem;
		padding-inline: 3.5rem;
		border: 3px double var(--clr-border);
		border-style: double;
	}
	.bio {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 1rem;
		flex: 0 0 auto;
	}
	.bio .tagline {
		color: var(--clr-secondary);
	}
	.manifesto {
		display: flex;
		gap: calc(2em / 3);
		flex-direction: column;
		justify-content: center;
		flex: 0 0 auto;
		max-width: 36ch;
		text-align: justify;
		text-align-last: left;
		text-wrap: pretty;
	}

	.trees {
		color: var(--clr-secondary);
	}

	@media (max-width: 820px) {
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
</style>
