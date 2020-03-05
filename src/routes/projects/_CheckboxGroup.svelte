<script>
	import { flip } from 'svelte/animate';
	// import { fade } from 'svelte/transition';
	import { quintInOut } from 'svelte/easing';

	export let group = {};
	export let onChange = (item, val) => console.log(item, val);
	export let title = '';

	$: filtered = group.filtered;
	$: sortedArr = groupObjToSortedArr(group.byKey);

	const groupObjToSortedArr = obj => {
		return Object.entries(obj).sort((a, b) => {
			return b[1].count - a[1].count;
		});
	};
</script>

<section>
	<h3>
		{title}
	</h3>
	<div class="fieldset" role="group">
		{#each sortedArr as item (item[0])}
		<label
			class:checked="{filtered.indexOf(item[0]) > -1}"
			animate:flip="{{duration: 750, easing: quintInOut}}"
		>
			<input
				type="checkbox"
				checked="{filtered.indexOf(item[0]) > -1}"
				on:change="{(e) => onChange(item[0], e.target.checked) }"
			/>
			{item[0]}
		</label>
		{/each}
	</div>
</section>

<style>
	/* Strangely, fieldset elements can't be styled as flex containers. See https://stackoverflow.com/questions/28078681/why-cant-fieldset-be-flex-containers for more information. */
	.fieldset {
		margin: 0.5rem 0;
		padding: 0;
		border: none;
	}

	section + section {
		margin-top: 1.5rem;
	}

	label {
		display: inline-block;
		padding: 0 0.5rem 0;
		height: 2rem;
		border: var(--border);
		/* Switch this declaration to "outline" to collapse borders. */
		margin-top: 2px;
		margin-left: 2px;
		transition: all 0.1s;
		white-space: nowrap;
	}

	label:hover {
		background-color: var(--clr-faint-2);
	}

	label.checked {
		background-color: var(--clr-theme-primary);
		color: var(--clr-text-inverted);
	}

	input {
		display: none;
	}
</style>
