import * as fs from 'fs';
import * as path from 'path';
import { optimize, Config } from 'svgo';
import { glob } from 'glob';

// SVGO configuration type
const svgoConfig: Config = {
	plugins: [
		{
			name: 'preset-default',
			params: {
				overrides: {
					cleanupNumericValues: {
						floatPrecision: 3,
					},
					convertTransform: {
						transformPrecision: 3,
					},
					removeViewBox: false,
					convertColors: {
						shorthex: false,
						shortname: false,
						rgb2hex: true,
						names2hex: true,
						currentColor: false,
					},
					convertPathData: {
						noSpaceAfterFlags: true,
					},
				},
			},
		},
		{
			name: 'addClassesToSVGElement',
			params: {
				classNames: ['portfolio-widget'],
			},
		},
		{
			name: 'prefixIds',
			params: {
				prefix: 'widget-',
			},
		},
	],
};

// Create output directory if it doesn't exist
const outputDir: string = path.resolve(__dirname, '../static/widgets');
if (!fs.existsSync(outputDir)) {
	fs.mkdirSync(outputDir, { recursive: true });
}
// Process SVG files
const inputDir: string = path.resolve(__dirname, '../src/components/widgets');

// Promisify glob for better error handling
const globPromise = (pattern: string): Promise<string[]> => {
	return glob(pattern);
};

// Main processing function
async function processSvgFiles(): Promise<void> {
	try {
		const files = await globPromise(path.join(inputDir, '**/*.svg'));

		for (const file of files) {
			const svg = fs.readFileSync(file, 'utf8');
			const filename = path.basename(file);

			try {
				const result = optimize(svg, {
					path: file,
					...svgoConfig,
				});

				const outputPath = path.join(outputDir, filename);
				fs.writeFileSync(outputPath, result.data);
				console.log(`Processed: ${filename}`);
			} catch (error) {
				console.error(
					`Error processing ${filename}:`,
					error instanceof Error ? error.message : error,
				);
			}
		}
	} catch (error) {
		console.error('Error finding SVG files:', error instanceof Error ? error.message : error);
		process.exit(1);
	}
}

// Run the script
processSvgFiles();
