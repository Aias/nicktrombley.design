<script>
	export let segment;
</script>

<header class="layout-main">
	<h1 class="site-title">Nick Trombley . Design</h1>
	<nav>
		<ul class="nav-links nav-links--internal">
			<li><a href="/files/trombley_resume.pdf">Resumé</a></li>
			<li><a href="/projects">Projects</a></li>
			<li><a href="/writing">Writing</a></li>
		</ul>
		<span class="dot" role="presentation"><strong>·</strong></span>
		<ul class="nav-links nav-links--external">
			<li><a href="https://github.com/Aias">Github</a></li>
			<li>
				<a href="https://www.linkedin.com/in/nick-trombley/"
					>LinkedIn</a
				>
			</li>
		</ul>
	</nav>
</header>

<style>
	header {
		margin-bottom: 2rem;
		text-transform: lowercase;
		justify-content: center;
	}

	header > * {
		padding-bottom: 0.5rem;
	}

	.site-title {
		font-size: 1rem;
		grid-column: span 1;
		border-bottom: var(--border);
		text-align: center;
	}

	nav {
		grid-column: span 2;
		border-bottom: var(--border);
		display: flex;
		justify-content: center;
	}

	.nav-links {
		display: flex;
	}

	li {
		margin: 0 1rem;
	}
</style>
