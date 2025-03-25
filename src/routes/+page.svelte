<script lang="ts">
	import { onMount } from 'svelte';
	import PortfolioWidget from '$components/PortfolioWidget.svelte';
	import BackgroundGrid from '$components/BackgroundGrid.svelte';
	import Camera from '$components/icons/Camera.svelte';
	import Github from '$components/icons/Github.svelte';
	import LinkedIn from '$components/icons/LinkedIn.svelte';
	import Archive from '$components/icons/Archive.svelte';
	import Moon from '$components/icons/Moon.svelte';
	import Sun from '$components/icons/Sun.svelte';

	const { data } = $props();
	const { widgets } = data;

	let loaded = $state(false);

	const contentWidthRems = $derived(Math.max(...widgets.map((w) => w.x + w.width)));
	const contentHeightRems = $derived(Math.max(...widgets.map((w) => w.y + w.height)));

	let profileNode: HTMLElement;

	onMount(async () => {
		profileNode.scrollIntoView({
			behavior: 'instant',
			block: 'center',
			inline: 'center',
		});
		loaded = true;
	});

	function handleThemeChange() {
		const htmlNode = document.documentElement;
		let theme: 'light' | 'dark';

		if (htmlNode.classList.contains('light')) {
			htmlNode.classList.remove('light');
			htmlNode.classList.add('dark');
			theme = 'dark';
		} else if (htmlNode.classList.contains('dark')) {
			htmlNode.classList.remove('dark');
			htmlNode.classList.add('light');
			theme = 'light';
		} else {
			const userPreference = window.matchMedia('(prefers-color-scheme: dark)').matches
				? 'light'
				: 'dark';
			htmlNode.classList.add(userPreference);
			theme = userPreference;
		}

		// Set the theme cookie with a long expiration (1 year)
		document.cookie = `theme=${theme};path=/;max-age=31536000;SameSite=Lax`;
	}

	const links = [
		{
			href: 'https://barnsworthburning.net/creators/rec97tRUYZBhAs6rZ',
			label: 'Commonplace',
			icon: Archive,
		},
		{ href: 'https://github.com/Aias', label: 'Github', icon: Github },
		{ href: 'https://www.linkedin.com/in/nick-trombley/', label: 'LinkedIn', icon: LinkedIn },
		{ href: 'https://glass.photo/barnsworthburning', label: 'Photography', icon: Camera },
	];
</script>

<main class="root" class:loaded>
	<div
		class="widgets-background"
		style={`--content-width: ${contentWidthRems}rem; --content-height: ${contentHeightRems}rem;`}
	>
		<BackgroundGrid
			width={contentWidthRems / 2 + 2}
			height={contentHeightRems / 2 + 2}
			subdivisions={4}
		/>
		<div class="widgets-container">
			<div
				class="profile-node"
				bind:this={profileNode}
				style:left="40rem"
				style:top="36rem"
				style:width="64rem"
				style:height="22rem"
			>
				<section class="info">
					<header>
						<h1>Nicholas Trombley</h1>
						<p class="secondary">
							<em>Digital designer-builder.</em>
						</p>
					</header>
					<nav class="site-nav">
						<ul class="external-links">
							{#each links as link}
								{@const IconComponent = link.icon}
								<li>
									<a class="link" href={link.href} target="_blank">
										<IconComponent />
										{link.label}
									</a>
								</li>
							{/each}
						</ul>
					</nav>
					<button
						type="button"
						aria-label="Toggle theme"
						title="Toggle theme"
						class="theme-toggle"
						onclick={handleThemeChange}><Moon /><Sun /></button
					>
				</section>
				<section class="personal-statement">
					<p>
						<strong>
							Craft-driven creator of digital tools with a mind for information design, knowledge
							management, and systems thinking.
						</strong>
					</p>
					<p>
						Over a decade of experience building useful software at all scales, from
						enterprise-grade solutions to bespoke artifacts of the small, personal web.
					</p>
				</section>
			</div>
			{#each widgets as widget, index (widget.widget)}
				<PortfolioWidget {widget} delay={index * 100} />
			{/each}
		</div>
	</div>
</main>

<style>
	.root {
		display: flex;
		flex-direction: column;
		position: fixed;
		inset: 0;
		overflow: auto;

		transition: opacity 1s ease-in-out;
		opacity: 0;

		&.loaded {
			opacity: 1;
		}
	}
	.widgets-background {
		position: relative;
		padding: 2rem;
		width: calc(var(--content-width, 144rem) + 4rem);
		height: calc(var(--content-height, 96rem) + 4rem);

		& > :global(.background-grid) {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
	}
	.widgets-container {
		position: relative;
		width: var(--content-width, 144rem);
		height: var(--content-height, 96rem);
	}
	.profile-node {
		position: absolute;
		background-color: var(--widget-container);
		border: 3px double var(--widget-border);
		padding: 3.5rem 4rem;
		font-size: 1.25em;
		display: flex;
		align-items: stretch;
		justify-content: center;
		gap: 1rem;
	}
	.theme-toggle {
		transition: background-color 0.15s ease-in-out;
		position: absolute;
		inset-inline-end: 0.5em;
		inset-block-end: 0.5em;
		background-color: var(--widget-tint);
		border: 1px solid var(--widget-border);
		border-radius: 0.125em;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5em;
		padding: 0.25em;
		cursor: pointer;
		&:hover {
			background-color: var(--widget-tone);
		}
	}
	.info {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 1em;
	}
	.link {
		display: inline-flex;
		align-items: center;
		gap: 0.33em;
	}
	.personal-statement {
		flex: 0 0 25rem;
		text-align: justify;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 1em;
	}
</style>
