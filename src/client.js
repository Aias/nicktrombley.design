import { start, prefetch } from '@sapper/app';

start({
	target: document.querySelector('#🖌️')
});

const routesToLoad = ['/projects', '/about'];

routesToLoad.forEach(route => prefetch(route));
