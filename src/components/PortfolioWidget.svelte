<script lang="ts">
	import { onMount } from 'svelte';
	import { blur } from 'svelte/transition';
	import type { Widget } from '$types/portfolio';

	const { widget, delay = 250 }: { widget: Widget; delay?: number } = $props();

	let svgContents: string | undefined = $state(undefined);

	onMount(async () => {
		const response = await fetch(`/widgets/${widget.widget}.svg`);
		const svgText = await response.text();
		svgContents = svgText;
	});
</script>

{#if svgContents}
	<div
		class="widget"
		style:left={`${widget.x}rem`}
		style:top={`${widget.y}rem`}
		style:width={`${widget.width}rem`}
		style:height={`${widget.height}rem`}
		in:blur={{ delay, duration: 2000 }}
	>
		{@html svgContents}
	</div>
{/if}

<style>
	.widget {
		position: absolute;
		opacity: 0.75;
		transition: opacity 0.3s ease;

		&:hover {
			opacity: 1;
		}
	}
	.widget :global(svg) {
		fill: transparent;
		width: 100%;
		height: 100%;
	}
</style>
