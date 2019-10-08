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
	import CheckboxGroup from './_CheckboxGroup.svelte';
	import ProjectsList from './_ProjectsList.svelte';

	export let projects = [];

	const fields = ['roles', 'technologies', 'fields', 'tags'];

	$: groups = fields.reduce((obj, key) => {
		obj[key] = {
			byKey: {},
			filtered: []
		};

		return obj;
	}, {});

	$: {
		projects.forEach((project, i) => {
			Object.keys(groups).forEach(key => mapProperty(project, key));
		});
	}

	$: projectsFiltered = getListedProjects(projects, groups);

	const mapProperty = (source, prop) => {
		source[prop].forEach(item => {
			let itemByKey = groups[prop]["byKey"][item];
			if (typeof itemByKey === 'object') {
				itemByKey.count++;
			} else {
				itemByKey = { count: 1, checked: false };
			}
			groups[prop]["byKey"][item] = itemByKey;
		});
	};

	const handleChecked = (group = '', key = '', checked = false) => {
		let newGroup = { ...groups[group] };
		newGroup["byKey"][key].checked = checked;

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

	const getListedProjects = (projects = [], groups) => {
		const maxListed = 12;

		let ratedProjects = projects.map((project, i) => {
			let rating = 0;
			if(project.starred) { rating++; }

			Object.keys(groups).forEach(key => {
				let { filtered } = groups[key];
				let projectItems = project[key] || [];

				filtered.forEach(filter => {
					if(projectItems.indexOf(filter) >= 0) {
						rating = rating + 2;
					}
				})
			})

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
	<section class="flow">
		<header>
			<h4>Let's talk.</h4>
			<span><a title="Contact" href="/contact">Send me a message</a> and I can tell you how the following projects might be similar to what you're working on:</span>
		</header>
		<ProjectsList projects="{projectsFiltered}" {groups} />
	</section>
</article>

<style>
	section {
		margin-top: 2rem;
	}

	h4 {
		display: inline;
	}
</style>
