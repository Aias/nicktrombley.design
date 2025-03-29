<script lang="ts">
	import Moon from '$components/icons/Moon.svelte';
	import Sun from '$components/icons/Sun.svelte';
	function handleThemeChange() {
		const htmlNode = document.documentElement;
		let theme: 'light' | 'dark';

		if (htmlNode.classList.contains('light')) {
			htmlNode.classList.remove('light');
			htmlNode.classList.add('dark');
			theme = 'dark';
		} else if (htmlNode.classList.contains('dark')) {
			htmlNode.classList.remove('dark');
			htmlNode.classList.add('light');
			theme = 'light';
		} else {
			const userPreference = window.matchMedia('(prefers-color-scheme: dark)').matches
				? 'light'
				: 'dark';
			htmlNode.classList.add(userPreference);
			theme = userPreference;
		}

		// Set the theme cookie with a long expiration (1 year)
		document.cookie = `theme=${theme};path=/;max-age=31536000;SameSite=Lax`;
	}
</script>

<div class="theme-toggle">
	<button type="button" aria-label="Toggle theme" title="Toggle theme" onclick={handleThemeChange}
		><Moon /><Sun /></button
	>
</div>

<style>
	.theme-toggle {
		border-radius: 0.125em;
		display: inline-flex;
		background-color: var(--widget-container);
	}
	button {
		color: var(--widget-accent);
		border: 1px solid var(--widget-border);
		border-radius: 0.125em;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5em;
		padding: 0.25em;
		cursor: pointer;
		transition: background-color 0.15s ease-in-out;
		background-color: var(--widget-tint);
		&:hover {
			background-color: var(--widget-tone);
		}
	}
</style>
