<script>
	import markdown from '../../helpers/markdown';

	export let corpse = [];
</script>

<figure class="flow">
	<figcaption>
		When I left Epic, my coworkers put together a beautifully touching
		<a href="https://en.wikipedia.org/wiki/Exquisite_corpse"
			>exquisite corpse</a
		>
		for me to take into the next chapter of my life. On the back of each
		tile was a question about me for them to think about – their answers
		capture who I am better than I ever could.
	</figcaption>
	<ol class="corpse">
		{#each corpse as {id, row, column, question, response, corpse_image}
		(id)}
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
		box-shadow: var(--shadow);
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
