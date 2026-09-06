import { renderToString } from 'react-dom/server';
import { readFile, writeFile } from 'node:fs/promises';
import { Portfolio } from './Portfolio';

const path = new URL('../build/index.html', import.meta.url);
const html = await readFile(path, 'utf8');
await writeFile(
	path,
	html.replace('<div id="root"></div>', `<div id="root">${renderToString(<Portfolio />)}</div>`)
);
