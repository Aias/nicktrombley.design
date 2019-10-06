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

	let tags = {};
	let fields = {};
	let roles = {};
	let technologies = {};

	$: {
		console.log(projects);
		projects.forEach((project, i) => {
			mapProperty(project, tags, 'tags');
			mapProperty(project, fields, 'field');
			mapProperty(project, roles, 'role');
			mapProperty(project, technologies, 'technologies');
		});
	}

	const mapProperty = (source, target, prop) => {
		source[prop].forEach(item => {
			if (typeof target[item] === 'object') {
				target[item].count++;
			} else {
				target[item] = { count: 1 };
			}
		});
	};
</script>

<PageTitle>The Work List</PageTitle>

<article class="layout__all">
	<section>
		<h3>If you're looking for a...</h3>
		<fieldset>
			<label>
				<input type="checkbox" />
				Designer
			</label>
		</fieldset>
	</section>
	<section></section>
</article>

<style>
	fieldset {
		margin: 0.5rem 0;
		padding: 0;
		border: none;
	}
</style>
