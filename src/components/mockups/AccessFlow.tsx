import { useEffect, useId, useRef, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { ui } from '../../styles/primitives';
import { colors, radius, space, typeScale } from '../../styles/tokens.stylex';
import { MockupIcon } from './MockupIcon';

export interface AccessFlowNode {
	id: string;
	kind: 'desktop' | 'traffic-switch' | 'server' | 'device';
	name: string;
	location: string;
	priority: string;
	score: number;
	reference: string;
	description: string;
	x?: number;
	y?: number;
}

export interface AccessFlowEdge {
	id: string;
	source: string;
	target: string;
	label?: string;
	activity?: number[];
	offset?: number;
}

export interface AccessFlowProps {
	nodes?: AccessFlowNode[];
	edges?: AccessFlowEdge[];
	nodeHeight?: number;
	onNodeSelect?: (node: AccessFlowNode) => void;
	onEdgeSelect?: (edge: AccessFlowEdge) => void;
}

const defaultNodes: AccessFlowNode[] = [
	{
		id: 'portal',
		kind: 'traffic-switch',
		name: 'Web-Portal-Prod',
		location: 'US East',
		priority: 'High',
		score: 85,
		reference: 'MITRE T1059',
		description: 'Powershell script execution detected.',
		x: 0,
		y: 0.5
	},
	{
		id: 'finance',
		kind: 'desktop',
		name: 'HR-Finance-01',
		location: 'US East',
		priority: 'Critical',
		score: 98,
		reference: 'MITRE T1071',
		description: 'Data exfiltration via HTTP protocol.',
		x: 26 / 38,
		y: 0
	},
	{
		id: 'devops',
		kind: 'desktop',
		name: 'DevOps-Repo-03',
		location: 'US West',
		priority: 'Medium',
		score: 72,
		reference: 'MITRE T1021',
		description: 'Unauthorized SSH access from external source.',
		x: 26 / 38,
		y: 0.6
	}
];

const activity = [
	0.2, 0.8, 0.48, 0.12, 0.64, 0.27, 0.9, 0.35, 0.18, 0.72, 0.45, 0.13, 0.61, 0.29, 0.84, 0.19, 0.52,
	0.33, 0.1, 0.7, 0.41, 0.16, 0.58, 0.26
];

const defaultEdges: AccessFlowEdge[] = [
	{
		id: 'portal-finance',
		source: 'portal',
		target: 'finance',
		label: 'REMOTE ACCESS',
		activity,
		offset: -6
	},
	{
		id: 'portal-devops',
		source: 'portal',
		target: 'devops',
		label: 'REMOTE ACCESS',
		activity,
		offset: 36
	}
];

const minimumCanvasWidth = 38;
const cardWidth = 12;
const cardHeight = 8;
const verticalPeerGap = 2;
const connectorRunway = 1.5;
const markerInset = 0.25;
const edgeLabelWidth = 8;
const edgeLabelHeight = 1.5;
const edgeLabelClearance = 0.25;
const horizontalRankClearance = (connectorRunway + markerInset) * 2;
const labeledRankClearance = horizontalRankClearance + edgeLabelWidth + edgeLabelClearance * 2;
const pixelsPerRem = 16;

const styles = stylex.create({
	root: {
		position: 'relative',
		backgroundColor: 'transparent',
		overflow: 'auto',
		pointerEvents: 'none'
	},
	canvas: (width: string, height: string) => ({
		position: 'relative',
		width,
		height
	}),
	connections: {
		position: 'absolute',
		inset: 0,
		width: '100%',
		height: '100%',
		overflow: 'visible',
		translate: '0.5px 0.5px'
	},
	connection: {
		fill: 'none',
		stroke: colors.divider,
		strokeWidth: 1.25,
		vectorEffect: 'non-scaling-stroke'
	},
	node: (left: string, top: string) => ({
		position: 'absolute',
		zIndex: 2,
		display: 'flex',
		flexDirection: 'column',
		left,
		top,
		width: `calc(${cardWidth}rem + 1px)`,
		height: `calc(${cardHeight}rem + 1px)`,
		minWidth: 0,
		padding: 0,
		overflow: 'hidden',
		color: colors.primary,
		textAlign: 'left',
		cursor: 'pointer',
		pointerEvents: 'auto',
		outlineWidth: { 'default': 1, ':focus-visible': 2 },
		outlineOffset: { 'default': -1, ':focus-visible': 2 }
	}),
	nodeSelected: {
		outlineColor: colors.ring,
		boxShadow: `0 0 0 1px ${colors.ring}`
	},
	nodeHeader: {
		display: 'flex',
		alignItems: 'center',
		gap: space[8],
		height: space[24],
		paddingInline: space[8],
		borderBottomWidth: 1,
		borderBottomStyle: 'solid',
		borderBottomColor: colors.divider,
		backgroundColor: colors.tint,
		flexShrink: 0
	},
	nodeIcon: { width: space[12], height: space[12], flexShrink: 0 },
	nodeKind: {
		flex: '1',
		minWidth: 0,
		color: colors.hint,
		fontSize: typeScale.tiny,
		lineHeight: typeScale.tinyLine,
		fontWeight: 550,
		textTransform: 'uppercase'
	},
	nodeBody: {
		display: 'flex',
		flex: '1',
		minHeight: 0,
		flexDirection: 'column'
	},
	nodeDetails: {
		display: 'flex',
		flexDirection: 'column',
		gap: space[4],
		paddingBlock: space[6],
		paddingInline: space[8],
		flexShrink: 0
	},
	nodeName: {
		fontSize: typeScale.caption,
		lineHeight: typeScale.captionLine,
		fontWeight: 575,
		flexShrink: 0
	},
	metadata: {
		display: 'grid',
		gridTemplateColumns: '1fr 1fr',
		gap: space[16],
		minWidth: 0,
		fontSize: typeScale.tiny,
		lineHeight: typeScale.tinyLine
	},
	metaItem: {
		display: 'flex',
		minWidth: 0,
		flexDirection: 'column',
		gap: space[2]
	},
	metaLabel: { color: colors.secondary },
	metaValue: { color: colors.primary, fontWeight: 550 },
	finding: {
		display: 'flex',
		flex: '1',
		flexDirection: 'column',
		gap: space[2],
		minWidth: 0,
		minHeight: 0,
		paddingBlock: space[6],
		paddingInline: space[8],
		borderTopWidth: 1,
		borderTopStyle: 'solid',
		borderTopColor: colors.divider
	},
	findingHeading: {
		display: 'flex',
		alignItems: 'center',
		gap: space[6],
		minWidth: 0,
		flexShrink: 0
	},
	score: {
		display: 'grid',
		placeItems: 'center',
		width: '2.5rem',
		height: space[20],
		flexShrink: 0,
		borderRadius: radius.small,
		backgroundColor: colors.paint,
		fontSize: typeScale.tiny,
		lineHeight: typeScale.tinyLine,
		fontWeight: 550
	},
	scoreHigh: { backgroundColor: colors.main, color: colors.mainContrast },
	reference: {
		minWidth: 0,
		fontSize: typeScale.tiny,
		lineHeight: typeScale.tinyLine,
		fontWeight: 550
	},
	description: {
		color: colors.secondary,
		fontSize: typeScale.tiny,
		lineHeight: typeScale.tinyLine,
		flexShrink: 0
	},
	edgeControl: (left: string, top: string) => ({
		position: 'absolute',
		zIndex: 3,
		left,
		top,
		display: 'flex',
		width: `${edgeLabelWidth}rem`,
		minWidth: '6rem',
		flexDirection: 'column',
		alignItems: 'stretch',
		gap: space[8],
		padding: 0,
		borderWidth: 0,
		backgroundColor: 'transparent',
		color: colors.primary,
		transform: 'translate(-50%, -0.75rem)',
		cursor: 'pointer',
		pointerEvents: 'auto'
	}),
	activitySpacing: (gap: number) => ({ gap: `${gap / pixelsPerRem}rem` }),
	relation: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: space[6],
		minHeight: `${edgeLabelHeight}rem`,
		paddingInline: space[12],
		borderRadius: radius.full,
		backgroundColor: colors.tone,
		fontSize: typeScale.tiny,
		lineHeight: typeScale.tinyLine,
		fontWeight: 550,
		whiteSpace: 'nowrap'
	},
	relationIcon: { width: space[12], height: space[12] },
	relationSelected: { boxShadow: `0 0 0 1px ${colors.ring}` },
	edgeDetail: {
		paddingBlock: space[4],
		paddingInline: space[6],
		borderRadius: radius.small,
		backgroundColor: colors.container,
		color: colors.secondary,
		fontSize: typeScale.tiny,
		lineHeight: typeScale.tinyLine
	},
	sparkline: {
		display: 'flex',
		alignItems: 'flex-end',
		gap: 1,
		height: space[24],
		paddingInline: space[4],
		overflow: 'hidden',
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: colors.divider,
		borderRadius: radius.small,
		backgroundColor: colors.background
	},
	sparkBar: (height: string, opacity: number) => ({
		flex: '1',
		minWidth: 1,
		height,
		backgroundColor: colors.main,
		opacity
	}),
	empty: { display: 'grid', placeItems: 'center', height: '100%' }
});

