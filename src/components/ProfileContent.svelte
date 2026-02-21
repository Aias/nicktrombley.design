<script lang="ts">
	import Camera from '$components/icons/Camera.svelte';
	import Github from '$components/icons/Github.svelte';
	import LinkedIn from '$components/icons/LinkedIn.svelte';
	import Archive from '$components/icons/Archive.svelte';
	import ThemeToggle from '$components/ThemeToggle.svelte';

	const links = [
		{
			href: 'https://barnsworthburning.net/creators/rec97tRUYZBhAs6rZ',
			label: 'Commonplace',
			icon: Archive
		},
		{ href: 'https://github.com/Aias', label: 'Github', icon: Github },
		{ href: 'https://www.linkedin.com/in/nick-trombley/', label: 'LinkedIn', icon: LinkedIn },
		{ href: 'https://glass.photo/barnsworthburning', label: 'Photography', icon: Camera }
	];
</script>

<div class="profile">
	<section class="info">
		<header class="header">
			<h1>Nicholas Trombley</h1>
			<p class="secondary">
				<em>Digital designer-builder.</em>
			</p>
		</header>
		<nav class="site-nav">
			<ul class="external-links">
				{#each links as link (link.href)}
					{@const IconComponent = link.icon}
					<li>
						<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external link -->
						<a class="link" href={link.href} target="_blank" rel="noopener noreferrer">
							<IconComponent />
							<span class="label">{link.label}</span>
						</a>
					</li>
				{/each}
			</ul>
		</nav>
		<ThemeToggle />
	</section>
	<section class="personal-statement">
		<p>
			<strong>
				Craft-driven creator of digital tools with a mind for information design, knowledge
				management, and systems thinking.
			</strong>
		</p>
		<p>
			Over a decade of experience building useful software at all scales, from enterprise-grade
			solutions to bespoke artifacts of the small, personal web. Currently at <a
				href="https://withremark.com"
				target="_blank"
				rel="noopener noreferrer">Remark</a
			>.
		</p>
	</section>
</div>

<style>
	.profile {
		background-color: var(--widget-container);
		border: 3px double var(--widget-border);
		padding: 2.5rem 3.5rem;
		font-size: 1.25em;
		display: flex;
		align-items: stretch;
		justify-content: center;
		gap: 2rem;
		z-index: 1;
		overflow: hidden;
		width: 100%;
		height: 100%;
		position: relative;
	}

	.info {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		gap: 1em;

		& :global(.theme-toggle) {
			position: absolute;
			inset-inline-end: 1rem;
			inset-block-end: 1rem;
		}
	}

	.personal-statement {
		flex: 0 0 25rem;
		text-align: justify;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 1em;
	}

	.site-nav {
		container-type: inline-size;
		container-name: nav;
	}

	@container root (width <= 64rem) {
		/* TODO: Change this to fixed, currently broken in Safari. 
		   https://frontendmasters.com/blog/containers-context/ */
		/* .info :global(.theme-toggle) {
			position: fixed;
			font-size: 1.75rem;
		} */

		@container profile (width <= 58rem) {
			.profile {
				display: grid;
				grid-template-areas:
					'header'
					'statement'
					'nav';
				gap: 1.5rem;
				text-align: center;
				border-inline: none;
				border-block-start: none;
				padding-inline: 2rem;
			}

			.info {
				display: contents;
			}

			.header {
				grid-area: header;
			}

			.personal-statement {
				grid-area: statement;
				justify-content: flex-start;
				gap: 0.75rem;
				text-align: center;
				text-wrap: balance;
			}

			.site-nav {
				grid-area: nav;
				flex-direction: row;

				.external-links {
					display: flex;
					flex-wrap: wrap;
					flex-direction: row;
					justify-content: center;
					column-gap: 1.5rem;
				}
			}

			@container nav (width <= 40rem) {
				li:last-child {
					display: none;
				}
			}
		}
	}
</style>
