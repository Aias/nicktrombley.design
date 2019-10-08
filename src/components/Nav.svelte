<script>
	export let segment = '';
	export let pages = [];
</script>

<header class="layout-main">
	<h1 class="site-title layout__primary symbol">
		<a href="/">netdotdesign</a>
	</h1>
	<nav>
		<ul class="nav-links">
			{#each pages as {url, label}}
			<li class:selected="{segment === url}">
				<a rel="prefetch" href="/{url}">{label}</a>
			</li>
			{/each}
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

	.selected > a {
		color: inherit;
		text-decoration: none;
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
