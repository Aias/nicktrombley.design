import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { ui } from '../../styles/primitives';
import { colors, radius, space, typeScale } from '../../styles/tokens.stylex';
import { MockupIcon } from './MockupIcon';

export interface IconCatalogItem {
	id: string;
	name: string;
	code: string;
	description: string;
	asset: string;
}

export interface IconsProps {
	icons?: IconCatalogItem[];
	initialIconId?: string;
	onSelect?: (icon: IconCatalogItem) => void;
	onSearch?: (query: string) => void;
}

const iconNames = [
	'Filter',
	'Bed',
	'Calendar',
	'Hospital',
	'Monitor',
	'Horizontal Arrows',
	'Vertical Arrows',
	'Radiation',
	'Happy Face',
	'Calm Face',
	'Heart',
	'Controls',
	'Floppy Disk',
	'Medical Symbol',
	'Paperclip',
	'North East Arrow',
	'Sitting Person',
	'Botanical',
	'Group',
	'Banana',
	'Push Pin',
	'Health',
	'Lungs',
	'Bell',
	'Confetti',
	'Information',
	'People',
	'Pencil',
	'Test Tube',
	'Star',
	'Crutch',
	'Alert',
	'Network',
	'Walking Person',
	'Rod of Asclepius'
];

const defaultIcons: IconCatalogItem[] = iconNames.map((name, index) => ({
	id: `icon-${index}`,
	name,
	code: index === 34 ? 'ICO-102' : `ICO-${String(index + 68).padStart(3, '0')}`,
	description:
		index === 34
			? 'The commonly accepted symbol for medicine and health care, not to be confused with the similar caduceus, which has two snakes and a pair of wings.'
			: `${name} symbol for interface labels and data visualization.`,
	asset: `/mockup-icons/timelines/icon-${index}.svg`
}));

const styles = stylex.create({
	root: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		gap: space[8],
		padding: space[16]
	},
	search: {
		display: 'flex',
		alignItems: 'center',
		gap: space[8],
		height: space[32],
		paddingInline: space[8],
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: colors.border,
		borderRadius: radius.tiny,
		backgroundColor: colors.container,
		flexShrink: 0
	},
	searchInput: {
		'flex': '1',
		'minWidth': 0,
		'height': '100%',
		'padding': 0,
		'borderWidth': 0,
		'outlineWidth': 0,
		'backgroundColor': 'transparent',
		'color': colors.primary,
		'fontSize': typeScale.caption,
		'lineHeight': typeScale.captionLine,
		'::placeholder': { color: colors.ghost }
	},
	searchIcon: { width: space[16], height: space[16], flexShrink: 0 },
	grid: {
		display: 'grid',
		gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
		alignContent: 'start',
		flex: '1',
		minHeight: 0,
		overflow: 'auto'
	},
	iconButton: {
		display: 'grid',
		placeItems: 'center',
		minWidth: 0,
		aspectRatio: '1',
		padding: 0,
		boxShadow: `inset 0 0 0 0.5px ${colors.dividerSubtle}`,
		backgroundColor: { 'default': colors.container, ':hover': colors.tint },
		cursor: 'pointer'
	},
	iconButtonSelected: {
		backgroundColor: colors.paint,
		boxShadow: `inset 0 0 0 1px ${colors.ring}`
	},
	icon: { width: space[16], height: space[16] },
	details: {
		display: 'flex',
		flexDirection: 'column',
		gap: space[4],
		flexShrink: 0,
		minHeight: '2.75rem'
	},
	detailHeading: {
		display: 'flex',
		alignItems: 'flex-start',
		gap: space[8],
		minWidth: 0,
		fontSize: typeScale.caption,
		lineHeight: typeScale.captionLine
	},
	name: { flex: '1', minWidth: 0, fontWeight: 575 },
	code: { flexShrink: 0, color: colors.secondary, fontWeight: 475 },
	description: {
		display: '-webkit-box',
		overflow: 'hidden',
		color: colors.secondary,
		fontSize: typeScale.tiny,
		lineHeight: typeScale.tinyLine,
		WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 2
	},
	empty: {
		display: 'grid',
		placeItems: 'center',
		gridColumnStart: '1',
		gridColumnEnd: '-1',
		minHeight: space[64],
		textAlign: 'center'
	}
});

export function Icons({
	icons = defaultIcons,
	initialIconId = 'icon-34',
	onSelect,
	onSearch
}: IconsProps) {
	const [query, setQuery] = useState('');
	const [selectedId, setSelectedId] = useState(initialIconId);
	const normalizedQuery = query.trim().toLocaleLowerCase();
	const filteredIcons =
		normalizedQuery.length === 0
			? icons
			: icons.filter((icon) =>
					`${icon.name} ${icon.code}`.toLocaleLowerCase().includes(normalizedQuery)
				);
	const selectedIcon = icons.find((icon) => icon.id === selectedId) ?? filteredIcons[0] ?? null;
	return (
		<section {...stylex.props(ui.mockup, ui.panel, styles.root)}>
			<label {...stylex.props(styles.search)}>
				<input
					{...stylex.props(styles.searchInput)}
					type="search"
					placeholder="Search for an icon..."
					value={query}
					onChange={(event) => {
						setQuery(event.target.value);
						onSearch?.(event.target.value);
					}}
				/>
				<MockupIcon
					iconStyle={styles.searchIcon}
					src="/mockup-icons/timelines/Icons-imgMagnifyingGlass.svg"
				/>
			</label>
			<div {...stylex.props(styles.grid)}>
				{filteredIcons.map((icon) => (
					<button
						{...stylex.props(
							styles.iconButton,
							icon.id === selectedIcon?.id && styles.iconButtonSelected
						)}
						aria-label={icon.name}
						aria-pressed={icon.id === selectedIcon?.id}
						key={icon.id}
						onClick={() => {
							setSelectedId(icon.id);
							onSelect?.(icon);
						}}
					>
						<MockupIcon iconStyle={styles.icon} src={icon.asset} />
					</button>
				))}
				{filteredIcons.length === 0 ? (
					<p {...stylex.props(ui.caption, ui.hint, styles.empty)}>No matching icons.</p>
				) : null}
			</div>
			<div {...stylex.props(styles.details)} aria-live="polite">
				{selectedIcon === null ? (
					<p {...stylex.props(ui.caption, ui.hint)}>Select an icon.</p>
				) : (
					<>
						<div {...stylex.props(styles.detailHeading)}>
							<p {...stylex.props(styles.name, ui.truncate)}>{selectedIcon.name}</p>
							<p {...stylex.props(styles.code)}>{selectedIcon.code}</p>
						</div>
						<p {...stylex.props(styles.description)}>{selectedIcon.description}</p>
					</>
				)}
			</div>
		</section>
	);
}
