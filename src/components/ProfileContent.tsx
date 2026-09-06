import * as stylex from '@stylexjs/stylex';
import { colors, fonts, space } from '../styles/tokens.stylex';
import type { Theme } from '../theme';
import { SiteIcon } from './SiteIcon';
import { ThemeToggle } from './ThemeToggle';

const MOBILE = '@container portfolio (max-width: 64rem)';
const styles = stylex.create({
	root: {
		position: 'relative',
		display: 'grid',
		gridTemplateColumns: { default: 'minmax(0, 1fr) 25rem', [MOBILE]: '1fr' },
		alignItems: 'center',
		gap: { default: space[32], [MOBILE]: space[24] },
		width: '100%',
		height: { default: '100%', [MOBILE]: 'auto' },
		paddingBlock: { default: '2.5rem', [MOBILE]: space[48] },
		paddingInline: { default: '3.5rem', [MOBILE]: space[32] },
		borderWidth: { default: 3, [MOBILE]: 0 },
		borderBottomWidth: 3,
		borderStyle: 'double',
		borderColor: colors.border,
		backgroundColor: colors.container,
		color: colors.primary,
		fontFamily: fonts.serif,
		fontSize: '1.25rem',
		lineHeight: space[32]
	},
	info: { display: { default: 'grid', [MOBILE]: 'contents' }, gap: space[32], minWidth: 0 },
	header: { minWidth: 0, textAlign: { default: 'start', [MOBILE]: 'center' } },
	name: {
		fontSize: '2.625rem',
		lineHeight: space[64],
		whiteSpace: 'nowrap',
		textOverflow: 'ellipsis',
		overflow: 'hidden'
	},
	tagline: { color: colors.secondary, fontStyle: 'italic' },
	links: {
		display: 'flex',
		flexDirection: { default: 'column', [MOBILE]: 'row' },
		flexWrap: 'wrap',
		justifyContent: { default: 'start', [MOBILE]: 'center' },
		columnGap: space[24]
	},
	nav: { order: { default: 0, [MOBILE]: 2 }, minWidth: 0 },
	link: {
		display: 'inline-flex',
		alignItems: 'center',
		gap: space[8],
		color: colors.themeText,
		textDecoration: 'underline',
		textUnderlineOffset: '0.125em'
	},
	statement: {
		display: 'flex',
		flexDirection: 'column',
		gap: space[32],
		minWidth: 0,
		textAlign: { default: 'justify', [MOBILE]: 'center' }
	},
	strong: { fontWeight: 700 },
	theme: { position: 'absolute', insetInlineEnd: space[16], insetBlockEnd: space[16] }
});

const links = [
	{
		href: 'https://barnsworthburning.net/creators/rec97tRUYZBhAs6rZ',
		label: 'Commonplace',
		icon: 'archive'
	},
	{ href: 'https://github.com/Aias', label: 'Github', icon: 'github' },
	{ href: 'https://www.linkedin.com/in/nick-trombley/', label: 'LinkedIn', icon: 'linkedin' },
	{ href: 'https://glass.photo/barnsworthburning', label: 'Photography', icon: 'camera' }
] satisfies { href: string; label: string; icon: 'archive' | 'github' | 'linkedin' | 'camera' }[];

export function ProfileContent({ theme }: { theme: Theme }) {
	return (
		<section {...stylex.props(styles.root)} aria-label="About Nicholas Trombley">
			<div {...stylex.props(styles.info)}>
				<header {...stylex.props(styles.header)}>
					<h1 {...stylex.props(styles.name)}>Nicholas Trombley</h1>
					<p {...stylex.props(styles.tagline)}>Digital designer-builder.</p>
				</header>
				<nav {...stylex.props(styles.nav)} aria-label="Find me online">
					<ul {...stylex.props(styles.links)}>
						{links.map((link) => (
							<li key={link.href}>
								<a
									{...stylex.props(styles.link)}
									href={link.href}
									target="_blank"
									rel="noopener noreferrer"
								>
									<SiteIcon name={link.icon} />
									{link.label}
								</a>
							</li>
						))}
					</ul>
				</nav>
			</div>
			<div {...stylex.props(styles.statement)}>
				<p {...stylex.props(styles.strong)}>
					Craft-driven creator of digital tools with a mind for information design, knowledge
					management, and systems thinking.
				</p>
				<p>
					Over a decade of experience building useful software at all scales, from enterprise-grade
					solutions to bespoke artifacts of the small, personal web. Currently at{' '}
					<a
						{...stylex.props(styles.link)}
						href="https://remark.ai/"
						target="_blank"
						rel="noopener noreferrer"
					>
						Remark
					</a>
					.
				</p>
			</div>
			<div {...stylex.props(styles.theme)}>
				<ThemeToggle theme={theme} />
			</div>
		</section>
	);
}
