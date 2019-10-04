<script>
	import Nav from '../components/Nav.svelte';
	import SEO from '../components/SEO.svelte';

	export let segment;
</script>

<SEO />

<Nav {segment}/>

<main class="layout-main segment--{segment || 'home'}">
	<slot></slot>
</main>

<style>
	.segment--home {
		margin-top: var(--body-padding);
	}
</style>