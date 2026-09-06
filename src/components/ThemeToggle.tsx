import * as stylex from '@stylexjs/stylex';
import { colors, radius, space } from '../styles/tokens.stylex';
import { toggleTheme, type Theme } from '../theme';
import { SiteIcon } from './SiteIcon';

const styles = stylex.create({
	button: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: space[32],
		height: space[32],
		color: colors.accent,
		backgroundColor: { 'default': colors.tint, ':hover': colors.tone },
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: colors.border,
		borderRadius: radius.small
	},
	icon: { display: 'flex' },
	hidden: { display: 'none' },
	systemSun: { display: { 'default': 'flex', '@media (prefers-color-scheme: dark)': 'none' } },
	systemMoon: { display: { 'default': 'none', '@media (prefers-color-scheme: dark)': 'flex' } }
});

export function ThemeToggle({ theme }: { theme: Theme }) {
	return (
		<button
			{...stylex.props(styles.button)}
			type="button"
			aria-label="Toggle color theme"
			title="Toggle color theme"
			onClick={toggleTheme}
		>
			<span
				{...stylex.props(
					styles.icon,
					theme === 'dark' && styles.hidden,
					theme === 'system' && styles.systemSun
				)}
			>
				<SiteIcon name="sun" />
			</span>
			<span
				{...stylex.props(
					styles.icon,
					theme === 'light' && styles.hidden,
					theme === 'system' && styles.systemMoon
				)}
			>
				<SiteIcon name="moon" />
			</span>
		</button>
	);
}
