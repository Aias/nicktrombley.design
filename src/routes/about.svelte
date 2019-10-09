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
	export let corpse = [];

	$: {
		// console.log(corpse);
	}
</script>

<article class="layout__all">
	<figure class="flow">
		<ol class="corpse">
			{#each corpse as {id, row, column, question, response, corpse_image}
			(id)}
			<li>
				<img
					alt="Row {row}, column {column} of the full image."
					src="{corpse_image[0].thumbnails.large.url}"
				/>
				<div class="qa">
					<h4 class="inverted"><strong>Q:</strong> {question}</h4>
					<div class="inverted flow">
						{@html response}
					</div>
				</div>
			</li>
			{/each}
		</ol>
		<figcaption class="small">
			When I left Epic, my coworkers put together a beautifully touching
			<a href="https://en.wikipedia.org/wiki/Exquisite_corpse"
				>exquisite corpse</a
			>
			for me to take into the next chapter of my life. On the back of each
			tile was a question about me for them to think about – their answers
			capture who I am better than I ever could.
		</figcaption>
	</figure>
</article>

<style>
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
	}

	.qa > * {
		padding: 0.25rem 0.5rem;
		margin-top: 2px;
	}

	@media (max-width: 664px) {
		.qa {
			transform: none;
			top: calc(100% + var(--body-padding));
			left: calc(-1 * var(--body-padding));
			right: calc(-1 * var(--body-padding));
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
