<script context="module">
	import { API_URL } from '../config.js';

	export async function preload(page, session) {
		let options = {
			view: 'Grid view'
		};

		let corpse = await this.fetch(
			`${API_URL}/airtableGet?base=portfolio&table=corpse&options=${JSON.stringify(
				options
			)}`
		)
			.then(data => data.json())
			.catch(error => {
				console.log(error);
				return [];
			});

		return { corpse };
	}
</script>

<script>
	import markdown from '../helpers/markdown';
	import resume from '../../static/files/resume.json';
	export let corpse = [];

	const mapDates = arr =>
		arr.map(obj => {
			let startDate = obj.startDate
				? new Date(obj.startDate)
				: new Date();
			let endDate = obj.endDate ? new Date(obj.endDate) : undefined;

			return {
				...obj,
				startDate,
				endDate
			};
		});

	const sortByDate = (a, b) => {
		if (!b.endDate) {
			if (!a.endDate) {
				// If both are null, sort by start date.
				return b.startDate > a.startDate;
			}
			// If just b has no end, then b is most recent.
			return 1;
		} else if (!a.endDate) {
			// If a has no end, then a is most recent.
			return -1;
		} else {
			// If both have end dates, sort by end date.
			return b.endDate > a.endDate;
		}
	};

	const formatDate = d => {
		if (!d) return 'present';

		let day = d.getDate();
		let month = d.getMonth() + 1;
		let year = d.getFullYear();

		return `${month}/${year}`;
	};

	let { basics, skills, references, interests } = resume;
	let work = mapDates(resume.work).sort(sortByDate);
	let education = mapDates(resume.education).sort(sortByDate);

	$: {
		console.log(work, education);
	}
</script>

<article class="layout__all h-resume">
	<section id="bio">
		<h2>bio</h2>
		<div>
			<img
				src="{basics.image}"
				alt="A photo of me on Christopher Alexander's Eishin school campus."
			/>
		</div>
	</section>
	<section id="skills">
		<h2>skills</h2>
	</section>
	<section id="experience">
		<h2>experience</h2>
		{#each references as {name, reference, source}}
		<blockquote>
			<p>"{reference}"</p>
			<footer>— <a href="{source}">{name}</a></footer>
		</blockquote>
		{/each} {#each work as {name, location, description, position, url,
		startDate, endDate, summary, highlights}}
		<h3>{position}</h3>
		<div class="subtitle">
			{name}, {formatDate(startDate)}—{formatDate(endDate)}
		</div>
		<p>{summary}</p>
		<ul>
			{#each highlights as highlight}
			<li>{highlight}</li>
			{/each}
		</ul>
		{/each}
	</section>
	<section id="education">
		<h2>education</h2>
	</section>
	<section id="personal" class="section-personal">
		<h2>something more personal</h2>
		<figure class="flow">
			<figcaption>
				When I left Epic, my coworkers put together a beautifully
				touching
				<a href="https://en.wikipedia.org/wiki/Exquisite_corpse"
					>exquisite corpse</a
				>
				for me to take into the next chapter of my life. On the back of
				each tile was a question about me for them to think about –
				their answers capture who I am better than I ever could.
			</figcaption>
			<ol class="corpse">
				{#each corpse as {id, row, column, question, response,
				corpse_image} (id)}
				<li>
					<img
						alt="Row {row}, column {column} of the full image."
						src="{corpse_image[0].thumbnails.large.url}"
					/>
					<div class="qa">
						<h3 class="inverted"><strong>Q:</strong> {question}</h3>
						<div class="inverted flow">
							{@html markdown.render(response)}
						</div>
					</div>
				</li>
				{/each}
			</ol>
		</figure>
	</section>
</article>

<style>
	.section-personal > h2 {
		border-top: var(--border);
		padding-top: 1em;
	}

	.corpse {
		display: grid;
		position: relative;
		grid-template-rows: repeat(3, 1fr);
		grid-template-columns: repeat(5, 1fr);
		/* grid-gap: 1px; */
	}

	img {
		transition: all 0.5s;
	}

	.corpse:hover img,
	/* https://css-tricks.com/forums/topic/click-function-for-hover-states-on-touch-devices/ */
	.corpse:active img {
		z-index: 0;
		filter: brightness(50%);
	}

	.qa {
		position: absolute;
		z-index: 10;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		pointer-events: none;
		opacity: 0;
		transition: all 0.5s;
		box-shadow: 0 0 1rem rgba(0, 0, 0, 0.15);
	}

	.qa > * {
		padding: 0.5rem 1rem;
		margin-top: 2px;
	}

	.qa :global(svg) {
		min-width: 300px;
		max-width: 500px;
		opacity: 0.9;
	}

	@media (max-width: 1064px) {
		/* Courtesy of https://css-tricks.com/full-width-containers-limited-width-parents/
		
		Assumes the parent is centered within the whole window. (It is.) */
		.corpse {
			width: 100vw;
			left: 50%;
			right: 50;
			margin-left: -50vw;
			margin-right: -50vw;
		}
	}

	@media (max-width: 664px) {
		.qa {
			transform: none;
			top: 100%;
			left: 0;
			right: 0;
		}

		.qa > * {
			padding: 0.5rem var(--body-padding);
			margin-top: 0;
		}

		.qa > *:first-child {
			padding-top: 1rem;
		}

		.qa > *:last-child {
			padding-bottom: 1rem;
		}
	}

	li:hover > img,
	li:active > img {
		filter: none !important;
	}

	li:hover > .qa {
		opacity: 1;
	}
</style>
