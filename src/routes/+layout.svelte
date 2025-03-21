<script lang="ts">
	import SEO from '../components/SEO.svelte';
	import '../styles/app.css';
	let { data, children } = $props();

	console.log(data);
</script>

<SEO />

{@render children()}
