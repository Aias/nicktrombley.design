<script>
	import { onMount } from 'svelte';
	import { API_URL } from '../../config.js';
	import markdown from '../../helpers/markdown';
	import resume from '../../../static/files/resume.json';
	import Corpse from './_Corpse.svelte';
	import { mapDates, sortByDate, formatDate } from './functions.js';
	
	export let corpse = [];

	let { basics, skills, references, interests } = resume;
	let work = mapDates(resume.work).sort(sortByDate);
	let education = mapDates(resume.education).sort(sortByDate);

	onMount(async () => {
		let options = {
			view: 'Grid view'
		};

		corpse = await fetch(
			`${API_URL}/airtableGet?base=portfolio&table=corpse&options=${JSON.stringify(
				options
			)}`
		)
			.then(data => data.json())
			.catch(error => {
				console.log(error);
				return [];
			});
	})

	$: {
		// console.log(work, education);
	}
</script>

<article class="layout__all h-resume">
	<!-- <section id="bio">
		<h2>Nick Trombley</h2>
		<img class="profile-image"
			src="{basics.image}"
			alt="A photo of me on Christopher Alexander's Eishin school campus."
		/>
	</section> -->
	<section id="skills">
		<h2>Skills</h2>
		<p>See the <a href="/projects">projects list</a> for more information on my skills and strengths.</p>
	</section>
	<section id="experience">
		<h2>Experience</h2>
		{#each references as {name, reference, source}}
		<blockquote>
			<p>"{reference}"</p>
			<footer>— <a href="{source}">{name}</a></footer>
		</blockquote>
		{/each} {#each work as {name, location, description, position, teams, url,
		startDate, endDate, summary, highlights}}
		<h3>{position}</h3>
		<div class="subtitle">
			{name}, {formatDate(startDate)}&nbsp;—&nbsp;{formatDate(endDate)}
		</div>
		<p>{summary}</p>
		<ul>
			{#each highlights as highlight}
			<li>{@html markdown.render(highlight)}</li>
			{/each}
		</ul>
		{/each}
	</section>
	<section id="education">
		<h2>Education</h2>
		{#each education as {institution, area, courses, startDate, endDate, gpa, studyType, program}}
		<h3>{institution} Class of {endDate.getFullYear()}</h3>
		<div class="subtitle">
			<p>{studyType}, {area}, GPA {gpa}</p>
			<p>{program}</p>
		</div>
		{/each}
	</section>
	{#if corpse.length > 0}
	<section id="personal" class="section-personal">
		<h2>Something More Personal</h2>
		<Corpse {corpse} />
	</section>
	{/if}
</article>

<style>
	article {
		margin-top: var(--flow);
	}

	/* .profile-image {
		border-radius: 50%;
		border: var(--border);
		box-shadow: var(--shadow);
		grid-column: 3;
	} */

	.section-personal > h2 {
		border-top: var(--border);
		padding-top: 1.5em;
		margin-bottom: 1em;
	}
</style>
