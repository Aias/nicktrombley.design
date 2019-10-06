<script>
	export let segment;
</script>

<header class="layout-main">
	<h1 class="site-title layout__primary">
		<a href="/">nick trombley . design</a>
	</h1>
	<nav>
		<ul class="nav-links">
			<li><a rel="prefetch" href="/cv">CV</a></li>
			<li><a rel="prefetch" href="/projects">Projects</a></li>
			<li><a rel="prefetch" href="/writing">Writing</a></li>
			<li><a rel="prefetch" href="/contact">Contact</a></li>
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
		justify-content: space-evenly;
		max-width: 350px;
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
