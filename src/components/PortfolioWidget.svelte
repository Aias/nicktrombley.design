<script lang="ts">
	import { onMount } from 'svelte';
	import { blur } from 'svelte/transition';
	import type { Widget } from '$types/portfolio';
	import { REMS_PER_CELL } from '$types/portfolio';

	const { widget, delay = 250 }: { widget: Widget; delay?: number } = $props();

	let svgContents: string | undefined = $state(undefined);

	onMount(async () => {
		const response = await fetch(`/widgets/${widget.id}.svg`);
		const svgText = await response.text();
		svgContents = svgText;
	});
</script>

{#if svgContents}
	<div
		class="node node--widget"
		class:large-only={widget.screens === 'large'}
		class:small-only={widget.screens === 'small'}
		style:--node-x-lg={`${widget.xLgCells * REMS_PER_CELL}rem`}
		style:--node-y-lg={`${widget.yLgCells * REMS_PER_CELL}rem`}
		style:--node-x-sm={`${widget.xSmCells * REMS_PER_CELL}rem`}
		style:--node-y-sm={`${widget.ySmCells * REMS_PER_CELL}rem`}
		style:--node-width={`${widget.widthCells * REMS_PER_CELL}rem`}
		style:--node-height={`${widget.heightCells * REMS_PER_CELL}rem`}
		in:blur={{ delay, duration: 2000 }}
	>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted SVG from own server -->
		{@html svgContents}
	</div>
{/if}
