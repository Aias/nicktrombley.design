<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteMap } from 'svelte/reactivity';

	const { data } = $props();
	const { widgets } = data;

	const svgContents = new SvelteMap();

	onMount(async () => {
		for (const widget of widgets) {
			try {
				const response = await fetch(`/widgets/${widget.widget}.svg`);
				const svgText = await response.text();
				svgContents.set(widget.widget, svgText);
			} catch (error) {
				console.error(`Error loading SVG for ${widget.widget}:`, error);
			}
		}
	});

	const links = [
		{ href: 'https://barnsworthburning.net/creators/rec97tRUYZBhAs6rZ', label: 'Commonplace' },
		{ href: 'https://github.com/Aias', label: 'Github' },
		{ href: 'https://www.linkedin.com/in/nick-trombley/', label: 'LinkedIn' },
		{ href: 'https://glass.photo/barnsworthburning', label: 'Photography' },
	];
</script>

<div class="widgets-container grid-background">
	{#each widgets as widget}
		<div
			class="widget"
			style={`left: ${widget.x}px; top: ${widget.y}px; width: ${widget.width}px; height: ${widget.height}px;`}
		>
			{#if svgContents.has(widget.widget)}
				{@html svgContents.get(widget.widget)}
			{:else}
				<div class="loading-svg">Loading...</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	.widgets-container {
		position: relative;
		width: 2304px;
		height: 1536px;
	}
	.widget {
		position: absolute;
		opacity: 0.64;
		transition: opacity 0.3s ease;

		&:hover {
			opacity: 1;
		}
	}
	.widget :global(svg) {
		fill: transparent;
	}

	.grid-background {
		background-color: transparent;
		background-image:
    /* Larger gridlines every 32px with 33% opacity */
			linear-gradient(
				color-mix(in srgb, var(--widget-divider) 33%, transparent) 1px,
				transparent 1px
			),
			linear-gradient(
				90deg,
				color-mix(in srgb, var(--widget-divider) 33%, transparent) 1px,
				transparent 1px
			),
			/* Smaller gridlines every 8px with 33% opacity */
				linear-gradient(
					color-mix(in srgb, var(--widget-divider-subtle) 33%, transparent) 1px,
					transparent 1px
				),
			linear-gradient(
				90deg,
				color-mix(in srgb, var(--widget-divider-subtle) 33%, transparent) 1px,
				transparent 1px
			);

		background-size:
			32px 32px,
			/* Larger vertical and horizontal grid size */ 32px 32px,
			/* Larger vertical and horizontal grid size */ 8px 8px,
			/* Smaller vertical and horizontal grid size */ 8px 8px; /* Smaller vertical and horizontal grid size */

		background-position:
			0 0,
			/* Larger vertical gridlines position */ 0 0,
			/* Larger horizontal gridlines position */ 0 0,
			/* Smaller vertical gridlines position */ 0 0; /* Smaller horizontal gridlines position */
	}
</style>
