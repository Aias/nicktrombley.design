<script>
	export let siteName = 'nick trombley . design';
	export let title = siteName;
	export let subject = '';
	export let description = 'a portfolio of sorts';
	export let keywords =
		'Nick Trombley, design, resume, CV, portfolio, work, development, front-end, web';
	export let author = 'Nick Trombley';
	export let email = 'trombley.nick@gmail.com';
	export let type = 'website'; // article, profile
	export let image = '/logo-512.png';
	export let themeColor = '#1f0066';
	export let robots = 'index, follow';
	export let url = 'https://nicktrombley.design';
</script>

<svelte:head>
	<!-- Meta basics -->
	<title>{title}</title>
	<meta name="description"		content="{description}" />
	{#if subject}
	<meta name="subject"			content="{subject}" />
	{/if}
	<meta name="monetization"		content="$pay.stronghold.co/1a18f752bd394de4172a951e38d6e6bc816" />
	<meta name="keywords"			content="{keywords}" />
	<meta name="theme-color"		content="{themeColor}" />
	<meta name="robots"				content="{robots}" />
	<meta name="author"				content="{author}">
	<meta name="reply-to"			content="{email}">
	<meta name="url"				content="{url}">
	<!-- OpenGraph tags -->
	<meta property="og:site_name"	content="{siteName}" />
	<meta property="og:type"		content="{type}"/>
	<meta property="og:title"		content="{title}" />
	<meta property="og:description"	content="{description}" />
	<meta property="og:image"		content="{image}" />
</svelte:head>
