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
	import CheckboxGroup from './CheckboxGroup.svelte';

	export let projects = undefined;

	let groups = {
		'roles': {},
		'technologies': {},
		'fields': {},
		'tags': {}
	};

	$: {
		projects.forEach((project, i) => {
			Object.keys(groups).forEach(key => mapProperty(project, key));
		});
	}

	$: projectsFiltered = filterProjects(projects, groups);

	$: {
		console.log(projectsFiltered);
	}

	const mapProperty = (source, prop) => {
		source[prop].forEach(item => {
			if (typeof groups[prop][item] === 'object') {
				groups[prop][item].count++;
			} else {
				groups[prop][item] = { count: 1, checked: false };
			}
		});
	};

	const objToArr = obj => {
		return Object.entries(obj).sort((a, b) => {
			return b[1].count - a[1].count;
		});
	};

	const handleChecked = (group = '', key = '', checked = false) => {
		let newGroup = { ...groups[group] };
		newGroup[key].checked = checked;

		groups = {
			...groups,
			[group]: newGroup
		};
	}

	const filterProjects = (projects = [], groups) => {
		const maxListed = 10;
		return projects.slice(0, maxListed);
	}
</script>

<article class="layout__all">
	<CheckboxGroup items="{objToArr(groups.roles)}" title="If you're looking for a..." onChange="{handleChecked.bind(undefined, 'roles')}" />
	<CheckboxGroup items="{objToArr(groups.technologies)}" title="with experience working with..." onChange="{handleChecked.bind(undefined, 'technologies')}" />
	<CheckboxGroup items="{objToArr(groups.fields)}" title="in the field of..." onChange="{handleChecked.bind(undefined, 'fields')}" />
	<CheckboxGroup items="{objToArr(groups.tags)}" title="on projects related to..." onChange="{handleChecked.bind(undefined, 'tags')}" />
	<section class="flow">
		<header>
			<h4>We should talk.</h4>
			<span><a title="Contact" href="/contact">Send me a message</a> and I can tell you how the following projects might be similar to what you're working on:</span>
		</header>
		<div class="table-container">
			<table>
				<thead>
					<tr>
						<th>Project name</th>
						<th>Roles</th>
						<th>Technologies</th>
						<th>Fields</th>
						<th>Tags</th>
					</tr>
				</thead>
				<tbody>
					{#each projectsFiltered as {name, fields, roles, technologies, tags, starred, description, images, link}}
					<tr>
						<td>{name}</td>
						<td>{roles.join(', ')}</td>
						<td>{technologies.join(', ')}</td>
						<td>{fields.join(', ')}</td>
						<td>{tags.join(', ')}</td>
					</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>
</article>

<style>
	section {
		margin-top: 2rem;
	}

	h4 {
		display: inline;
	}

	.table-container {
		max-width: 100%;
		overflow-x: scroll;		
	}

	table {
		margin-top: 1.5rem;

	}

	td:first-child {
		font-weight: var(--font-weight-bold);
	}
</style>
