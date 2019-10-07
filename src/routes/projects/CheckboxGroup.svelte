<script>
	export let items = [];
	export let onChange = (item, val) => console.log(item, val);
	export let title = '';
</script>

<section>
	<h4>
		{title}
	</h4>
	<div class="fieldset" role="group">
		{#each items as item}
		<label class:checked="{item[1].checked}">
			<input
				type="checkbox"
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
