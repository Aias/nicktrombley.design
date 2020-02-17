---
title: What Makes Software Good?
subtitle: 10 principles for effective digital design.
date: 2019-01-01
published: true
---

<section class="intro">
	<p>
		I've conducted a lot of heuristic evaluations over the years. Almost
		all of them were done using Nielsen's
		<a href="https://www.nngroup.com/articles/ten-usability-heuristics/"
			>10 Usability Heuristics</a
		>
		as a reference, and the more of them I did, the more I realized that
		the list didn't quite encapsulate the full spectrum of my
		expectations for good design.
	</p>
	<p>
		This is my attempt at refining and expanding Nielsen's original ten
		(which I would argue aren't really "heuristics" so much as they're
		just qualities we want our designs to have — hence, principles). The
		list has been reordered, regrouped, and combined with what I'd say
		is the other best set of principles I've come across: those from
		Frederick P. Brooks, Jr.'s
		<a href="https://barnsworthburning.net/works/recNVCwWWXPv4k3Mn"
			>The Design of Design</a
		>. I have this list permanently pinned to the wall, in my periphery.
	</p>
</section>
<ol class="principles">
	<li id="principle-consistency">
		<h3>Consistency</h3>
		<p>
			Given partial knowledge of the system, one can predict how the
			rest works.
			<em>Consistency underlies all principles of quality</em>, and
			from consistency flow three other major design principles:
		</p>
		<ol class="sub-principles">
			<li>
				<h4>Orthogonality</h4>
				<p>
					Do not link what is independent. A change in one
					orthogonal function should have no observable effect on
					any other function.
				</p>
			</li>
			<li>
				<h4>Propriety</h4>
				<p>
					Do not introduce what is immaterial. The opposite of
					propriety is <em>extraneousness</em>.
					<a href="/writing/principles#principle-elegance"
						>Elegance</a
					>
					is a subset of propriety, but important enough to be
					elevated to its own principle.
				</p>
			</li>
			<li>
				<h4>Generality</h4>
				<p>
					Do not restrict possible use cases. Allow for a single
					function to be used for many ends. The designer should
					avoid limiting a function by their own ideas about how
					it will or should be used.
				</p>
			</li>
		</ol>
	</li>
	<li id="principle-comprehensibility">
		<h3>Comprehensibility</h3>
		<p></p>
		<ol class="sub-principles">
			<li>
				<h4>Structure</h4>
				<p>
					The basic structural concept of a design should be
					plainly evident and, if not logically straightforward,
					easily explained (in which case, refer to
					<a href="/writing/principles#principle-communication"
						>Communication</a
					>).
				</p>
			</li>
			<li>
				<h4>Metaphor</h4>
				<p>
					Aid comprehensibility through the use of familiar and
					simple metaphors, especially in user interfaces.
				</p>
			</li>
		</ol>
	</li>
	<li id="principle-elegance">
		<h3>Elegance</h3>
		<p>
			Do as much as possible with the fewest number of elements; less,
			but better. Also known as <em>simplicity</em>, <em>grace</em>,
			or <em>economy</em>.
		</p>
	</li>
	<li id="principle-delight">
		<h3>Delight</h3>
		<p>
			In addition to providing the needed functionality, software
			should appeal to our emotional needs and desires. There are two
			main drivers behind delight:
		</p>
		<ol class="sub-principles">
			<li>
				<h4>Style</h4>
				<p>
					All else being equal, when there are microdecisions to
					be made during design, they should be made the same way
					each time, even in different contexts. Style has a large
					impact on a design's overall
					<a href="/writing/principles#principle-consistency"
						>Consistency</a
					>.
				</p>
			</li>
			<li>
				<h4>Beauty</h4>
				<p>
					If there are sensory aspects of the design, they should
					be pleasant to experience.
				</p>
			</li>
		</ol>
	</li>
	<li id="principle-responsiveness">
		<h3>Responsiveness</h3>
		<p>
			The system should respond as quickly as possible to user
			interaction and provide constant feedback.
		</p>
	</li>
	<li id="principle-transparency">
		<h3>Transparency</h3>
		<p>The state of the system should be readily apparent.</p>
	</li>
	<li id="principle-robustness">
		<h3>Robustness</h3>
		<p>
			The system should prevent wrong actions wherever possible, and
			recover gracefully when they occur.
		</p>
		<ol class="sub-principles">
			<li>
				<h4>Error Prevention</h4>
			</li>
			<li>
				<h4>Error Recovery</h4>
			</li>
		</ol>
	</li>
	<li id="principle-efficiency">
		<h3>Efficiency</h3>
		<p>A user should be able to accomplish their tasks quickly.</p>
	</li>
	<li id="principle-communication">
		<h3>Communication</h3>
		<p>
			Documentation, help text, and UI copy should be written in
			clear, readable, understandable language.
		</p>
	</li>
	<li id="principle-accessibility">
		<h3>Accessibility</h3>
		<p>
			All users should be able to accomplish their tasks, regardless
			of background or ability.
		</p>
	</li>
</ol>

<style>.intro{font-style:italic}ol.principles{list-style-type:decimal;padding-left:2rem}ol.sub-principles{list-style-type:lower-latin;padding-left:2rem;margin-top:.5rem}ol.principles>li+li{margin-top:1em}h4,h4+p{display:inline}h4:not(:only-child)::after{content:': '}</style>