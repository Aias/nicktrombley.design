<script context="module">
	import { API_URL } from '../../config.js';

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
	import CheckboxGroup from './_CheckboxGroup.svelte';
	import ProjectsList from './_ProjectsList.svelte';

	export let projects = [];
	let filteredProjects = [];

	const fields = ['roles', 'technologies', 'fields', 'tags'];

	let groups = fields.reduce((obj, key) => {
		obj[key] = {
			byKey: {},
			filtered: []
		};

		return obj;
	}, {});

	$: {
		fields.forEach(field => {
			groups[field].byKey = {}; // After each update, reset buttons for each group.
		});

		filteredProjects = getFilteredProjects(projects, groups);

		filteredProjects.forEach((project, i) => {
			fields.forEach(field => mapField(project, field));
		});
	}

	$: displayedProjects = getRatedProjects(filteredProjects, groups);

	const mapField = (project, field) => {
		if(!project[field]) return null;

		// If a field is being filtered on, only map projects that map the filter.
		

		project[field].forEach(item => {
			let itemByKey = groups[field]["byKey"][item];
			if (typeof itemByKey === 'object') {
				itemByKey.count++;
			} else {
				itemByKey = { count: 1 };
			}
			groups[field]["byKey"][item] = itemByKey;
		});
	};

	const handleChecked = (group = '', key = '', checked = false) => {
		let newGroup = { ...groups[group] };

		if(checked) {
			newGroup["filtered"].push(key);
		}
		else {
			newGroup["filtered"] = newGroup["filtered"].filter(k => k !== key);
		}

		groups = {
			...groups,
			[group]: newGroup
		};
	}

	const getFilteredProjects = (projects = [], groups) => {
		let newProjects = [...projects];

		fields.forEach(field => {
			const group = groups[field];
			// For every filter currently applied, remove all projects that don't match that filter.
			group.filtered.forEach(filter => {
				newProjects = newProjects.filter(project => {
					return project[field].indexOf(filter) > -1 ? true : false;
				});
			});
		});

		return newProjects;
	}

	const getRatedProjects = (projects = [], groups) => {
		const maxListed = 12;

		let ratedProjects = projects.map((project, i) => {
			let rating = project.rating || 0;
			if(project.starred) rating += 0.5;
			/* TODO: Someday it would be nice to incorporate an idea of specificity into the rating system.
				     The idea being that if a filter is applied, projects that *only* contain that filter
					 should be weighted higher than projects with a big list that happen to contain it.

					 e.g., if I'm filtering on my role as a 'User Researcher', projects where that was the
					 only thing I did should be weighted higher than projects where I also did design,
					 development, project management, etc. The project was more "about" user research.
			*/

			return {
				...project,
				_rating: rating,
				_order: i
			};
		});

		return ratedProjects.sort((a,b) => {
			if(b._rating > a._rating) { return 1; } // First by rating, desc.
			else if(b._rating < a._rating) { return -1; }
			else if(a._order > b._order) { return 1; } // Then by original order, asc.
			else { return -1; }
		}).slice(0, maxListed);
	}
</script>

<article class="layout__all">
	<CheckboxGroup title="If you're looking for a..." group="{groups.roles}" onChange="{handleChecked.bind(undefined, 'roles')}" />
	<CheckboxGroup title="who's worked with..." group="{groups.technologies}" onChange="{handleChecked.bind(undefined, 'technologies')}" />
	<CheckboxGroup title="in the field of..." group="{groups.fields}" onChange="{handleChecked.bind(undefined, 'fields')}" />
	<CheckboxGroup title="on projects related to..." group="{groups.tags}" onChange="{handleChecked.bind(undefined, 'tags')}" />
	<section>
		<header>
			<h3>Let's talk.</h3>
			<span><a title="Contact" href="/contact">Send me a message</a> and I can tell you how the following projects might be similar to what you're working on:</span>
		</header>
		<ProjectsList projects="{displayedProjects}" {groups} />
	</section>
</article>

<style>
	section {
		margin-top: 2rem;
	}

	h3 {
		display: inline;
	}
</style>
