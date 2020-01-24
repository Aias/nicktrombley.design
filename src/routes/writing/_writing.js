// Almost entirely adapted from:
// https://github.com/doppelganger9/blog/blob/master/src/routes/index.json.js

import fs from 'fs';
import path from 'path';
import markdown from '../../helpers/markdown';

const WRITING_DIRECTORY = './src/writing';
const siteUrl = 'https://nicktrombley.design';

export function getWriting() {
	const slugs = fs
		.readdirSync(WRITING_DIRECTORY)
		.filter(file => path.extname(file) === '.md')
		.map(file => file.slice(0, -3));

	return slugs.map(getOneDoc).filter(doc => doc.meta.published);
}

export function getOneDoc(slug) {
	const file = `${WRITING_DIRECTORY}/${slug}.md`;
	if (!fs.existsSync(file)) return null;

	const rawContent = fs.readFileSync(file, 'utf-8');

	let html = markdown.render(rawContent);

	return {
		slug,
		html,
		rawContent,
		meta: markdown.meta,
	};
}