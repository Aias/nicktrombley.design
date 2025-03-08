<script lang="ts">
	import SEO from '../components/SEO.svelte';
	import '../styles/app.css';
	let { children } = $props();
</script>

<SEO />

{@render children()}
