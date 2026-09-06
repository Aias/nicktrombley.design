import { useLayoutEffect, useRef, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { ui } from '../../styles/primitives';
import { colors, radius, space, typeScale } from '../../styles/tokens.stylex';
import { MockupIcon } from './MockupIcon';

export interface ActivityTimelineItem {
	id: string;
	label: string;
}

export interface ActivityTimelineGroup {
	id: string;
	label: string;
	items: ActivityTimelineItem[];
}

export interface ActivityTimelineEvent {
	id: string;
	time: number;
	fromId: string;
	toId?: string;
}

export interface ActivityTimelineProps {
	title?: string;
	groups?: ActivityTimelineGroup[];
	events?: ActivityTimelineEvent[];
	heatmap?: number[];
	labels?: string[];
	onSelectionChange?: (ids: string[]) => void;
	onInspect?: (id: string) => void;
}

const defaultGroups: ActivityTimelineGroup[] = [
	{
		id: 'authors',
		label: 'Authors',
		items: [
			{ id: 'lisa', label: 'Lisa Heschong' },
			{ id: 'ursula', label: 'Ursula Franklin' },
			{ id: 'hayao', label: 'Hayao Miyazaki' },
			{ id: 'robert', label: 'Robert Irwin' }
		]
	},
	{
		id: 'tags',
		label: 'Tags',
		items: [
			{ id: 'software', label: 'Software' },
			{ id: 'architecture', label: 'Architecture' },
			{ id: 'technology', label: 'Technology' }
		]
	},
	{
		id: 'categories',
		label: 'Categories',
		items: [
			{ id: 'reading', label: 'New Reading' },
			{ id: 'curation', label: 'Data Curation' }
		]
	},
	{
		id: 'activities',
		label: 'Activities',
		items: [
			{ id: 'brute-force', label: 'Brute Force' },
			{ id: 'runtime', label: 'Runtime Data Manipulation' }
		]
	}
];

const defaultEvents: ActivityTimelineEvent[] = [
	{ id: 'e1', time: 0.01, fromId: 'lisa', toId: 'technology' },
	{ id: 'e2', time: 0.05, fromId: 'ursula', toId: 'architecture' },
	{ id: 'e3', time: 0.09, fromId: 'lisa', toId: 'software' },
	{ id: 'e4', time: 0.11, fromId: 'hayao', toId: 'software' },
	{ id: 'e5', time: 0.14, fromId: 'ursula', toId: 'curation' },
	{ id: 'e6', time: 0.18, fromId: 'robert', toId: 'software' },
	{ id: 'e7', time: 0.25, fromId: 'ursula', toId: 'technology' },
	{ id: 'e8', time: 0.27, fromId: 'lisa', toId: 'reading' },
	{ id: 'e9', time: 0.34, fromId: 'technology', toId: 'runtime' },
	{ id: 'e10', time: 0.36, fromId: 'technology', toId: 'runtime' },
	{ id: 'e11', time: 0.47, fromId: 'architecture', toId: 'reading' },
	{ id: 'e12', time: 0.49, fromId: 'architecture', toId: 'curation' },
	{ id: 'e13', time: 0.66, fromId: 'software', toId: 'reading' },
	{ id: 'e14', time: 0.68, fromId: 'lisa', toId: 'technology' },
	{ id: 'e15', time: 0.71, fromId: 'ursula', toId: 'technology' },
	{ id: 'e16', time: 0.73, fromId: 'robert', toId: 'technology' },
	{ id: 'e17', time: 0.75, fromId: 'hayao', toId: 'technology' },
	{ id: 'e18', time: 0.78, fromId: 'ursula', toId: 'technology' },
	{ id: 'e19', time: 0.88, fromId: 'robert', toId: 'runtime' },
	{ id: 'e20', time: 0.94, fromId: 'technology', toId: 'reading' },
	{ id: 'e21', time: 0.96, fromId: 'technology', toId: 'reading' },
	{ id: 'e22', time: 0.98, fromId: 'technology', toId: 'runtime' },
	{ id: 'e23', time: 1, fromId: 'ursula', toId: 'runtime' }
];

const defaultHeatmap = [
	0.62, 0.35, 0.55, 0.38, 0.42, 0.48, 0.71, 0.31, 0.52, 0.26, 0.68, 0.47, 0.59, 0.21, 0.34, 0.41,
	0.45, 0.57, 0.38, 0.66, 0.29, 0.54, 0.33, 0.16, 0.08, 0.24, 0.37, 0.12, 0.18, 0.29, 0.07, 0.34,
	0.26, 0.09, 0.11, 0.14, 0.06, 0.38, 0.52, 0.22, 0.43, 0.08, 0.17, 0.25, 0.05, 0.35, 0.47, 0.18,
	0.31, 0.12, 0.09, 0.41, 0.55, 0.28, 0.36, 0.16
];

const styles = stylex.create({
	root: { display: 'flex', flexDirection: 'column', padding: space[16] },
	top: {
		display: 'grid',
		gridTemplateColumns: '10rem minmax(0, 1fr)',
		gap: space[16],
		height: '2.5rem',
		flexShrink: 0
	},
	titleControl: {
		display: 'flex',
		alignItems: 'center',
		gap: space[8],
		height: '2.5rem',
		paddingInline: space[16],
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: colors.dividerSubtle,
		borderRadius: radius.small,
		backgroundColor: { 'default': colors.tint, ':hover': colors.tone },
		color: colors.primary,
		cursor: 'pointer'
	},
	gear: { width: space[16], height: space[16], flexShrink: 0 },
	timelineHeader: {
		display: 'flex',
		flexDirection: 'column',
		gap: space[2],
		minWidth: 0
	},
	axis: {
		display: 'flex',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		height: '1.75rem',
		color: colors.secondary,
		fontSize: typeScale.caption,
		lineHeight: typeScale.captionLine
	},
	heatmap: {
		display: 'flex',
		alignItems: 'stretch',
		gap: 1,
		height: space[12],
		paddingInline: space[4],
		overflow: 'hidden'
	},
	heat: (opacity: number) => ({
		flex: '1',
		minWidth: 2,
		height: '100%',
		backgroundColor: colors.main,
		opacity
	}),
	body: {
		flex: '1',
		minHeight: 0,
		marginTop: '0.875rem',
		overflow: 'auto'
	},
	rows: {
		display: 'grid',
		gridTemplateColumns: '10rem minmax(0, 1fr)',
		gap: space[16],
		minHeight: '100%'
	},
	group: { display: 'flex', flexDirection: 'column', marginBottom: space[8] },
	groupHeading: {
		display: 'flex',
		alignItems: 'center',
		gap: space[4],
		width: '100%',
		height: space[20],
		padding: 0,
		borderWidth: 0,
		backgroundColor: { 'default': 'transparent', ':hover': colors.tint },
		color: colors.primary,
		fontSize: typeScale.caption,
		lineHeight: typeScale.captionLine,
		textAlign: 'left',
		cursor: 'pointer'
	},
	chevron: { width: space[12], height: space[12] },
	chevronClosed: { transform: 'rotate(180deg)' },
	entity: {
		display: 'flex',
		alignItems: 'center',
		gap: space[6],
		height: space[24],
		minWidth: 0
	},
	drag: { width: space[12], height: space[12], flexShrink: 0 },
	checkbox: {
		appearance: 'none',
		width: space[12],
		height: space[12],
		padding: 0,
		flexShrink: 0,
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: colors.border,
		borderRadius: radius.tiny,
		backgroundColor: { 'default': colors.container, ':hover': colors.tint },
		cursor: 'pointer'
	},
	checkboxActive: {
		backgroundColor: colors.component,
		borderColor: colors.accent
	},
	entityLabel: {
		flex: '1',
		minWidth: 0,
		fontSize: typeScale.caption,
		lineHeight: typeScale.captionLine
	},
	inspect: {
		display: 'grid',
		placeItems: 'center',
		width: space[16],
		height: space[16],
		padding: 0,
		flexShrink: 0,
		borderWidth: 0,
		backgroundColor: { 'default': 'transparent', ':hover': colors.tint },
		cursor: 'pointer'
	},
	inspectIcon: { width: '0.875rem', height: '0.875rem' },
	inspection: {
		position: 'sticky',
		zIndex: 2,
		top: space[8],
		marginTop: space[8],
		marginInlineStart: 'auto',
		marginInlineEnd: space[8],
		width: 'fit-content',
		display: 'flex',
		maxWidth: 'calc(100% - 1rem)',
		flexDirection: 'column',
		paddingBlock: space[4],
		paddingInline: space[8],
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: colors.borderActive,
		borderRadius: radius.small,
		backgroundColor: colors.container,
		boxShadow: `0 ${space[2]} ${space[6]} ${colors.borderShadow}`,
		pointerEvents: 'none'
	},
	inspectionTitle: {
		fontSize: typeScale.caption,
		lineHeight: typeScale.captionLine,
		fontWeight: 550
	},
	inspectionGroup: {
		color: colors.secondary,
		fontSize: typeScale.tiny,
		lineHeight: typeScale.tinyLine
	},
	chart: {
		position: 'relative',
		minWidth: 0,
		minHeight: 0,
		overflow: 'clip',
		borderLeftWidth: 1,
		borderLeftStyle: 'solid',
		borderLeftColor: colors.dividerSubtle
	},
	chartSvg: {
		position: 'absolute',
		insetBlock: 0,
		insetInline: space[4],
		width: `calc(100% - ${space[8]})`,
		height: '100%',
		overflow: 'visible'
	},
	gridLine: {
		stroke: colors.dividerSubtle,
		strokeWidth: 1,
		vectorEffect: 'non-scaling-stroke'
	},
	eventLine: {
		stroke: colors.main,
		strokeWidth: '0.125rem',
		opacity: 0.32,
		vectorEffect: 'non-scaling-stroke'
	},
	eventDot: { fill: colors.main },
	empty: { display: 'grid', placeItems: 'center', height: '100%' }
});

export function ActivityTimeline({
	title = 'Activity Graph',
	groups = defaultGroups,
	events = defaultEvents,
	heatmap = defaultHeatmap,
	labels = ['6pm', 'Aug 16', '6am', '12pm', '6pm'],
	onSelectionChange,
	onInspect
}: ActivityTimelineProps) {
	const rows = groups.flatMap((group) => group.items);
	const [excluded, setExcluded] = useState<string[]>([]);
	const [collapsed, setCollapsed] = useState<string[]>([]);
	const [inspectedId, setInspectedId] = useState<string>();
	const contentRef = useRef<HTMLDivElement>(null);
	const rowRefs = useRef(new Map<string, HTMLDivElement>());
	const [rowPositions, setRowPositions] = useState(new Map<string, number>());
	const selected = rows.filter((row) => !excluded.includes(row.id)).map((row) => row.id);
	const visibleEvents = events.filter(
		(event) =>
			selected.includes(event.fromId) && (event.toId === undefined || selected.includes(event.toId))
	);
	const inspectedItem = rows.find((row) => row.id === inspectedId);
	const inspectedGroup = groups.find((group) =>
		group.items.some((item) => item.id === inspectedId)
	);
	useLayoutEffect(() => {
		const content = contentRef.current;
		if (!content) return undefined;
		const measure = () => {
			const top = content.getBoundingClientRect().top;
			const positions = new Map<string, number>();
			for (const group of groups) {
				if (collapsed.includes(group.id)) continue;
				for (const row of group.items) {
					const element = rowRefs.current.get(row.id);
					if (!element) continue;
					const bounds = element.getBoundingClientRect();
					positions.set(row.id, bounds.top + bounds.height / 2 - top);
				}
			}
			setRowPositions((previous) =>
				previous.size === positions.size &&
				[...positions].every(([id, y]) => previous.get(id) === y)
					? previous
					: positions
			);
		};
		const observer = new ResizeObserver(measure);
		observer.observe(content);
		measure();
		return () => observer.disconnect();
	}, [groups, collapsed]);
	const toggleRow = (id: string) => {
		const nextExcluded = excluded.includes(id)
			? excluded.filter((value) => value !== id)
			: [...excluded, id];
		setExcluded(nextExcluded);
		onSelectionChange?.(rows.filter((row) => !nextExcluded.includes(row.id)).map((row) => row.id));
	};
	const toggleAll = () => {
		const nextExcluded = selected.length === rows.length ? rows.map((row) => row.id) : [];
		setExcluded(nextExcluded);
		onSelectionChange?.(nextExcluded.length === 0 ? rows.map((row) => row.id) : []);
	};
	return (
		<section {...stylex.props(ui.mockup, ui.panel, styles.root)}>
			<div {...stylex.props(styles.top)}>
				<button
					{...stylex.props(styles.titleControl)}
					aria-label="Toggle all activity filters"
					onClick={toggleAll}
				>
					<span {...stylex.props(ui.title, ui.truncate)}>{title}</span>
					<MockupIcon
						iconStyle={styles.gear}
						src="/mockup-icons/timelines/ActivityTimeline-imgGear.svg"
					/>
				</button>
				<div {...stylex.props(styles.timelineHeader)}>
					<div {...stylex.props(styles.axis)}>
						{labels.map((label, index) => (
							<span key={`${label}-${index}`}>{label}</span>
						))}
					</div>
					<div {...stylex.props(styles.heatmap)}>
						{heatmap.map((value, index) => (
							<span
								{...stylex.props(styles.heat(Math.max(0.05, Math.min(0.85, value))))}
								key={index}
							/>
						))}
					</div>
				</div>
			</div>
			<div {...stylex.props(ui.scrollFade, styles.body)}>
				<div {...stylex.props(styles.rows)} ref={contentRef}>
					<div>
						{groups.map((group) => {
							const isCollapsed = collapsed.includes(group.id);
							return (
								<section {...stylex.props(styles.group)} key={group.id}>
									<button
										{...stylex.props(styles.groupHeading)}
										aria-expanded={!isCollapsed}
										onClick={() =>
											setCollapsed(
												isCollapsed
													? collapsed.filter((id) => id !== group.id)
													: [...collapsed, group.id]
											)
										}
									>
										<span>{group.label}</span>
										<MockupIcon
											iconStyle={[styles.chevron, isCollapsed && styles.chevronClosed]}
											src="/mockup-icons/timelines/ActivityTimeline-imgChevronUp.svg"
										/>
									</button>
									{isCollapsed
										? null
										: group.items.map((item) => (
												<div
													{...stylex.props(styles.entity)}
													key={item.id}
													ref={(element) => {
														if (element) rowRefs.current.set(item.id, element);
														else rowRefs.current.delete(item.id);
													}}
												>
													<MockupIcon
														iconStyle={styles.drag}
														src="/mockup-icons/timelines/ActivityTimeline-imgDragHandleDots2.svg"
													/>
													<input
														{...stylex.props(
															styles.checkbox,
															selected.includes(item.id) && styles.checkboxActive
														)}
														type="checkbox"
														checked={selected.includes(item.id)}
														aria-label={`Toggle ${item.label}`}
														onChange={() => toggleRow(item.id)}
													/>
													<span {...stylex.props(styles.entityLabel, ui.truncate)}>
														{item.label}
													</span>
													<button
														{...stylex.props(styles.inspect)}
														aria-label={`Inspect ${item.label}`}
														aria-pressed={inspectedId === item.id}
														onClick={() => {
															setInspectedId(item.id);
															onInspect?.(item.id);
														}}
													>
														<MockupIcon
															iconStyle={styles.inspectIcon}
															src="/mockup-icons/timelines/ActivityTimeline-imgMagnifyingGlass.svg"
														/>
													</button>
												</div>
											))}
								</section>
							);
						})}
					</div>
					<div {...stylex.props(styles.chart)}>
						{inspectedItem !== undefined ? (
							<output {...stylex.props(styles.inspection)}>
								<span {...stylex.props(styles.inspectionTitle, ui.truncate)}>
									{inspectedItem.label}
								</span>
								{inspectedGroup === undefined ? null : (
									<span {...stylex.props(styles.inspectionGroup, ui.truncate)}>
										{inspectedGroup.label}
									</span>
								)}
							</output>
						) : null}
						{selected.length === 0 ? (
							<p {...stylex.props(ui.caption, ui.hint, styles.empty)}>Select an activity.</p>
						) : (
							<svg {...stylex.props(styles.chartSvg)} aria-label="Activity timeline chart">
								{[0, 25, 50, 75, 100].map((x) => (
									<line
										{...stylex.props(styles.gridLine)}
										key={`vertical-${x}`}
										x1={`${x}%`}
										x2={`${x}%`}
										y1="0"
										y2="100%"
									/>
								))}
								{[...rowPositions].map(([id, y]) => (
									<line
										{...stylex.props(styles.gridLine)}
										key={id}
										x1="0"
										x2="100%"
										y1={y}
										y2={y}
									/>
								))}
								{visibleEvents.map((event) => {
									const fromY = rowPositions.get(event.fromId);
									const toY = event.toId === undefined ? fromY : rowPositions.get(event.toId);
									if (fromY === undefined || toY === undefined) return null;
									const x = Math.max(0, Math.min(1, event.time)) * 100;
									return (
										<g key={event.id}>
											<line
												{...stylex.props(styles.eventLine)}
												x1={`${x}%`}
												x2={`${x}%`}
												y1={fromY}
												y2={toY}
											/>
											<circle
												{...stylex.props(styles.eventDot)}
												cx={`${x}%`}
												cy={fromY}
												r="0.1875rem"
											/>
											{toY === fromY ? null : (
												<circle
													{...stylex.props(styles.eventDot)}
													cx={`${x}%`}
													cy={toY}
													r="0.1875rem"
												/>
											)}
										</g>
									);
								})}
							</svg>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
