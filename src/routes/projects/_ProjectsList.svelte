<script>
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import { quintInOut } from 'svelte/easing';

	export let projects = [];
</script>

<ol class="layout-main projects-container">
	{#each projects as {key, name, fields, roles, technologies, tags, starred,
	description, images, link} (key)}
	<li
		class="project inverted small"
		transition:fade="{{duration: 500, easing: quintInOut}}"
		animate:flip="{{duration: 750, easing: quintInOut}}"
	>
		<h3>{name}</h3>
		<p><em>I was...</em> {roles.join(', ')}</p>
		<p><em>I used...</em> {technologies.join(', ')}</p>
		<p><em>It was for...</em> {fields.join(', ')}</p>
		<p><em>It was about...</em> {tags.join(', ')}</p>
	</li>
	{/each}
</ol>

<style>
	.projects-container {
		margin-top: 1rem;
		grid-gap: 2px;
	}

	.project {
		grid-column: span 1;
		padding: 1rem;
	}

	.project > * + * {
		margin-top: 0.5em;
	}
</style>