type PositionedNode = { node: AccessFlowNode; x: number; y: number };

type Layout = { width: number; height: number; positions: PositionedNode[] };

function rankClearance(rank: number, ranks: Map<string, number>, edges: AccessFlowEdge[]): number {
	const hasLabel = edges.some((edge) => {
		if (edge.label === undefined) return false;
		const sourceRank = ranks.get(edge.source);
		const targetRank = ranks.get(edge.target);
		if (sourceRank === undefined || targetRank === undefined) return false;
		return (
			Math.min(sourceRank, targetRank) === rank && Math.max(sourceRank, targetRank) === rank + 1
		);
	});
	return hasLabel ? labeledRankClearance : horizontalRankClearance;
}

function calculateLayout(
	nodes: AccessFlowNode[],
	edges: AccessFlowEdge[],
	nodeHeight: number,
	availableWidth: number,
	availableHeight: number
): Layout {
	const ranks = new Map<string, number>();
	const incoming = new Map(nodes.map((node) => [node.id, 0]));
	for (const edge of edges) incoming.set(edge.target, (incoming.get(edge.target) ?? 0) + 1);
	const roots = nodes.filter((node) => (incoming.get(node.id) ?? 0) === 0);
	const queue = (roots.length > 0 ? roots : nodes.slice(0, 1)).map((node) => ({
		id: node.id,
		rank: 0
	}));
	for (const item of queue) {
		if (ranks.has(item.id)) continue;
		ranks.set(item.id, item.rank);
		for (const edge of edges)
			if (edge.source === item.id && !ranks.has(edge.target))
				queue.push({ id: edge.target, rank: item.rank + 1 });
	}
	for (const node of nodes) if (!ranks.has(node.id)) ranks.set(node.id, 0);
	let maxRank = 0;
	for (const rank of ranks.values()) maxRank = Math.max(maxRank, rank);
	let maxPeerCount = 1;
	for (let rank = 0; rank <= maxRank; rank += 1)
		maxPeerCount = Math.max(
			maxPeerCount,
			nodes.filter((node) => (ranks.get(node.id) ?? 0) === rank).length
		);
	const baseHeight = nodeHeight > 0 ? cardHeight / nodeHeight : cardHeight;
	const hasAutoNodes = nodes.some((node) => node.x === undefined);
	const rankClearances = Array.from({ length: maxRank }, (_, rank) =>
		rankClearance(rank, ranks, edges)
	);
	const requiredWidth = hasAutoNodes
		? (maxRank + 1) * cardWidth + rankClearances.reduce((total, clearance) => total + clearance, 0)
		: cardWidth;
	const width = Math.max(minimumCanvasWidth, availableWidth, requiredWidth);
	const requiredHeight = maxPeerCount * cardHeight + (maxPeerCount - 1) * verticalPeerGap;
	const height = Math.max(baseHeight, availableHeight, requiredHeight);
	const distributedClearance =
		hasAutoNodes && maxRank > 0 ? Math.max(0, width - requiredWidth) / maxRank : 0;
	const rankStarts = [0];
	for (const clearance of rankClearances) {
		const previous = rankStarts.at(-1) ?? 0;
		rankStarts.push(previous + cardWidth + clearance + distributedClearance);
	}
	const positions = nodes.map((node) => {
		const rank = ranks.get(node.id) ?? 0;
		const peers = nodes.filter((candidate) => (ranks.get(candidate.id) ?? 0) === rank);
		const peerIndex = peers.findIndex((candidate) => candidate.id === node.id);
		const x =
			node.x === undefined
				? maxRank === 0
					? (width - cardWidth) / 2
					: (rankStarts[rank] ?? 0)
				: Math.min(1, (node.x * minimumCanvasWidth) / (minimumCanvasWidth - cardWidth)) *
					(width - cardWidth);
		const peersHeight = peers.length * cardHeight + (peers.length - 1) * verticalPeerGap;
		const y =
			node.y === undefined
				? peers.length === 1
					? (height - cardHeight) / 2
					: (height - peersHeight) / 2 + peerIndex * (cardHeight + verticalPeerGap)
				: node.y * baseHeight;
		return {
			node,
			x: Math.max(0, Math.min(width - cardWidth, x)),
			y: Math.max(0, Math.min(height - cardHeight, y))
		};
	});
	return { width, height, positions };
}

