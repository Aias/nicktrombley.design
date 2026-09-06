import { useState, type ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '../styles/tokens.stylex';
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
		transitionProperty: 'opacity',
		transitionDuration: '0.3s',
		transitionTimingFunction: 'ease'
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

const activeTheme = stylex.createTheme(colors, {
	primary: 'light-dark(#203c25, #c2f0c2)',
	secondary: 'light-dark(#2a7e3b, #71d083)',
	hint: 'light-dark(#3e9b4f, #53b365)',
	ghost: '#46a758',
	accent: 'light-dark(#2a7e3b, #71d083)',
	symbol: 'light-dark(#2a7e3b, #71d083)',
	background: 'light-dark(#fbfefb, #0e1511)',
	container: 'light-dark(#f5fbf5, #141a15)',
	component: 'light-dark(#e9f6e9, #1b2a1e)',
	tint: 'light-dark(#0099000a, #5ef7780a)',
	tone: 'light-dark(#00970016, #70fe8c1b)',
	paint: 'light-dark(#009f0725, #57ff802c)',
	divider: 'light-dark(#c9e8ca, #25482d)',
	dividerSubtle: 'light-dark(#daf1db, #1d3a24)',
	border: 'light-dark(#b2ddb5, #2d5736)',
	borderActive: 'light-dark(#65ba74, #3e7949)',
	ring: '#46a758',
	main: '#46a758',
	theme: '#46a758',
	themeText: 'light-dark(#2a7e3b, #71d083)'
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
				(hovered || focused) && activeTheme
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
