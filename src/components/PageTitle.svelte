<script>
	import { slide } from 'svelte/transition';

	export let page = {
		url: undefined,
		label: '404',
		title: '404'
	};
</script>

<!-- TODO: There is something funky going on with the grid layout during an out: transition. I think it has to do with the grid gap remaining even though the element is absolutely positioned. -->
<h2 in:slide class="page-title layout__primary">
	{page.title}
</h2>

<style>
	.page-title {
		text-transform: lowercase;
		text-align: center;
		padding-bottom: 1rem;
		border-bottom: var(--border);
		overflow: hidden;
	}

	@media (max-width: 1064px) {
		.page-title {
			border-bottom: none;
			padding-bottom: 0;
			padding-top: 1rem;
		}
	}
</style>
