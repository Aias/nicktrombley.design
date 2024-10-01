<script lang="ts">
	import SEO from '../components/SEO.svelte';
	let { children } = $props();
</script>

<SEO />

<main>
	{@render children()}
</main>
