import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { ui } from '../../styles/primitives';
import { colors, radius, space, typeScale } from '../../styles/tokens.stylex';
import { MockupIcon } from './MockupIcon';

export interface PatternProps {
	number?: number;
	title?: string;
	problem?: string;
	solution?: string;
	links?: string[];
	initialRating?: number;
	panes?: { rows: number; columns: number };
	onRatingChange?: (rating: number) => void;
	onLinkSelect?: (link: string) => void;
}

const defaultProblem =
	'When plate glass windows became possible, people thought that they would put us more directly in touch with nature. In fact, they do the opposite.';
const defaultSolution =
	'Divide each window into small panes. These panes can be very small indeed, and should hardly ever be more than a foot square. To get the exact size of the panes, divide the width and height of the window by the number of panes. Then each window will have different sized panes according to its height and width.';

function Pane({ rows, columns, offset }: { rows: number; columns: number; offset: number }) {
	const safeRows = Math.max(1, Math.floor(rows));
	const safeColumns = Math.max(1, Math.floor(columns));
	const lines = [];
	for (let row = 1; row < safeRows; row += 1)
		lines.push(
			<line
				key={`r-${row}`}
				x1={offset}
				y1={8 + (row / safeRows) * 34}
				x2={offset + 34}
				y2={8 + (row / safeRows) * 34}
			/>
		);
	for (let column = 1; column < safeColumns; column += 1)
		lines.push(
			<line
				key={`c-${column}`}
				x1={offset + (column / safeColumns) * 34}
				y1="8"
				x2={offset + (column / safeColumns) * 34}
				y2="42"
			/>
		);
	return (
		<g>
			<rect x={offset} y="8" width="34" height="34" rx="3" />
			{lines}
		</g>
	);
}

function PatternSection({ label, text }: { label: string; text: string }) {
	const [expanded, setExpanded] = useState(true);
	return (
		<section {...stylex.props(styles.section)}>
			<button
				{...stylex.props(styles.sectionToggle)}
				aria-expanded={expanded}
				onClick={() => setExpanded(!expanded)}
			>
				<span>{label}</span>
				<MockupIcon
					src="/mockup-icons/charts/Pattern/imgChevronDown.svg"
					iconStyle={[styles.sectionIcon, !expanded && styles.sectionIconCollapsed]}
				/>
			</button>
			{expanded ? <p {...stylex.props(ui.tiny, styles.sectionText)}>{text}</p> : null}
		</section>
	);
}

export function Pattern({
	number = 239,
	title = 'Small Panes',
	problem = defaultProblem,
	solution = defaultSolution,
	links = ['Half-Inch Trim', 'Filtered Light'],
	initialRating = 2,
	panes = { rows: 3, columns: 3 },
	onRatingChange,
	onLinkSelect
}: PatternProps) {
	const [rating, setRating] = useState(Math.max(0, Math.min(2, initialRating)));
	const [selectedLink, setSelectedLink] = useState('');
	return (
		<article {...stylex.props(ui.mockup, ui.panel, styles.root)}>
			<header {...stylex.props(styles.header)}>
				<span {...stylex.props(styles.titleGroup)}>
					<span {...stylex.props(ui.secondary)}>#{number}</span>
					<h2 {...stylex.props(ui.title, ui.truncate, styles.grow)}>{title}</h2>
				</span>
				<span {...stylex.props(styles.rating)}>
					{[1, 2].map((value) => (
						<button
							key={value}
							{...stylex.props(
								styles.star,
								value <= rating ? styles.starActive : styles.starInactive
							)}
							aria-label={`Rate ${value} out of 2`}
							aria-pressed={value <= rating}
							onClick={() => {
								const next = value === rating ? value - 1 : value;
								setRating(next);
								onRatingChange?.(next);
							}}
						>
							<MockupIcon
								src="/mockup-icons/charts/Pattern/imgStarfilled.svg"
								iconStyle={styles.starIcon}
							/>
						</button>
					))}
				</span>
			</header>
			<div {...stylex.props(styles.illustration)}>
				<svg
					{...stylex.props(styles.panes)}
					viewBox="0 0 168 50"
					aria-label={`Four windows divided into ${panes.rows} by ${panes.columns} panes`}
				>
					<title>{`Four windows divided into ${panes.rows} by ${panes.columns} panes`}</title>
					<Pane rows={panes.rows} columns={panes.columns} offset={1} />
					<Pane rows={panes.rows} columns={panes.columns} offset={45} />
					<Pane rows={panes.rows} columns={panes.columns} offset={89} />
					<Pane rows={panes.rows} columns={panes.columns} offset={133} />
				</svg>
			</div>
			<PatternSection label="Problem" text={problem} />
			<PatternSection label="Solution" text={solution} />
			<div {...stylex.props(styles.divider)} />
			<footer {...stylex.props(styles.links)}>
				<MockupIcon src="/mockup-icons/charts/Pattern/imgLink2.svg" iconStyle={styles.linkIcon} />
				{links.map((link) => (
					<button
						key={link}
						{...stylex.props(ui.tiny, styles.chip, selectedLink === link && styles.chipSelected)}
						onClick={() => {
							setSelectedLink(link);
							onLinkSelect?.(link);
						}}
						aria-pressed={selectedLink === link}
					>
						{link}
					</button>
				))}
			</footer>
		</article>
	);
}

