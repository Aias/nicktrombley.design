import * as fs from 'fs';
import * as path from 'path';
import { optimize, Config } from 'svgo';
import { glob } from 'glob';
import { JSDOM } from 'jsdom';

// Get DOM manipulation utilities
const { DOMParser, XMLSerializer } = new JSDOM().window;

// Define the type for our color matchers
type ColorMatch = {
	attrs: { [key: string]: string };
	className: string;
};

// Convert the original color map to our new format
const colorMatchers: ColorMatch[] = [
	// Basic fills
	{ attrs: { fill: '#1D211C' }, className: 'fill-primary' },
	{ attrs: { fill: '#686E67' }, className: 'fill-secondary' },
	{ attrs: { fill: '#8D918C' }, className: 'fill-hint' },
	{ attrs: { fill: '#B0B3AF' }, className: 'fill-ghost' },
	{ attrs: { fill: '#464D45' }, className: 'fill-accent' },
	{ attrs: { fill: '#717A6D' }, className: 'fill-symbol' },
	{ attrs: { fill: '#F8FAF8' }, className: 'fill-background' },
	{ attrs: { fill: '#FCFDFC' }, className: 'fill-container' },
	{ attrs: { fill: '#F5F7F5' }, className: 'fill-component' },

	// Colors with opacity
	{ attrs: { 'fill': '#004900', 'fill-opacity': '0.027' }, className: 'fill-tint' },
	{ attrs: { 'fill': '#002000', 'fill-opacity': '0.063' }, className: 'fill-tone' },
	{ attrs: { 'fill': '#001800', 'fill-opacity': '0.125' }, className: 'fill-paint' },
	{ attrs: { 'fill': '#000', 'fill-opacity': '0.04' }, className: 'fill-darken' },
	{ attrs: { 'fill': '#fff', 'fill-opacity': '0' }, className: 'fill-transparent' },
	{ attrs: { 'stroke': '#000', 'stroke-opacity': '0.12' }, className: 'stroke-shadow' },

	// Colors with both stroke and fill variants (separate entries)
	{ attrs: { stroke: '#D7DAD7' }, className: 'stroke-divider' },
	{ attrs: { fill: '#D7DAD7' }, className: 'fill-divider' },

	{ attrs: { stroke: '#E7EBE7' }, className: 'stroke-divider-subtle' },
	{ attrs: { fill: '#E7EBE7' }, className: 'fill-divider-subtle' },

	{ attrs: { stroke: '#CCCFCC' }, className: 'stroke-border' },
	{ attrs: { fill: '#CCCFCC' }, className: 'fill-border' },

	{ attrs: { stroke: '#BABDBA' }, className: 'stroke-border-active' },
	{ attrs: { fill: '#BABDBA' }, className: 'fill-border-active' },

	{ attrs: { stroke: '#A5A8A3' }, className: 'stroke-ring' },
	{ attrs: { fill: '#A5A8A3' }, className: 'fill-ring' },

	{ attrs: { fill: '#898E87' }, className: 'fill-main' },
	{ attrs: { stroke: '#898E87' }, className: 'stroke-main' },

	{ attrs: { fill: '#fff' }, className: 'fill-main-contrast' },
	{ attrs: { stroke: '#fff' }, className: 'stroke-main-contrast' },

	// Theme colors
	{ attrs: { fill: '#46A758' }, className: 'fill-theme' },
	{ attrs: { fill: '#2A7E3B' }, className: 'fill-theme-text' },
];

// Helper function to check if an element matches a color matcher
function elementMatchesColor(element: Element, matcher: ColorMatch): boolean {
	return Object.entries(matcher.attrs).every(([attr, value]) => {
		const elementValue = element.getAttribute(attr);
		if (!elementValue) return false;

		// Special handling for opacity values which might appear without leading zeros
		if (attr.includes('opacity')) {
			// Parse both values as floats to compare numerically instead of as strings
			const matcherValue = parseFloat(value);
			const elemValue = parseFloat(elementValue);
			return Math.abs(matcherValue - elemValue) < 0.00001; // Use small epsilon for floating point comparison
		}

		return elementValue.toLowerCase() === value.toLowerCase();
	});
}

// Function to process SVG contents
function processColors(svgString: string): string {
	const parser = new DOMParser();
	const doc = parser.parseFromString(svgString, 'image/svg+xml');

	const elements = doc.getElementsByTagName('*');
	for (const element of Array.from(elements)) {
		// Type cast the element to Element
		const typedElement = element as Element;
		for (const matcher of colorMatchers) {
			if (elementMatchesColor(typedElement, matcher)) {
				const existingClass = typedElement.getAttribute('class') || '';
				typedElement.setAttribute('class', `${existingClass} ${matcher.className}`.trim());

				// Remove the matched attributes
				Object.keys(matcher.attrs).forEach((attr) => {
					typedElement.removeAttribute(attr);
				});
			}
		}
	}

	return new XMLSerializer().serializeToString(doc);
}

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
			name: 'prefixIds',
			params: {
				prefix: 'widget-',
				prefixClassNames: false,
			},
		},
		{
			name: 'addClassesToSVGElement',
			params: {
				classNames: ['portfolio-widget'],
			},
		},
	],
};

// Create output directory if it doesn't exist
const outputDir: string = path.resolve(__dirname, '../static/widgets');
if (fs.existsSync(outputDir)) {
	// Clear the output directory
	fs.rmSync(outputDir, { recursive: true });
}
fs.mkdirSync(outputDir, { recursive: true });

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
				// First optimize the SVG
				const result = optimize(svg, {
					path: file,
					...svgoConfig,
				});

				// Then process the colors
				const processed = processColors(result.data);

				const outputPath = path.join(outputDir, filename);
				fs.writeFileSync(outputPath, processed);
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
