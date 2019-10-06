import { start, prefetch } from '@sapper/app';

start({
	target: document.querySelector('#🖌️')
});

const routesToLoad = ['/projects', '/writing'];

routesToLoad.forEach(route => prefetch(route));
