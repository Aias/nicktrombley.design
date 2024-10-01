<script lang="ts">
	interface SEOProps {
		title?: string;
		description?: string;
		image?: string;
		siteName?: string;
		type?: string;
		subject?: string;
		email?: string;
		url?: string;
		robots?: string;
		themeColor?: string;
		keywords?: string;
		author?: string;
	}

	let {
		title = 'nick trombley . design',
		description = 'a personal website',
		image = '/logo-512.png',
		siteName = 'nick trombley . design',
		type = 'website',
		subject,
		email = 'trombley.nick@gmail.com',
		url = 'https://nicktrombley.design',
		robots = 'index, follow',
		themeColor = '#1f0066',
		keywords = 'Nick Trombley, design, resume, CV, portfolio, work, development, front-end, web',
		author = 'Nick Trombley',
	}: SEOProps = $props();
</script>

<svelte:head>
	<!-- Meta basics -->
	<title>{title}</title>
	<meta name="description" content={description} />
	{#if subject}
		<meta name="subject" content={subject} />
	{/if}
	<meta name="keywords" content={keywords} />
	<meta name="theme-color" content={themeColor} />
	<meta name="robots" content={robots} />
	<meta name="author" content={author} />
	<meta name="reply-to" content={email} />
	<meta name="url" content={url} />
	<!-- OpenGraph tags -->
	<meta property="og:site_name" content={siteName} />
	<meta property="og:type" content={type} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />
</svelte:head>
