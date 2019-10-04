<script>
	import Nav from '../components/Nav.svelte';

	export let segment;
</script>

<Nav {segment}/>

<main class="layout-main segment--{segment || 'home'}">
	<slot></slot>
</main>

<style>
	.segment--home {
		margin-top: var(--body-padding);
	}
</style>