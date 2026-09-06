import { useEffect, useRef, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { hierarchy, treemap } from 'd3-hierarchy';
import { ui } from '../../styles/primitives';
import { colors, radius, space } from '../../styles/tokens.stylex';
import { MockupIcon } from './MockupIcon';

export interface TreemapItem {
	id: string;
	label: string;
	capacity: number;
	used: number;
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

function createItem(id: string, capacity: number, used: number): TreemapItem {
	return { id, label: id, capacity, used };
}

const defaultGroups: TreemapGroup[] = [
	{
		id: 'firewall',
		label: 'Palo Alto Firewalls',
		items: [
			createItem('edge-fw-01', 128_000, 110_080),
			createItem('edge-fw-02', 96_000, 58_560),
			createItem('dmz-fw-01', 48_000, 35_520),
			createItem('corp-fw-01', 24_000, 10_080),
			createItem('branch-fw-01', 12_000, 3_480),
			createItem('lab-fw-01', 6_000, 5_520)
		]
	},
	{
		id: 'linux',
		label: 'Linux Hosts',
		items: [
			createItem('api-prod-01', 64_000, 49_920),
			createItem('api-prod-02', 48_000, 32_160),
			createItem('auth-prod-01', 24_000, 21_120),
			createItem('worker-01', 12_000, 6_240),
			createItem('bastion-01', 6_000, 2_100),
			createItem('dns-01', 3_000, 2_100)
		]
	},
	{
		id: 'security',
		label: 'Security',
		items: [
			createItem('edr-gateway', 48_000, 44_640),
			createItem('ids-core-01', 32_000, 25_920),
			createItem('vpn-gateway', 16_000, 9_280),
			createItem('waf-edge-01', 8_000, 3_680),
			createItem('dlp-sensor-01', 4_000, 2_760)
		]
	},
	{
		id: 'system',
		label: 'System Services',
		items: [
			createItem('core-collector', 48_000, 30_240),
			createItem('metrics-01', 24_000, 17_280),
			createItem('audit-01', 12_000, 4_680),
			createItem('scheduler-01', 6_000, 5_040),
			createItem('config-01', 3_000, 1_530),
			createItem('ntp-01', 2_000, 520)
		]
	},
	{
		id: 'router',
		label: 'Cisco Routers',
		items: [
			createItem('core-rtr-01', 64_000, 45_440),
			createItem('core-rtr-02', 32_000, 18_240),
			createItem('edge-rtr-01', 16_000, 14_240),
			createItem('wan-rtr-01', 8_000, 3_520),
			createItem('branch-rtr-01', 4_000, 3_040),
			createItem('lab-rtr-01', 2_000, 660)
		]
	}
];

const compactNumber = new Intl.NumberFormat('en-US', {
	notation: 'compact',
	maximumFractionDigits: 1
});
const exactNumber = new Intl.NumberFormat('en-US');
const percentNumber = new Intl.NumberFormat('en-US', {
	style: 'percent',
	maximumFractionDigits: 0
});

function getCapacity(item: TreemapItem) {
	return Number.isFinite(item.capacity) ? Math.max(0, item.capacity) : 0;
}

function getUsed(item: TreemapItem) {
	return Number.isFinite(item.used) ? Math.max(0, item.used) : 0;
}

function getUtilization(item: TreemapItem) {
	const capacity = getCapacity(item);
	return capacity > 0 ? getUsed(item) / capacity : 0;
}

function formatRate(value: number) {
	return `${compactNumber.format(value)} events/s`;
}

function formatDetails(item: TreemapItem, group: TreemapGroup) {
	const capacity = getCapacity(item);
	const used = getUsed(item);
	return `${group.label}, ${item.label}. Capacity ${exactNumber.format(capacity)} events per second. Used ${exactNumber.format(used)} events per second. Utilization ${percentNumber.format(getUtilization(item))}.`;
}

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
		zIndex: 1,
		top: space[6],
		left: space[6],
		right: space[6],
		display: 'flex',
		justifyContent: 'space-between',
		gap: space[8],
		color: colors.accent,
		fontWeight: 550,
		pointerEvents: 'none'
	},
	labelText: { minWidth: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' },
	labelValue: { flexShrink: 0 },
	position: (x: number, y: number, width: number, height: number) => ({
		left: `${x}rem`,
		top: `${y}rem`,
		width: `${Math.max(0, width)}rem`,
		height: `${Math.max(0, height)}rem`
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
		left: space[6],
		right: space[6],
		display: 'flex',
		justifyContent: 'space-between',
		gap: space[4],
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
		color: colors.primary,
		cursor: 'pointer',
		outline: 'none'
	},
	intensity: (amount: number) => ({
		backgroundColor: {
			'default': `color-mix(in srgb, ${colors.component}, ${colors.main} ${amount}%)`,
			':hover': `color-mix(in srgb, ${colors.component}, ${colors.main} ${Math.min(44, amount + 6)}%)`,
			':focus-visible': `color-mix(in srgb, ${colors.component}, ${colors.main} ${Math.min(44, amount + 6)}%)`
		}
	}),
	selected: {
		borderWidth: 1,
		borderColor: colors.primary,
		boxShadow: `inset 0 0 0 1px ${colors.container}`
	},
	itemContent: {
		display: 'flex',
		width: '100%',
		minWidth: 0,
		flexDirection: 'column',
		alignItems: 'center',
		paddingInline: space[4],
		textAlign: 'center'
	},
	itemName: {
		display: 'block',
		width: '100%',
		overflow: 'hidden',
		whiteSpace: 'nowrap',
		textOverflow: 'ellipsis',
		fontWeight: 550
	},
	itemRate: {
		display: 'block',
		width: '100%',
		overflow: 'hidden',
		whiteSpace: 'nowrap',
		textOverflow: 'ellipsis'
	},
	empty: {
		position: 'absolute',
		inset: '1.5rem 0 0',
		display: 'grid',
		placeItems: 'center'
	}
});

export function Treemap({
	title = 'System Capacity',
	collectionLabel = 'Production Log Ingestion',
	groups = defaultGroups,
	onSelect
}: TreemapProps) {
	const [sortMode, setSortMode] = useState<'source' | 'capacity'>('source');
	const [selectedKey, setSelectedKey] = useState('');
	const mapRef = useRef<HTMLDivElement>(null);
	const [size, setSize] = useState({ width: 0, height: 0 });
	useEffect(() => {
		const map = mapRef.current;
		if (!map) return undefined;
		const observer = new ResizeObserver(([entry]) => {
			if (!entry) return;
			const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
			if (!Number.isFinite(rootFontSize) || rootFontSize <= 0) return;
			const width = Math.max(0, entry.contentRect.width / rootFontSize);
			const height = Math.max(0, entry.contentRect.height / rootFontSize);
			if (!Number.isFinite(width) || !Number.isFinite(height)) return;
			setSize((current) =>
				current.width === width && current.height === height ? current : { width, height }
			);
		});
		observer.observe(map);
		return () => observer.disconnect();
	}, []);
	const data = hierarchy<TreemapNode>({ groups }, (node) => {
		if ('groups' in node)
			return node.groups.filter((group) => group.items.some((item) => getCapacity(item) > 0));
		if ('items' in node) return node.items.filter((item) => getCapacity(item) > 0);
		return undefined;
	}).sum((node) => ('capacity' in node ? getCapacity(node) : 0));
	if (sortMode === 'capacity')
		data.sort((first, second) => (second.value ?? 0) - (first.value ?? 0));
	const layout = treemap<TreemapNode>()
		.size([size.width, size.height])
		.paddingOuter(0.25)
		.paddingTop((node) => (node.depth === 0 ? 1.5 : 1.125))
		.paddingInner((node) => (node.depth === 0 ? 0.25 : 0.125))(data);
	const totalCapacity = data.value ?? 0;

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
						value={sortMode}
						aria-label="Sort treemap"
						onChange={(event) =>
							setSortMode(event.currentTarget.value === 'capacity' ? 'capacity' : 'source')
						}
					>
						<option value="source">Source order</option>
						<option value="capacity">Capacity order</option>
					</select>
				</label>
			</header>
			<div {...stylex.props(styles.map)} ref={mapRef}>
				<p {...stylex.props(ui.tiny, styles.collectionLabel)}>
					<span {...stylex.props(styles.labelText)}>{collectionLabel}</span>
					<span {...stylex.props(styles.labelValue)}>{formatRate(totalCapacity)}</span>
				</p>
				{totalCapacity > 0 ? (
					layout.children?.map((groupRect) => {
						const group = groupRect.data;
						if (!('items' in group) || !groupRect.value) return null;
						const groupWidth = groupRect.x1 - groupRect.x0;
						const groupHeight = groupRect.y1 - groupRect.y0;
						return (
							<section
								key={group.id}
								{...stylex.props(
									styles.group,
									styles.position(groupRect.x0, groupRect.y0, groupWidth, groupHeight)
								)}
							>
								<h3 {...stylex.props(ui.tiny, styles.groupLabel)}>
									<span {...stylex.props(styles.labelText)}>{group.label}</span>
									<span {...stylex.props(styles.labelValue)}>{formatRate(groupRect.value)}</span>
								</h3>
								{groupRect.children?.map((itemRect) => {
									const item = itemRect.data;
									if (!('capacity' in item)) return null;
									const key = `${group.id}:${item.id}`;
									const width = itemRect.x1 - itemRect.x0;
									const height = itemRect.y1 - itemRect.y0;
									const utilization = getUtilization(item);
									const intensity = 8 + Math.min(1, utilization) * 32;
									const details = formatDetails(item, group);
									const showName = width >= 2.25 && height >= 0.875;
									const showRate = width >= 3 && height >= 1.625;
									return (
										<button
											type="button"
											key={key}
											title={details}
											{...stylex.props(
												ui.tiny,
												styles.item,
												styles.position(
													itemRect.x0 - groupRect.x0,
													itemRect.y0 - groupRect.y0,
													width,
													height
												),
												styles.intensity(intensity),
												selectedKey === key && styles.selected
											)}
											aria-label={details}
											aria-pressed={selectedKey === key}
											onClick={() => {
												setSelectedKey(key);
												onSelect?.(item, group);
											}}
										>
											{showName ? (
												<span {...stylex.props(styles.itemContent)}>
													<span {...stylex.props(styles.itemName)}>{item.label}</span>
													{showRate ? (
														<span {...stylex.props(styles.itemRate)}>
															{formatRate(getCapacity(item))}
														</span>
													) : null}
												</span>
											) : null}
										</button>
									);
								})}
							</section>
						);
					})
				) : (
					<p {...stylex.props(ui.caption, ui.hint, styles.empty)}>No capacity data</p>
				)}
			</div>
		</section>
	);
}
