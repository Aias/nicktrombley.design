import * as stylex from '@stylexjs/stylex';
import { colors, fonts, radius, space, typeScale } from './tokens.stylex';

export const ui = stylex.create({
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
