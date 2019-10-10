<script>
	export let list = [];
</script>

<span class="word"
	><dfn class="term"><slot></slot></dfn>
	<ul class="alternates">
		{#each list as alternate}
		<li class="alternate">{alternate}</li>
		{/each}
	</ul></span
>

<style>
	.word {
		position: relative;
	}

	.term {
		font-weight: inherit;
		font-style: inherit;
		display: inline;
		text-decoration: underline dotted;
	}

	.alternates {
		position: absolute;
		display: inline;
		white-space: nowrap;
		overflow: hidden;
		bottom: calc(100% + 0.25em);
		left: 0;
		opacity: 0;
		transition: all 0.2s;
		font-size: var(--font-size-smaller);
		border-radius: 2px;
		border: 1px solid currentColor;
	}

	.word:hover > .alternates,
	.word:active > .alternates {
		display: block;
		opacity: 1;
	}

	.alternate {
		background-color: var(--clr-bg);
		padding: 0.25em 0.5em;
	}
</style>
