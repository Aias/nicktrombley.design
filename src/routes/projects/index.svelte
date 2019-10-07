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
			mapProperty(project, 'roles', 'role');
			mapProperty(project, 'technologies', 'technologies');
			mapProperty(project, 'fields', 'field');
			mapProperty(project, 'tags', 'tags');
		});
	}

	const mapProperty = (source, target, prop) => {
		source[prop].forEach(item => {
			if (typeof groups[target][item] === 'object') {
				groups[target][item].count++;
			} else {
				groups[target][item] = { count: 1, checked: false };
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
</script>

<article class="layout__all">
	<CheckboxGroup items="{objToArr(groups.roles)}" title="If you're looking for a..." onChange="{handleChecked.bind(undefined, 'roles')}" />
	<CheckboxGroup items="{objToArr(groups.technologies)}" title="with experience working with..." onChange="{handleChecked.bind(undefined, 'technologies')}" />
	<CheckboxGroup items="{objToArr(groups.fields)}" title="in the field of..." onChange="{handleChecked.bind(undefined, 'fields')}" />
	<CheckboxGroup items="{objToArr(groups.tags)}" title="on projects related to..." onChange="{handleChecked.bind(undefined, 'tags')}" />
	<section class="flow">
		<header>
			<h3>We should talk.</h3>
			<span><a title="Contact" href="/contact">Send me a message</a> and I can tell you how the following projects might be similar to what you're working on:</span>
		</header>
		<table>

		</table>		
	</section>
</article>

<style>
	section {
		margin-top: 1.5rem;
	}
	h3 {
		display: inline;
	}
</style>
