import * as stylex from '@stylexjs/stylex';

export const widgetChroma = stylex.defineVars({
	'--portfolio-widget-chroma': stylex.types.percentage('0%')
});

export const colors = stylex.defineVars({
	primary: 'light-dark(#1d211c, #eef0ee)',
	secondary: 'light-dark(#686e67, #a9ada8)',
	hint: 'light-dark(#8d918c, #767d74)',
	ghost: 'light-dark(#b0b3af, #5c625b)',
	accent: 'light-dark(#464d45, #cad4c7)',
	symbol: 'light-dark(#717a6d, #899187)',
	background: 'light-dark(#f8faf8, #111210)',
	container: 'light-dark(#fcfdfc, #181917)',
	component: 'light-dark(#f5f7f5, #212220)',
	tint: 'light-dark(#00490007, #f1f2f008)',
	tone: 'light-dark(#00200010, #f4f5f312)',
	paint: 'light-dark(#00180020, #f2fbf122)',
	darken: 'light-dark(#0000000a, #00000080)',
	divider: 'light-dark(#d7dad7, #333632)',
	dividerSubtle: 'light-dark(#e7ebe7, #272926)',
	border: 'light-dark(#cccfcc, #383a36)',
	borderActive: 'light-dark(#babdba, #474a45)',
	borderShadow: 'light-dark(#0000001f, #00000080)',
	ring: 'light-dark(#a5a8a3, #5c625b)',
	main: 'light-dark(#898e87, #4c524a)',
	mainContrast: '#ffffff',
	theme: '#46a758',
	themeText: 'light-dark(#2a7e3b, #87e098)'
});

export const fonts = stylex.defineVars({
	ui: '"Inter Variable", sans-serif',
	serif: 'Cardo, "Iowan Old Style", Baskerville, "Times New Roman", serif'
});

export const typeScale = stylex.defineVars({
	tiny: '0.59375rem',
	caption: '0.6875rem',
	body: '0.8125rem',
	heading: '1.125rem',
	tinyLine: '0.75rem',
	captionLine: '1rem',
	bodyLine: '1.25rem',
	headingLine: '1.5rem'
});

export const radius = stylex.defineVars({
	tiny: '0.09375rem',
	small: '0.1875rem',
	medium: '0.375rem',
	full: '999999px'
});

export const grid = stylex.defineVars({
	major: '2rem',
	minor: '0.5rem',
	detail: '0.25rem'
});

export const space = stylex.defineVars({
	2: '0.125rem',
	3: '0.1875rem',
	4: '0.25rem',
	6: '0.375rem',
	8: '0.5rem',
	12: '0.75rem',
	16: '1rem',
	20: '1.25rem',
	24: '1.5rem',
	32: '2rem',
	48: '3rem',
	64: '4rem'
});
