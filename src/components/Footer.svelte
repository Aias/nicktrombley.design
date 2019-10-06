<script>
	import Github from './icons/Github.svelte';
	import LinkedIn from './icons/LinkedIn.svelte';
</script>

<footer class="layout-main">
	<div class="layout__all centered">
		<ul class="external-links">
			<li><a title="Github" href="https://github.com/Aias"><Github /></a></li>
			<li>
				<a title="LinkedIn" href="https://www.linkedin.com/in/nick-trombley/"
					><LinkedIn /></a
				>
			</li>			
		</ul>	
	</div>
</footer>

<style>
	footer {
		margin-top: var(--body-padding);
	}

	div::before {
		content: '· · ·';
		margin-bottom: calc(0.5 * var(--body-padding));
		display: block;
		text-align: center;
	}

	.external-links {
		display: inline-flex;
	}

	.external-links > li {
		margin: 0 0.5rem;
	}
</style>