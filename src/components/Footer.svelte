<script>
	import Github from './icons/Github.svelte';
	import LinkedIn from './icons/LinkedIn.svelte';
	import Messages from './Messages.svelte';
</script>

<footer class="layout-main">
	<div class="layout__all centered">
		<div class="sep symbol" role="presentation"><Messages /></div>
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

	.sep {
		margin-bottom: calc(0.75 * var(--body-padding));
		text-align: center;
	}

	.external-links {
		display: flex;
		justify-content: center;
	}

	.external-links > li {
		margin: 0 0.5rem;
	}
</style>