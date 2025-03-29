<script lang="ts">
	import { onMount } from 'svelte';
	import PortfolioWidget from '$components/PortfolioWidget.svelte';
	import BackgroundGrid from '$components/BackgroundGrid.svelte';
	import ProfileContent from '$components/ProfileContent.svelte';

	import { REMS_PER_CELL, type Widget } from '$types/portfolio';

	const { data } = $props();
	const { widgets } = data;

	let loaded = $state(false);

	const contentLargeWidthRems = $derived(
		Math.max(...widgets.map((w) => (w.xLgCells + w.widthCells) * REMS_PER_CELL)),
	);
	const contentLargeHeightRems = $derived(
		Math.max(...widgets.map((w) => (w.yLgCells + w.heightCells) * REMS_PER_CELL)),
	);

	const contentSmallWidthRems = $derived(
		Math.max(...widgets.map((w) => (w.xSmCells + w.widthCells) * REMS_PER_CELL)),
	);
	const contentSmallHeightRems = $derived(
		Math.max(...widgets.map((w) => (w.ySmCells + w.heightCells) * REMS_PER_CELL)),
	);

	let profileNode: HTMLElement;

	const profileNodeData: Widget = {
		id: 'profile-node',
		screens: 'all',
		xLgCells: 20,
		yLgCells: 18,
		xSmCells: 0,
		ySmCells: 0,
		width: 32 * 32,
		height: 11 * 32,
		widthCells: 32,
		heightCells: 11,
	};

	onMount(async () => {
		profileNode.scrollIntoView({
			behavior: 'instant',
			block: 'center',
			inline: 'center',
		});
		loaded = true;
	});
</script>

<main
	class="root"
	class:loaded
	style:--content-width-lg={`${contentLargeWidthRems}rem`}
	style:--content-height-lg={`${contentLargeHeightRems}rem`}
	style:--content-width-sm={`${contentSmallWidthRems}rem`}
	style:--content-height-sm={`${contentSmallHeightRems}rem`}
>
	<div class="layout-canvas">
		<div class="profile-container">
			<div
				bind:this={profileNode}
				class="profile-node"
				style:--node-x-lg={`${profileNodeData.xLgCells * REMS_PER_CELL}rem`}
				style:--node-y-lg={`${profileNodeData.yLgCells * REMS_PER_CELL}rem`}
				style:--node-width={`${profileNodeData.widthCells * REMS_PER_CELL}rem`}
				style:--node-height={`${profileNodeData.heightCells * REMS_PER_CELL}rem`}
			>
				<ProfileContent />
			</div>
		</div>
	</div>
	<div class="widgets-container-wrapper">
		<div class="layout-canvas">
			<div class="widgets-container">
				{#each widgets as widget, index (widget.id)}
					<PortfolioWidget {widget} delay={index * 75} />
				{/each}
			</div>
			<div class="background-container">
				<BackgroundGrid
					widthCells={contentLargeWidthRems / REMS_PER_CELL + 2}
					heightCells={contentLargeHeightRems / REMS_PER_CELL + 2}
					subdivisions={4}
					class="background-grid--large large-only"
				/>
				<BackgroundGrid
					widthCells={contentSmallWidthRems / REMS_PER_CELL + 2}
					heightCells={contentSmallHeightRems / REMS_PER_CELL + 2}
					subdivisions={3}
					class="background-grid--small small-only"
				/>
			</div>
		</div>
	</div>
</main>
