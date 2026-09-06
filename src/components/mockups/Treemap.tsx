import { useEffect, useRef, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { hierarchy, treemap } from 'd3-hierarchy';
import { ui } from '../../styles/primitives';
import { colors, radius, space } from '../../styles/tokens.stylex';
import { MockupIcon } from './MockupIcon';

export interface TreemapItem {
	id: string;
	label: string;
	value: number;
}

export interface TreemapGroup {
	id: string;
	label: string;
	items: TreemapItem[];
}

export interface TreemapProps {
	title?: string;
	collectionLabel?: string;
	groups?: TreemapGroup[];
	onSelect?: (item: TreemapItem, group: TreemapGroup) => void;
}

type TreemapNode = { groups: TreemapGroup[] } | TreemapGroup | TreemapItem;

const defaultGroups: TreemapGroup[] = [
	{
		id: 'firewall',
		label: 'Palo Alto Firewall',
		items: [408, 399, 82, 81, 75, 42, 15, 97].map((value, index) => ({
			id: `firewall-${index}`,
			label: String(value),
			value
		}))
	},
	{
		id: 'linux',
		label: 'Linux Hosts',
		items: [247, 202, 131, 109].map((value, index) => ({
			id: `linux-${index}`,
			label: String(value),
			value
		}))
	},
	{
		id: 'security',
		label: 'Security',
		items: [220, 220, 215, 75, 66].map((value, index) => ({
			id: `security-${index}`,
			label: String(value),
			value
		}))
	},
	{
		id: 'system',
		label: 'System',
		items: [102, 101, 97, 93, 85, 72, 57].map((value, index) => ({
			id: `system-${index}`,
			label: String(value),
			value
		}))
	},
	{
		id: 'router',
		label: 'Cisco Router',
		items: [174, 138, 106, 99].map((value, index) => ({
			id: `router-${index}`,
			label: String(value),
			value
		}))
	}
];

const styles = stylex.create({
	root: { display: 'flex', flexDirection: 'column', gap: space[8], padding: space[12] },
	header: { flexShrink: 0 },
	title: { flex: '1' },
	layoutControl: {
		position: 'relative',
		display: 'flex',
		flexShrink: 0,
		alignItems: 'center',
		gap: space[2]
	},
	caret: { width: '0.875rem', height: '0.875rem', flexShrink: 0, pointerEvents: 'none' },
	select: {
		appearance: 'none',
		height: space[20],
		paddingInline: 0,
		borderWidth: 0,
		backgroundColor: 'transparent',
		color: colors.accent,
		fontSize: '0.6875rem',
		lineHeight: '1rem',
		fontWeight: 475,
		cursor: 'pointer'
	},
	map: {
		position: 'relative',
		width: '100%',
		minHeight: 0,
		flex: '1',
		overflow: 'hidden',
		boxShadow: `inset 0 0 0 0.5px ${colors.border}`,
		borderRadius: radius.small,
		backgroundColor: colors.background
	},
	collectionLabel: {
		position: 'absolute',
		top: space[4],
		left: space[4],
		right: space[4],
		color: colors.accent,
		fontWeight: 550
	},
	position: (x: number, y: number, width: number, height: number) => ({
		left: `${x}rem`,
		top: `${y}rem`,
		width: `${width}rem`,
		height: `${height}rem`
	}),
	group: {
		position: 'absolute',
		minWidth: 0,
		minHeight: 0,
		overflow: 'hidden',
		boxShadow: `inset 0 0 0 0.5px ${colors.border}`,
		borderRadius: radius.small,
		backgroundColor: colors.background
	},
	groupLabel: {
		position: 'absolute',
		top: space[4],
		left: space[4],
		right: space[4],
		color: colors.accent
	},
	item: {
		position: 'absolute',
		display: 'flex',
		minWidth: 0,
		minHeight: 0,
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden',
		padding: 0,
		borderWidth: '0.5px',
		borderStyle: 'solid',
		borderColor: colors.divider,
		borderRadius: radius.tiny,
		backgroundColor: {
			'default': colors.component,
			':hover': colors.tone,
			':focus-visible': colors.tone
		},
		color: colors.accent,
		cursor: 'pointer',
		outline: 'none'
	},
	selected: { borderWidth: 1, borderColor: colors.borderActive, backgroundColor: colors.paint },
	itemLabel: { display: 'block', width: '100%', textAlign: 'center' }
});

export function Treemap({
	title = 'System Capacity',
	collectionLabel = 'Windows Heavy Collectors',
	groups = defaultGroups,
	onSelect
}: TreemapProps) {
	const [layoutMode, setLayoutMode] = useState<'treemap' | 'largest'>('treemap');
	const [selectedKey, setSelectedKey] = useState('');
	const mapRef = useRef<HTMLDivElement>(null);
	const [size, setSize] = useState({ width: 0, height: 0 });
	useEffect(() => {
		const map = mapRef.current;
		if (!map) return undefined;
		const observer = new ResizeObserver(([entry]) => {
			if (!entry) return;
			const rem = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
			const width = entry.contentRect.width / rem;
			const height = entry.contentRect.height / rem;
			setSize((current) =>
				current.width === width && current.height === height ? current : { width, height }
			);
		});
		observer.observe(map);
		return () => observer.disconnect();
	}, []);
	const data = hierarchy<TreemapNode>({ groups }, (node) => {
		if ('groups' in node) return node.groups;
		if ('items' in node) return node.items.filter((item) => item.value > 0);
		return undefined;
	}).sum((node) => ('value' in node ? Math.max(0, node.value) : 0));
	if (layoutMode === 'largest')
		data.sort((first, second) => (second.value ?? 0) - (first.value ?? 0));
	const layout = treemap<TreemapNode>()
		.size([size.width, size.height])
		.paddingOuter(0.25)
		.paddingTop(1.25)
		.paddingInner((node) => (node.depth === 0 ? 0.25 : 0.125))(data);

	return (
		<section {...stylex.props(ui.mockup, ui.panel, styles.root)} aria-label={title}>
			<header {...stylex.props(ui.row, styles.header)}>
				<h2 {...stylex.props(ui.title, ui.truncate, styles.title)}>{title}</h2>
				<label {...stylex.props(styles.layoutControl)}>
					<MockupIcon
						src="/mockup-icons/charts/Treemap/imgCaretSort.svg"
						iconStyle={styles.caret}
					/>
					<select
						{...stylex.props(styles.select)}
						value={layoutMode}
						aria-label="Treemap layout"
						onChange={(event) =>
							setLayoutMode(event.currentTarget.value === 'largest' ? 'largest' : 'treemap')
						}
					>
						<option value="treemap">Treemap</option>
						<option value="largest">Largest first</option>
					</select>
				</label>
			</header>
			<div {...stylex.props(styles.map)} ref={mapRef}>
				<p {...stylex.props(ui.tiny, ui.truncate, styles.collectionLabel)}>{collectionLabel}</p>
				{layout.children?.map((groupRect) => {
					const group = groupRect.data;
					if (!('items' in group) || !groupRect.value) return null;
					return (
						<section
							key={group.id}
							{...stylex.props(
								styles.group,
								styles.position(
									groupRect.x0,
									groupRect.y0,
									groupRect.x1 - groupRect.x0,
									groupRect.y1 - groupRect.y0
								)
							)}
						>
							<h3 {...stylex.props(ui.tiny, ui.truncate, styles.groupLabel)}>{group.label}</h3>
							{groupRect.children?.map((itemRect) => {
								const item = itemRect.data;
								if (!('value' in item)) return null;
								const key = `${group.id}:${item.id}`;
								return (
									<button
										type="button"
										key={key}
										title={`${group.label}: ${item.label} (${item.value.toLocaleString()})`}
										{...stylex.props(
											ui.tiny,
											styles.item,
											styles.position(
												itemRect.x0 - groupRect.x0,
												itemRect.y0 - groupRect.y0,
												itemRect.x1 - itemRect.x0,
												itemRect.y1 - itemRect.y0
											),
											selectedKey === key && styles.selected
										)}
										aria-pressed={selectedKey === key}
										onClick={() => {
											setSelectedKey(key);
											onSelect?.(item, group);
										}}
									>
										<span {...stylex.props(ui.truncate, styles.itemLabel)}>{item.label}</span>
									</button>
								);
							})}
						</section>
					);
				})}
			</div>
		</section>
	);
}