function connectionGeometry(source: PositionedNode, target: PositionedNode, edge: AccessFlowEdge) {
	const offset = edge.offset ?? 0;
	const markerInsetPixels = markerInset * pixelsPerRem;
	const sourceCenterX = (source.x + cardWidth / 2) * pixelsPerRem;
	const targetCenterX = (target.x + cardWidth / 2) * pixelsPerRem;
	const sourceCenterY = (source.y + cardHeight / 2) * pixelsPerRem;
	const targetCenterY = (target.y + cardHeight / 2) * pixelsPerRem;
	if (Math.abs(targetCenterX - sourceCenterX) < (cardWidth * pixelsPerRem) / 2) {
		const down = targetCenterY >= sourceCenterY;
		const sourceY = (source.y + (down ? cardHeight : 0)) * pixelsPerRem;
		const targetY =
			(target.y + (down ? 0 : cardHeight)) * pixelsPerRem +
			(down ? -markerInsetPixels : markerInsetPixels);
		const middle = (sourceY + targetY) / 2;
		const x = (sourceCenterX + targetCenterX) / 2;
		const gap =
			edge.label === undefined
				? 0
				: (down ? 1 : -1) * (edgeLabelHeight / 2 + edgeLabelClearance) * pixelsPerRem;
		return {
			path: `M ${sourceCenterX} ${sourceY} C ${sourceCenterX} ${middle - gap}, ${x} ${middle - gap}, ${x} ${middle - gap} M ${x} ${middle + gap} C ${x} ${middle + gap}, ${targetCenterX} ${middle + gap}, ${targetCenterX} ${targetY}`,
			x,
			y: middle
		};
	}
	const right = targetCenterX > sourceCenterX;
	const entersBottom = target.y + cardHeight < source.y;
	const sourceX = (source.x + (right ? cardWidth : 0)) * pixelsPerRem;
	const targetX = entersBottom
		? targetCenterX
		: (target.x + (right ? 0 : cardWidth)) * pixelsPerRem +
			(right ? -markerInsetPixels : markerInsetPixels);
	const targetY = entersBottom
		? (target.y + cardHeight) * pixelsPerRem + markerInsetPixels
		: targetCenterY;
	const x = (sourceX + (target.x + (right ? 0 : cardWidth)) * pixelsPerRem) / 2;
	const y = (sourceCenterY + targetY) / 2 + offset;
	const runway = connectorRunway * pixelsPerRem;
	const departureX = sourceX + (right ? runway : -runway);
	const arrivalX = entersBottom ? targetX : targetX + (right ? -runway : runway);
	const gap =
		edge.label === undefined
			? 0
			: (right ? 1 : -1) * (edgeLabelWidth / 2 + edgeLabelClearance) * pixelsPerRem;
	return {
		path: `M ${sourceX} ${sourceCenterY} C ${departureX} ${sourceCenterY}, ${departureX} ${y}, ${x - gap} ${y} M ${x + gap} ${y} C ${arrivalX} ${y}, ${arrivalX} ${entersBottom ? y : targetY}, ${targetX} ${targetY}`,
		x,
		y
	};
}

