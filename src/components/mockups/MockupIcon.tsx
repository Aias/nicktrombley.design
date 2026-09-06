import * as stylex from '@stylexjs/stylex';
import { colors } from '../../styles/tokens.stylex';

const styles = stylex.create({
	icon: {
		'display': 'block',
		'flexShrink': 0,
		'width': '1rem',
		'height': '1rem',
		'color': colors.symbol,
		'--icon-accent': colors.accent,
		'--icon-component': colors.component,
		'--icon-ghost': colors.ghost,
		'--icon-hint': colors.hint
	}
});

export function MockupIcon({ src, iconStyle }: { src: string; iconStyle?: stylex.StyleXStyles }) {
	return (
		<svg {...stylex.props(styles.icon, iconStyle)} aria-hidden="true">
			<use href={src} width="100%" height="100%" />
		</svg>
	);
}
