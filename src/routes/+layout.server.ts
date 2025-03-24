import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';
import { type Widget, WidgetsSchema } from '$types/portfolio';

// Get directory path for the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const load = async () => {
	// Read the widgets CSV file
	const csvFilePath = path.resolve(__dirname, '../data/portfolio-widgets.csv');
	const fileContent = fs.readFileSync(csvFilePath, 'utf8');

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
