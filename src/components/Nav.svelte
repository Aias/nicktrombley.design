<script>
	export let segment = '';
	export let pages = [];
</script>

<header class="layout-main">
	<strong class="site-title layout__primary symbol">
		<a href="/">netdotdesign</a>
	</strong>
	<nav>
		<ul class="nav-links">
			{#each pages as {url, label}}
			<li class:selected="{segment === url.split('/')[0]}">
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
		align-self: flex-end;
		font-size: 1rem;
		line-height: inherit;
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
		.site-title {
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
