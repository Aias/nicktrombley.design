<script lang="ts">
	const {
		widthCells,
		heightCells,
		subdivisions = 4,
		class: className,
	}: { widthCells: number; heightCells: number; subdivisions?: number; class?: string } = $props();

	// Create arrays for the gridlines
	const majorVerticals = Array.from({ length: widthCells + 1 }, (_, i) => i);
	const majorHorizontals = Array.from({ length: heightCells + 1 }, (_, i) => i);
	const minorVerticals = Array.from(
		{ length: widthCells * subdivisions + 1 },
		(_, i) => i / subdivisions,
	);
	const minorHorizontals = Array.from(
		{ length: heightCells * subdivisions + 1 },
		(_, i) => i / subdivisions,
	);

	const verticalPath = (x: number) => `M ${x} 0 L ${x} ${heightCells}`;
	const horizontalPath = (y: number) => `M 0 ${y} L ${widthCells} ${y}`;
</script>

<svg
	style:--node-width="100%"
	style:--node-height="100%"
	viewBox="0 0 {widthCells} {heightCells}"
	preserveAspectRatio="none"
	role="presentation"
	class="background-grid node {className}"
>
	<!-- Minor gridlines -->
	{#each minorVerticals as x}
		<path class="minor-gridline" d={verticalPath(x)} vector-effect="non-scaling-stroke" />
	{/each}

	{#each minorHorizontals as y}
		<path class="minor-gridline" d={horizontalPath(y)} vector-effect="non-scaling-stroke" />
	{/each}

	<!-- Major gridlines -->
	{#each majorVerticals as x}
		<path class="major-gridline" d={verticalPath(x)} vector-effect="non-scaling-stroke" />
	{/each}

	{#each majorHorizontals as y}
		<path class="major-gridline" d={horizontalPath(y)} vector-effect="non-scaling-stroke" />
	{/each}
</svg>

<style>
	svg {
		pointer-events: none; /* Allow clicking through */
	}

	path {
		stroke-width: 1px;
		fill: none;
	}

	.major-gridline {
		stroke: var(--major-gridline-color);
	}
	.minor-gridline {
		stroke: var(--minor-gridline-color);
	}
</style>
