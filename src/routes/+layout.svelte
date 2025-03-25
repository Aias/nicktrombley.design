<script lang="ts">
	import { onMount } from 'svelte';
	import SEO from '../components/SEO.svelte';
	import '../styles/app.css';
	let { children, data } = $props();
	const theme = $derived(data.theme);
	onMount(() => {
		if (theme) {
			document.documentElement.classList.add(theme);
		}
	});
</script>

<SEO />

<svelte:head>
	<meta name="color-scheme" class={theme} content={theme ? theme : 'light dark'} />
</svelte:head>

{@render children()}
