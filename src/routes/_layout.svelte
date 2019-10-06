<script>
	import Nav from '../components/Nav.svelte';
	import Footer from '../components/Footer.svelte';
	import SEO from '../components/SEO.svelte';

	export let segment;
</script>

<SEO />

<Nav {segment}/>

<main class="layout-main segment--{segment || 'home'}">
	<slot></slot>
</main>

<Footer />

<style>
	.segment--home {
		margin-top: var(--body-padding);
	}
</style>