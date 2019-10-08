<script>
	export let projects = [];
</script>

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
			{#each projects as {name, fields, roles, technologies, tags,
			starred, description, images, link}}
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

<style>
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
