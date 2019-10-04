<h2 class="page-title layout__primary">
	<slot></slot>
</h2>

<style>
	.page-title {
		text-transform: lowercase;
		text-align: center;
		padding-bottom: 1rem;
		border-bottom: var(--border);
	}

	@media (max-width: 1064px) {
		.page-title {
			border-bottom: none;
			padding-bottom: 0;
			padding-top: 1rem;
		}
	}
</style>
