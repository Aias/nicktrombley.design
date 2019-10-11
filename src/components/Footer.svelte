<script>
	import Github from './icons/Github.svelte';
	import LinkedIn from './icons/LinkedIn.svelte';
	import Messages from './Messages.svelte';
</script>

<footer class="layout-main">
	<div class="layout__all centered">
		<div class="sep symbol" role="presentation" title="Trees provided by Katie Holten (https://www.katieholten.com/) – plant one today."><Messages /></div>
		<div class="copyright">
			<small>© Nick Trombley. Find me on:</small>
			<span class="external-links">
				<a title="Github" aria-label="Github" href="https://github.com/Aias"><Github /></a>&nbsp;&nbsp;
				<a title="LinkedIn" aria-label="LinkedIn" href="https://www.linkedin.com/in/nick-trombley/"><LinkedIn /></a></span>
		</div>
	</div>
</footer>

<style>
	footer {
		margin-top: var(--body-padding);
	}

	.sep {
		margin-bottom: calc(0.75 * var(--body-padding));
		text-align: center;
	}

	.copyright > * {
		padding: 0 2px;
	}

	.external-links {
		white-space: nowrap;
	}
</style>