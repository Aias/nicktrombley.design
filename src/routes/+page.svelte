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

<div class="widgets-container">
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
	}
	.widget {
		position: absolute;
	}
	.widget :global(svg) {
		fill: transparent;
	}
</style>
