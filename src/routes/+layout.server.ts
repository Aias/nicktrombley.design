import { parse } from 'csv-parse/sync';
import { type Widget, WidgetsSchema } from '$types/portfolio';

export const prerender = true;

export const load = async ({ fetch }) => {
	// Fetch the CSV file from the static data directory
	const response = await fetch('/data/portfolio-widgets.csv');
	if (!response.ok) {
		throw new Error(`Failed to load widgets data: ${response.statusText}`);
	}

	const fileContent = await response.text();

	// Parse the CSV content with bom option to handle Byte Order Mark
	const csvData = parse(fileContent, {
		columns: true,
		skip_empty_lines: true,
		bom: true, // This removes the BOM character from column headers
	});

	// Validate and transform the data with Zod schema
	const widgets: Widget[] = csvData.map((row: Record<string, string | number>) =>
		WidgetsSchema.parse(row),
	);

	return {
		widgets,
	};
};
