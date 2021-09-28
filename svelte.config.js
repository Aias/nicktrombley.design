// import adapter from '@sveltejs/adapter-netlify';
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// options passed to svelte.compile (https://svelte.dev/docs#svelte_compile)
	compilerOptions: null,

	// an array of file extensions that should be treated as Svelte components
	extensions: ['.svelte'],

	kit: {
		adapter: adapter(),
		amp: false,
		appDir: '_app',
		files: {
			assets: 'static',
			// hooks: 'src/hooks',
			lib: 'src/lib',
			routes: 'src/routes',
			// serviceWorker: 'src/service-worker',
			template: 'src/app.html',
		},
		floc: false,
		// host: null,
		// hostHeader: null,
		hydrate: true,
		package: {
			dir: 'package',
			emitTypes: true,
			// excludes all .d.ts and files starting with _ as the name
			exports: (filepath) => !/^_|\/_|\.d\.ts$/.test(filepath),
			files: () => true,
		},
		paths: {
			assets: '',
			base: '',
		},
		prerender: {
			crawl: true,
			enabled: true,
			entries: ['*'],
			onError: 'fail',
		},
		router: true,
		ssr: true,
		// target: null,
		trailingSlash: 'never',
		vite: () => ({}),
	},

	// options passed to svelte.preprocess (https://svelte.dev/docs#svelte_preprocess)
	preprocess: null,
};

export default config;
