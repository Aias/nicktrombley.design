<script>
	import Nav from '../components/Nav.svelte';
	import PageTitle from '../components/PageTitle.svelte';
	import Footer from '../components/Footer.svelte';
	import SEO from '../components/SEO.svelte';

	export let segment;

	const pages = [
		{
			url: 'projects',
			label: 'Projects',
			title: 'The Work List'
		},
		{
			url: 'writing',
			label: 'Writing',
			title: 'Writing'
		},
		{
			url: 'about',
			label: 'About',
			title: 'About / CV'
		},
		{
			url: 'contact',
			label: 'Contact',
			title: 'Contact'
		}
	];

	$: selectedPage = pages.find(page => page.url === segment);
</script>

<SEO />

<Nav {segment} {pages} />

<main class="layout-main segment--{segment || 'home'}">
	{#if selectedPage}
	<PageTitle page="{selectedPage}" />
	{/if}
	<slot></slot>
</main>

<Footer />

<style>
	.segment--home {
		margin-top: var(--body-padding);
	}
</style>