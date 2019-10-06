<script context="module">
	const API_URL =
		'https://barnsworthburning-api.netlify.com/.netlify/functions';

	export async function preload(page, session) {
		let options = {
			view: 'Grid view'
		};

		let projects = await this.fetch(
			`${API_URL}/airtableGet?base=portfolio&table=projects&options=${JSON.stringify(
				options
			)}`
		)
			.then(data => data.json())
			.catch(error => {
				console.log(error);
				return [];
			});

		return { projects };
	}
</script>

<script>
	import PageTitle from '../components/PageTitle.svelte';

	export let projects = undefined;

	$: {
		console.log(projects);
	}
</script>

<PageTitle>The Work List</PageTitle>

<article class="layout__all">
	Under construction.
</article>
