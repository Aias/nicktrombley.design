import babel from '@rolldown/plugin-babel';
import type { Options } from '@stylexjs/babel-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		babel({
			plugins: [
				[
					'@stylexjs/babel-plugin',
					{
						dev: false,
						runtimeInjection: false,
						treeshakeCompensation: true,
						unstable_moduleResolution: { type: 'commonJS' }
					} satisfies Partial<Options>
				]
			]
		}),
		react()
	],
	publicDir: 'static',
	build: { outDir: 'build' }
});
