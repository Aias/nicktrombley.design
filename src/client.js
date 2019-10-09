import { start, prefetch } from '@sapper/app';

start({
	target: document.querySelector('#🖌️')
});

const routesToLoad = [
	'/projects'
	// '/writing',
	// '/contact',
	// '/about'
];

routesToLoad.forEach(route => prefetch(route));
