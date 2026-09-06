import { useLayoutEffect, useRef, useSyncExternalStore } from 'react';
import * as stylex from '@stylexjs/stylex';
import { PortfolioWidget } from './components/PortfolioWidget';
import { ProfileContent } from './components/ProfileContent';
import { portfolioItems } from './data/portfolio';
import { colors, grid, space } from './styles/tokens.stylex';
import { readTheme, serverTheme, subscribeTheme } from './theme';
import { snapCells, type PortfolioItem } from './types/portfolio';

const MOBILE = '@container portfolio (max-width: 64rem)';
const reveal = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const styles = stylex.create({
	root: {
		position: 'fixed',
		inset: 0,
		overflow: 'auto',
		containerType: 'inline-size',
		containerName: 'portfolio',
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: colors.background,
		color: colors.primary,
		animationName: { 'default': reveal, '@media (prefers-reduced-motion: reduce)': 'none' },
		animationDuration: '1s',
		animationTimingFunction: 'ease-in-out'
	},
	light: { colorScheme: 'light' },
	dark: { colorScheme: 'dark' },
	system: { colorScheme: 'light dark' },
	profileCanvas: {
		position: { default: 'absolute', [MOBILE]: 'relative' },
		inset: { default: 0, [MOBILE]: 'auto' },
		zIndex: 1,
		pointerEvents: 'none',
		flexShrink: 0
	},
	profile: {
		position: { default: 'absolute', [MOBILE]: 'relative' },
		insetInlineStart: { default: '42rem', [MOBILE]: 0 },
		insetBlockStart: { default: '38rem', [MOBILE]: 0 },
		width: { default: 'calc(64rem + 1px)', [MOBILE]: '100%' },
		height: { default: 'calc(22rem + 1px)', [MOBILE]: 'auto' },
		pointerEvents: 'auto'
	},
	viewport: {
		display: { default: 'contents', [MOBILE]: 'block' },
		minHeight: { default: 0, [MOBILE]: '67dvh' },
		overflow: { default: 'visible', [MOBILE]: 'auto' }
	},
	canvas: {
		position: 'relative',
		flexShrink: 0,
		backgroundImage: `linear-gradient(to right, color-mix(in srgb, ${colors.divider} 33%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, ${colors.divider} 33%, transparent) 1px, transparent 1px), linear-gradient(to right, color-mix(in srgb, ${colors.dividerSubtle} 33%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, ${colors.dividerSubtle} 33%, transparent) 1px, transparent 1px)`,
		backgroundSize: `${grid.major} ${grid.major}, ${grid.major} ${grid.major}, ${grid.minor} ${grid.minor}, ${grid.minor} ${grid.minor}`
	},
	dimensions: (width: number, height: number, smallWidth: number, smallHeight: number) => ({
		width: { default: `${width * 2 + 4}rem`, [MOBILE]: `${smallWidth * 2 + 4}rem` },
		height: { default: `${height * 2 + 4}rem`, [MOBILE]: `${smallHeight * 2 + 4}rem` }
	}),
	origin: { position: 'absolute', inset: space[32] }
});

function extent(items: readonly PortfolioItem[], small: boolean) {
	return items.reduce(
		(size, item) => {
			if (small ? item.screens === 'large' : item.screens === 'small') return size;
			const position = small ? item.small : item;
			return {
				width: Math.max(
					size.width,
					snapCells(position.xCells) + Math.max(0.25, snapCells(item.widthCells))
				),
				height: Math.max(
					size.height,
					snapCells(position.yCells) + Math.max(0.25, snapCells(item.heightCells))
				)
			};
		},
		{ width: 0, height: 0 }
	);
}

export function Portfolio({ items = portfolioItems }: { items?: readonly PortfolioItem[] }) {
	const profile = useRef<HTMLDivElement>(null);
	const theme = useSyncExternalStore(subscribeTheme, readTheme, serverTheme);
	const large = extent(items, false);
	const small = extent(items, true);
	useLayoutEffect(() => {
		profile.current?.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' });
	}, []);
	return (
		<main {...stylex.props(styles.root, styles[theme])}>
			<div {...stylex.props(styles.profileCanvas)}>
				<div {...stylex.props(styles.profile)} ref={profile}>
					<ProfileContent theme={theme} />
				</div>
			</div>
			<div {...stylex.props(styles.viewport)}>
				<div
					{...stylex.props(
						styles.canvas,
						styles.dimensions(large.width, large.height, small.width, small.height)
					)}
				>
					<div {...stylex.props(styles.origin)}>
						{items.map(({ id, content, ...placement }, index) => (
							<PortfolioWidget key={id} id={id} revealDelay={index * 75} {...placement}>
								{content}
							</PortfolioWidget>
						))}
					</div>
				</div>
			</div>
		</main>
	);
}
