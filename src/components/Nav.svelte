<script>
	export let segment;

	import Github from './icons/Github.svelte';
	import LinkedIn from './icons/LinkedIn.svelte';
</script>

<header class="layout-main">
	<h1 class="site-title layout__primary"><a href="/">Nick Trombley . Design</a></h1>
	<nav>
		<ul class="nav-links">
			<li><a href="/files/trombley_resume.pdf">Resumé</a></li>
			<li><a href="/projects">Projects</a></li>
			<li><a href="/writing">Writing</a></li>
			<li class="dot" role="presentation">
				<span><strong>·</strong></span>	
			</li>
			<li><a title="Github" href="https://github.com/Aias"><Github /></a></li>
			<li>
				<a title="LinkedIn" href="https://www.linkedin.com/in/nick-trombley/"
					><LinkedIn /></a
				>
			</li>
		</ul>
	</nav>
</header>

<style>
	header {
		margin-bottom: 1rem;
		text-transform: lowercase;
		justify-content: center;
		grid-row-gap: 0;
	}

	header > * {
		padding-bottom: 0.5rem;
	}

	.site-title {
		font-size: 1rem;
		grid-column: primary;
		border-bottom: var(--border);
		text-align: center;
	}

	.site-title > a {
		color: inherit;
		text-decoration: none;
	}

	nav {
		grid-column: secondary;
		border-bottom: var(--border);
	}

	.nav-links {
		display: flex;
		justify-content: space-between;
		max-width: 375px;
		margin-left: auto;
		margin-right: auto;
	}

	@media (max-width: 1064px) {
		.layout__primary {
			margin-bottom: 1rem;
		}

		header {
			margin-bottom: 0.5rem;
		}

		nav {
			border-bottom: none;
		}
	}
</style>
