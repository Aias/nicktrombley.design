import { useState, type ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors, widgetChroma } from '../styles/tokens.stylex';
import { gridSize, snapCells, type GridPlacement } from '../types/portfolio';

const MOBILE = '@container portfolio (max-width: 64rem)';
const reveal = stylex.keyframes({
	from: { opacity: 0, filter: 'blur(5px)' },
	to: { filter: 'blur(0)' }
});

const styles = stylex.create({
	root: {
		position: 'absolute',
		minWidth: 0,
		minHeight: 0,
		opacity: { 'default': 0.75, ':hover': 1, ':focus-within': 1, [MOBILE]: 1 },
		animationName: { 'default': reveal, '@media (prefers-reduced-motion: reduce)': 'none' },
		animationDuration: '2s',
		animationTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)',
		animationFillMode: 'backwards',
		transitionProperty: 'opacity, --portfolio-widget-chroma',
		transitionDuration: '0.3s, 0.2s',
		transitionTimingFunction: 'ease, ease-in-out'
	},
	delay: (milliseconds: number) => ({ animationDelay: `${milliseconds}ms` }),
	placement: (
		x: number,
		y: number,
		smallX: number,
		smallY: number,
		width: string,
		height: string
	) => ({
		insetInlineStart: { default: `${x * 2}rem`, [MOBILE]: `${smallX * 2}rem` },
		insetBlockStart: { default: `${y * 2}rem`, [MOBILE]: `${smallY * 2}rem` },
		width: `calc(${width} + 1px)`,
		height: `calc(${height} + 1px)`
	}),
	large: { display: { default: 'block', [MOBILE]: 'none' } },
	small: { display: { default: 'none', [MOBILE]: 'block' } }
});

const transitioningTheme = stylex.createTheme(colors, {
	primary: `color-mix(in srgb, light-dark(#1d211c, #eef0ee), light-dark(#203c25, #c2f0c2) ${widgetChroma['--portfolio-widget-chroma']})`,
	secondary: `color-mix(in srgb, light-dark(#686e67, #a9ada8), light-dark(#2a7e3b, #71d083) ${widgetChroma['--portfolio-widget-chroma']})`,
	hint: `color-mix(in srgb, light-dark(#8d918c, #767d74), light-dark(#3e9b4f, #53b365) ${widgetChroma['--portfolio-widget-chroma']})`,
	ghost: `color-mix(in srgb, light-dark(#b0b3af, #5c625b), #46a758 ${widgetChroma['--portfolio-widget-chroma']})`,
	accent: `color-mix(in srgb, light-dark(#464d45, #cad4c7), light-dark(#2a7e3b, #71d083) ${widgetChroma['--portfolio-widget-chroma']})`,
	symbol: `color-mix(in srgb, light-dark(#717a6d, #899187), light-dark(#2a7e3b, #71d083) ${widgetChroma['--portfolio-widget-chroma']})`,
	background: `color-mix(in srgb, light-dark(#f8faf8, #111210), light-dark(#fbfefb, #0e1511) ${widgetChroma['--portfolio-widget-chroma']})`,
	container: `color-mix(in srgb, light-dark(#fcfdfc, #181917), light-dark(#f5fbf5, #141a15) ${widgetChroma['--portfolio-widget-chroma']})`,
	component: `color-mix(in srgb, light-dark(#f5f7f5, #212220), light-dark(#e9f6e9, #1b2a1e) ${widgetChroma['--portfolio-widget-chroma']})`,
	tint: `color-mix(in srgb, light-dark(#00490007, #f1f2f008), light-dark(#0099000a, #5ef7780a) ${widgetChroma['--portfolio-widget-chroma']})`,
	tone: `color-mix(in srgb, light-dark(#00200010, #f4f5f312), light-dark(#00970016, #70fe8c1b) ${widgetChroma['--portfolio-widget-chroma']})`,
	paint: `color-mix(in srgb, light-dark(#00180020, #f2fbf122), light-dark(#009f0725, #57ff802c) ${widgetChroma['--portfolio-widget-chroma']})`,
	divider: `color-mix(in srgb, light-dark(#d7dad7, #333632), light-dark(#c9e8ca, #25482d) ${widgetChroma['--portfolio-widget-chroma']})`,
	dividerSubtle: `color-mix(in srgb, light-dark(#e7ebe7, #272926), light-dark(#daf1db, #1d3a24) ${widgetChroma['--portfolio-widget-chroma']})`,
	border: `color-mix(in srgb, light-dark(#cccfcc, #383a36), light-dark(#b2ddb5, #2d5736) ${widgetChroma['--portfolio-widget-chroma']})`,
	borderActive: `color-mix(in srgb, light-dark(#babdba, #474a45), light-dark(#65ba74, #3e7949) ${widgetChroma['--portfolio-widget-chroma']})`,
	ring: `color-mix(in srgb, light-dark(#a5a8a3, #5c625b), #46a758 ${widgetChroma['--portfolio-widget-chroma']})`,
	main: `color-mix(in srgb, light-dark(#898e87, #4c524a), #46a758 ${widgetChroma['--portfolio-widget-chroma']})`,
	themeText: `color-mix(in srgb, light-dark(#2a7e3b, #87e098), light-dark(#2a7e3b, #71d083) ${widgetChroma['--portfolio-widget-chroma']})`
});

const activeChroma = stylex.createTheme(widgetChroma, {
	'--portfolio-widget-chroma': stylex.types.percentage('100%')
});

type PortfolioWidgetProps = GridPlacement & {
	id?: string;
	children: ReactNode;
	revealDelay?: number;
	screens?: 'large' | 'small' | 'all';
	small?: Pick<GridPlacement, 'xCells' | 'yCells'>;
};

export function PortfolioWidget({
	id,
	children,
	revealDelay = 0,
	xCells,
	yCells,
	widthCells,
	heightCells,
	screens = 'all',
	small = { xCells, yCells }
}: PortfolioWidgetProps) {
	const [hovered, setHovered] = useState(false);
	const [focused, setFocused] = useState(false);
	return (
		<div
			{...stylex.props(
				styles.root,
				styles.delay(revealDelay),
				styles.placement(
					snapCells(xCells),
					snapCells(yCells),
					snapCells(small.xCells),
					snapCells(small.yCells),
					gridSize(widthCells),
					gridSize(heightCells)
				),
				screens === 'large' && styles.large,
				screens === 'small' && styles.small,
				transitioningTheme,
				(hovered || focused) && activeChroma
			)}
			data-widget={id}
			onPointerEnter={() => setHovered(true)}
			onPointerLeave={() => setHovered(false)}
			onFocusCapture={() => setFocused(true)}
			onBlurCapture={(event) => {
				if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
			}}
		>
			{children}
		</div>
	);
}