const styles = stylex.create({
	root: { display: 'flex', flexDirection: 'column', gap: space[12], padding: space[12] },
	header: { display: 'flex', alignItems: 'center', gap: space[16], flexShrink: 0, minWidth: 0 },
	titleGroup: {
		display: 'flex',
		alignItems: 'center',
		flex: '1',
		minWidth: 0,
		gap: space[4],
		whiteSpace: 'nowrap'
	},
	grow: { flex: '1' },
	rating: { display: 'flex', flexShrink: 0, gap: space[2] },
	star: {
		display: 'inline-flex',
		width: space[12],
		height: space[12],
		padding: 0,
		borderWidth: 0,
		backgroundColor: 'transparent',
		color: colors.symbol,
		cursor: 'pointer'
	},
	starActive: { opacity: 1 },
	starInactive: { opacity: 0.2 },
	starIcon: { width: space[12], height: space[12] },
	illustration: {
		display: 'flex',
		flex: '1',
		minHeight: space[48],
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden',
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: colors.border,
		borderRadius: radius.small,
		backgroundColor: colors.background,
		color: colors.divider
	},
	panes: {
		display: 'block',
		width: 'calc(100% - 1rem)',
		maxHeight: '100%',
		stroke: 'currentColor',
		fill: colors.container,
		strokeWidth: 0.75
	},
	section: { display: 'flex', flexDirection: 'column', gap: space[4], flexShrink: 0, minHeight: 0 },
	sectionToggle: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
		padding: 0,
		borderWidth: 0,
		backgroundColor: 'transparent',
		color: colors.accent,
		fontSize: typeScale.caption,
		lineHeight: typeScale.captionLine,
		fontWeight: 575,
		textAlign: 'left',
		cursor: 'pointer'
	},
	sectionIcon: { width: space[12], height: space[12] },
	sectionIconCollapsed: { transform: 'rotate(-90deg)' },
	sectionText: {
		display: '-webkit-box',
		WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 2,
		maxHeight: space[24],
		overflow: 'hidden',
		color: colors.primary,
		textOverflow: 'ellipsis'
	},
	divider: {
		width: 'calc(100% + 1.5rem)',
		height: 1,
		flexShrink: 0,
		marginInline: '-0.75rem',
		backgroundColor: colors.divider
	},
	links: { display: 'flex', alignItems: 'center', flexShrink: 0, gap: '0.3125rem', minWidth: 0 },
	linkIcon: { width: space[12], height: space[12] },
	chip: {
		paddingBlock: space[2],
		paddingInline: space[4],
		borderWidth: 0,
		borderRadius: radius.tiny,
		backgroundColor: { 'default': colors.tone, ':hover': colors.paint },
		color: colors.primary,
		whiteSpace: 'nowrap',
		cursor: 'pointer'
	},
	chipSelected: { backgroundColor: colors.paint }
});
