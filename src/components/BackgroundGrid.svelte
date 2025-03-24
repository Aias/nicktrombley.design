<script lang="ts">
	const {
		width,
		height,
		subdivisions = 4,
	}: { width: number; height: number; subdivisions?: number } = $props();

	// Create arrays for the gridlines
	const majorVerticals = Array.from({ length: width + 1 }, (_, i) => i);
	const majorHorizontals = Array.from({ length: height + 1 }, (_, i) => i);
	const minorVerticals = Array.from(
		{ length: width * subdivisions + 1 },
		(_, i) => i / subdivisions,
	);
	const minorHorizontals = Array.from(
		{ length: height * subdivisions + 1 },
		(_, i) => i / subdivisions,
	);

	const verticalPath = (x: number) => `M ${x} 0 L ${x} ${height}`;
	const horizontalPath = (y: number) => `M 0 ${y} L ${width} ${y}`;
</script>

<svg
	width="100%"
	height="100%"
	viewBox="0 0 {width} {height}"
	preserveAspectRatio="none"
	role="presentation"
	class="background-grid"
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
		display: block; /* Remove unwanted spacing */
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
