<script>
	import { slide } from 'svelte/transition';

	export let page = {
		url: undefined,
		label: '404',
		title: '404',
		subnav: undefined
	};
</script>

<!-- TODO: There is something funky going on with the grid layout during an out: transition. I think it has to do with the grid gap remaining even though the element is absolutely positioned. -->
<h1 in:slide|global class="page-title layout__primary">
	{page.title}
</h1>

{#if page.subnav}
<div in:slide|global class="page-subnav layout__secondary">
	<label for="subnav">Jump to:</label>
	<ul id="subnav" class="subnav-links">
		{#each page.subnav as {section, label}}
		<li>
			<a class="button" href="/{page.url}#{section}">{label}</a>
		</li>
		{/each}
	</ul>
</div>
{/if}

<style>
	.page-title {
		text-transform: lowercase;
		text-align: center;
		padding-bottom: 1rem;
		border-bottom: var(--border);
		overflow: hidden;
	}

	.page-subnav {
		justify-self: center;
		text-align: center;
	}

	label,
	ul {
		margin: 0 2px;
	}

	.subnav-links {
		display: inline-flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.subnav-links > li {
		margin: 1px;
	}

	a::before {
		content: '# ';
		opacity: 0.65;
		transition: all 0.2s;
	}

	a:hover::before {
		opacity: 1;
	}

	@media (max-width: 1064px) {
		.page-title {
			border-bottom: none;
			padding-bottom: 0;
			padding-top: 1rem;
		}
	}
</style>