function nodeIcon(kind: AccessFlowNode['kind']): string {
	return kind === 'traffic-switch'
		? '/mockup-icons/timelines/AccessFlow-imgInstance.svg'
		: '/mockup-icons/timelines/AccessFlow-imgInstance2.svg';
}

function nodeKind(kind: AccessFlowNode['kind']): string {
	return kind.replace('-', ' ');
}

export function AccessFlowGraph({
	nodes,
	edges,
	nodeHeight,
	onNodeSelect,
	onEdgeSelect
}: Required<Pick<AccessFlowProps, 'nodes' | 'edges' | 'nodeHeight'>> & {
	onNodeSelect: AccessFlowProps['onNodeSelect'] | undefined;
	onEdgeSelect: AccessFlowProps['onEdgeSelect'] | undefined;
}) {
	const markerId = useId();
	const [selectedNode, setSelectedNode] = useState<string>();
	const [selectedEdge, setSelectedEdge] = useState<string>();
	const [availableSize, setAvailableSize] = useState({ width: 0, height: 0 });
	const rootRef = useRef<HTMLElement>(null);
	useEffect(() => {
		const root = rootRef.current;
		const observer = new ResizeObserver(([entry]) => {
			if (entry === undefined) return;
			const remSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
			if (!Number.isFinite(remSize) || remSize <= 0) return;
			const width = (entry.contentRect.width - 1) / remSize;
			const height = (entry.contentRect.height - 1) / remSize;
			setAvailableSize((current) =>
				current.width === width && current.height === height ? current : { width, height }
			);
		});
		if (root !== null) observer.observe(root);
		return () => observer.disconnect();
	}, []);
	const { width, height, positions } = calculateLayout(
		nodes,
		edges,
		nodeHeight,
		availableSize.width,
		availableSize.height
	);
	const byId = new Map(positions.map((position) => [position.node.id, position]));
	if (nodes.length === 0)
		return (
			<section {...stylex.props(ui.mockup, styles.root)} ref={rootRef}>
				<p {...stylex.props(ui.caption, ui.hint, styles.empty)}>No access nodes.</p>
			</section>
		);
	return (
		<section {...stylex.props(ui.mockup, styles.root)} ref={rootRef}>
			<div {...stylex.props(styles.canvas(`${width}rem`, `${height}rem`))}>
				<svg
					{...stylex.props(styles.connections)}
					viewBox={`0 0 ${width * pixelsPerRem} ${height * pixelsPerRem}`}
					preserveAspectRatio="none"
					aria-hidden="true"
				>
					<defs>
						<marker
							id={markerId}
							markerWidth="8"
							markerHeight="8"
							refX="5"
							refY="4"
							orient="auto"
							markerUnits="userSpaceOnUse"
						>
							<path {...stylex.props(styles.connection)} d="M1 1L5 4L1 7" />
						</marker>
					</defs>
					{edges.map((edge) => {
						const source = byId.get(edge.source);
						const target = byId.get(edge.target);
						if (source === undefined || target === undefined) return null;
						return (
							<path
								{...stylex.props(styles.connection)}
								key={edge.id}
								d={connectionGeometry(source, target, edge).path}
								markerEnd={`url(#${markerId})`}
							/>
						);
					})}
				</svg>
				{positions.map((position) => (
					<button
						{...stylex.props(
							ui.panel,
							styles.node(`${position.x}rem`, `${position.y}rem`),
							selectedNode === position.node.id && styles.nodeSelected
						)}
						key={position.node.id}
						aria-pressed={selectedNode === position.node.id}
						onClick={() => {
							setSelectedNode(position.node.id);
							onNodeSelect?.(position.node);
						}}
					>
						<span {...stylex.props(styles.nodeHeader)}>
							<MockupIcon iconStyle={styles.nodeIcon} src={nodeIcon(position.node.kind)} />
							<span {...stylex.props(styles.nodeKind, ui.truncate)}>
								{nodeKind(position.node.kind)}
							</span>
							<MockupIcon
								iconStyle={styles.nodeIcon}
								src="/mockup-icons/timelines/AccessFlow-imgInstance1.svg"
							/>
						</span>
						<span {...stylex.props(styles.nodeBody)}>
							<span {...stylex.props(styles.nodeDetails)}>
								<span {...stylex.props(styles.nodeName, ui.truncate)}>{position.node.name}</span>
								<span {...stylex.props(styles.metadata)}>
									<span {...stylex.props(styles.metaItem)}>
										<span {...stylex.props(styles.metaLabel)}>Location</span>
										<span {...stylex.props(styles.metaValue, ui.truncate)}>
											{position.node.location}
										</span>
									</span>
									<span {...stylex.props(styles.metaItem)}>
										<span {...stylex.props(styles.metaLabel)}>Priority</span>
										<span {...stylex.props(styles.metaValue, ui.truncate)}>
											{position.node.priority}
										</span>
									</span>
								</span>
							</span>
							<span {...stylex.props(styles.finding)}>
								<span {...stylex.props(styles.findingHeading)}>
									<span
										{...stylex.props(styles.score, position.node.score >= 90 && styles.scoreHigh)}
									>
										{position.node.score}
									</span>
									<span {...stylex.props(styles.reference, ui.truncate)}>
										{position.node.reference}
									</span>
								</span>
								<span {...stylex.props(styles.description, ui.truncate)}>
									{position.node.description}
								</span>
							</span>
						</span>
					</button>
				))}
				{edges.map((edge) => {
					const source = byId.get(edge.source);
					const target = byId.get(edge.target);
					if (source === undefined || target === undefined || edge.label === undefined) return null;
					const { x, y } = connectionGeometry(source, target, edge);
					const parallel = edge.activity
						? edges.find(
								(candidate) =>
									candidate.id !== edge.id &&
									candidate.source === edge.source &&
									candidate.target === edge.target &&
									candidate.label
							)
						: undefined;
					const gap = parallel
						? Math.max(8, (connectionGeometry(source, target, parallel).y - y) / 2 - 24)
						: 8;
					return (
						<button
							{...stylex.props(
								styles.edgeControl(`${x / pixelsPerRem}rem`, `${y / pixelsPerRem}rem`),
								styles.activitySpacing(gap)
							)}
							key={edge.id}
							aria-pressed={selectedEdge === edge.id}
							onClick={() => {
								setSelectedEdge(edge.id);
								onEdgeSelect?.(edge);
							}}
						>
							<span
								{...stylex.props(
									styles.relation,
									selectedEdge === edge.id && styles.relationSelected
								)}
							>
								<MockupIcon
									iconStyle={styles.relationIcon}
									src="/mockup-icons/timelines/AccessFlow-imgLeftIcon.svg"
								/>
								<span {...stylex.props(ui.truncate)}>{edge.label}</span>
							</span>
							{selectedEdge === edge.id ? (
								<span {...stylex.props(styles.edgeDetail, ui.truncate)}>
									{source.node.name} → {target.node.name}
								</span>
							) : null}
							{edge.activity === undefined ? null : (
								<span {...stylex.props(styles.sparkline)}>
									{edge.activity.map((value, index) => (
										<span
											{...stylex.props(
												styles.sparkBar(
													`${Math.max(8, Math.min(100, value * 100))}%`,
													Math.max(0.15, Math.min(0.75, value))
												)
											)}
											key={index}
										/>
									))}
								</span>
							)}
						</button>
					);
				})}
			</div>
		</section>
	);
}

export function AccessFlow({
	nodes = defaultNodes,
	edges = defaultEdges,
	nodeHeight = 0.4,
	onNodeSelect,
	onEdgeSelect
}: AccessFlowProps) {
	return (
		<AccessFlowGraph
			nodes={nodes}
			edges={edges}
			nodeHeight={nodeHeight}
			onNodeSelect={onNodeSelect}
			onEdgeSelect={onEdgeSelect}
		/>
	);
}
