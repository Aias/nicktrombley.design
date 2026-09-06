import * as stylex from '@stylexjs/stylex';
import { scrollEdges } from './scroll-fade.stylex';
import { colors, fonts, radius, space, typeScale } from './tokens.stylex';

const fadeTop = stylex.keyframes({
	from: { [scrollEdges['--scroll-fade-top']]: '0px' },
	to: { [scrollEdges['--scroll-fade-top']]: `min(18%, calc(${space[24]} * 1.5))` }
});
const fadeBottom = stylex.keyframes({
	from: { [scrollEdges['--scroll-fade-bottom']]: `min(18%, calc(${space[24]} * 1.5))` },
	to: { [scrollEdges['--scroll-fade-bottom']]: '0px' }
});
const fadeLeft = stylex.keyframes({
	from: { [scrollEdges['--scroll-fade-left']]: '0px' },
	to: { [scrollEdges['--scroll-fade-left']]: `min(18%, calc(${space[24]} * 1.5))` }
});
const fadeRight = stylex.keyframes({
	from: { [scrollEdges['--scroll-fade-right']]: `min(18%, calc(${space[24]} * 1.5))` },
	to: { [scrollEdges['--scroll-fade-right']]: '0px' }
});

export const ui = stylex.create({
	scrollFade: {
		'--scroll-fade-top': '0px',
		'--scroll-fade-bottom': '0px',
		'--scroll-fade-left': '0px',
		'--scroll-fade-right': '0px',
		'maskImage': `linear-gradient(to bottom, transparent, black ${scrollEdges['--scroll-fade-top']}, black calc(100% - ${scrollEdges['--scroll-fade-bottom']}), transparent), linear-gradient(to right, transparent, black ${scrollEdges['--scroll-fade-left']}, black calc(100% - ${scrollEdges['--scroll-fade-right']}), transparent)`,
		'maskComposite': 'intersect',
		'maskRepeat': 'no-repeat',
		'animationName': {
			'default': 'none',
			'@supports (animation-timeline: scroll())': `${fadeTop}, ${fadeBottom}, ${fadeLeft}, ${fadeRight}`
		},
		'animationDuration': '1ms',
		'animationTimingFunction': 'ease-in-out',
		'animationFillMode': 'both',
		'animationTimeline': 'scroll(self y), scroll(self y), scroll(self x), scroll(self x)',
		'animationRange': `0 calc(${space[48]} * 2), calc(100% - ${space[48]} * 2) 100%, 0 calc(${space[48]} * 2), calc(100% - ${space[48]} * 2) 100%`
	},
	mockup: {
		width: '100%',
		height: '100%',
		minWidth: 0,
		minHeight: 0,
		overflow: 'hidden',
		fontFamily: fonts.ui,
		fontSize: typeScale.body,
		lineHeight: typeScale.bodyLine,
		fontWeight: 400,
		fontVariantNumeric: 'tabular-nums lining-nums',
		letterSpacing: 0,
		color: colors.primary
	},
	panel: {
		borderInlineEndWidth: 1,
		borderBlockEndWidth: 1,
		borderStyle: 'solid',
		borderColor: colors.divider,
		backgroundColor: colors.container,
		borderRadius: radius.medium,
		outlineWidth: 1,
		outlineStyle: 'solid',
		outlineColor: colors.divider,
		outlineOffset: -1
	},
	title: { fontSize: typeScale.body, lineHeight: typeScale.bodyLine, fontWeight: 550 },
	caption: { fontSize: typeScale.caption, lineHeight: typeScale.captionLine },
	tiny: { fontSize: typeScale.tiny, lineHeight: typeScale.tinyLine },
	heading: { fontSize: typeScale.heading, lineHeight: typeScale.headingLine, fontWeight: 375 },
	secondary: { color: colors.secondary },
	hint: { color: colors.hint },
	truncate: { minWidth: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' },
	row: { display: 'flex', alignItems: 'center', minWidth: 0, gap: space[8] },
	button: {
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: space[4],
		minWidth: 0,
		height: space[24],
		paddingInline: space[8],
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: colors.border,
		borderRadius: radius.small,
		backgroundColor: { 'default': colors.container, ':hover': colors.tint },
		color: colors.accent,
		fontSize: typeScale.caption,
		lineHeight: typeScale.captionLine,
		whiteSpace: 'nowrap',
		cursor: 'pointer'
	},
	input: {
		width: '100%',
		minWidth: 0,
		height: space[24],
		paddingInline: space[6],
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: colors.border,
		borderRadius: radius.tiny,
		backgroundColor: colors.container,
		color: colors.accent,
		fontSize: typeScale.caption,
		lineHeight: typeScale.captionLine
	}
});
