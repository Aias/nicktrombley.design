import { useState, type FormEvent } from 'react';
import * as stylex from '@stylexjs/stylex';
import { ui } from '../../styles/primitives';
import { colors, radius, space } from '../../styles/tokens.stylex';
import { FormsIcon } from './FormsIcon';

export type HierarchyNode = {
	id: string;
	name: string;
	reference: string;
	score: number;
	durationMs?: number;
	children?: HierarchyNode[];
};

type Timing = { id: string; durationMs: number };

type HierarchyProps = {
	nodes?: HierarchyNode[];
	title?: string;
	onClose?: () => void;
	onCalculate?: (timings: Timing[]) => void;
};

const defaultHierarchy: HierarchyNode[] = [
	{
		id: 'finance',
		name: 'Finance Server-01',
		reference: 'CVE-2019-0101',
		score: 98,
		children: [
			{
				id: 'accounting',
				name: 'Accounting-DB-2',
				reference: 'MITRE T1071',
				score: 85,
				children: [
					{ id: 'executive', name: 'Executive-Router-1', reference: 'CVE-2019-0144', score: 98 }
				]
			}
		]
	},
	{
		id: 'operations',
		name: 'Operations-Switch-1',
		reference: 'CVE-2017-5309',
		score: 85,
		children: [
			{ id: 'engineering', name: 'Engineering-Switch-2', reference: 'MITRE T1079', score: 85 },
			{ id: 'security', name: 'Security-Router-2', reference: 'CVE-2019-0101', score: 72 },
			{
				id: 'development',
				name: 'Development-Server-1',
				reference: 'MITRE-T1003',
				score: 72,
				children: [
					{ id: 'qa1', name: 'QA-DB-1', reference: 'CVE-2018-7600', score: 85 },
					{ id: 'qa2', name: 'QA-DB-2', reference: 'CVE-2018-7600', score: 72 }
				]
			}
		]
	}
];

const styles = stylex.create({
	root: {
		display: 'flex',
		flexDirection: 'column',
		gap: '0.625rem',
		justifyContent: 'center',
		padding: space[16]
	},
	header: { display: 'flex', width: '100%', minWidth: 0, alignItems: 'center', gap: '0.625rem' },
	headerTitle: { display: 'flex', minWidth: 0, flex: '1', alignItems: 'center', gap: space[8] },
	iconButton: {
		display: 'flex',
		flexShrink: 0,
		borderWidth: 0,
		backgroundColor: 'transparent',
		cursor: 'pointer'
	},
	content: { minHeight: 0, flex: '1', overflow: 'auto' },
	tree: {
		display: 'flex',
		width: '100%',
		flexDirection: 'column',
		gap: space[4],
		listStyle: 'none',
		padding: 0
	},
	children: {
		display: 'flex',
		flexDirection: 'column',
		gap: space[4],
		marginLeft: '1.1875rem',
		paddingLeft: '1.8125rem',
		borderLeftWidth: 2,
		borderLeftStyle: 'solid',
		borderLeftColor: colors.paint,
		listStyle: 'none'
	},
	node: { display: 'flex', minWidth: 0, alignItems: 'center', gap: space[8] },
	score: {
		display: 'flex',
		width: '2.5rem',
		height: '1.875rem',
		flexShrink: 0,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 0,
		borderRadius: radius.small,
		backgroundColor: colors.tone,
		color: colors.primary,
		fontSize: '0.6875rem',
		lineHeight: '1rem'
	},
	medium: { backgroundColor: colors.paint },
	high: { backgroundColor: colors.main, color: colors.mainContrast },
	expandable: { cursor: 'pointer' },
	copy: {
		display: 'flex',
		minWidth: 0,
		flex: '1',
		flexDirection: 'column',
		gap: space[2],
		paddingBlock: '0.0625rem'
	},
	duration: { width: space[48], flexShrink: 0 },
	calculate: {
		width: '100%',
		flexShrink: 0,
		height: space[24],
		backgroundColor: { 'default': colors.component, ':hover': colors.tone }
	},
	closed: { justifyContent: 'center', alignItems: 'center' }
});

function flattenNodes(nodes: HierarchyNode[]): HierarchyNode[] {
	return nodes.flatMap((node) => [node, ...flattenNodes(node.children ?? [])]);
}

export function Hierarchy({
	nodes = defaultHierarchy,
	title = 'Ingress Path',
	onClose,
	onCalculate
}: HierarchyProps) {
	const [collapsedIds, setCollapsedIds] = useState<string[]>([]);
	const [closed, setClosed] = useState(false);
	const [editingTimings, setEditingTimings] = useState(false);
	const [durations, setDurations] = useState<Record<string, string>>({});
	const [total, setTotal] = useState<number>();

	function toggleNode(id: string) {
		setCollapsedIds((current) =>
			current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
		);
	}

	function revealInvalidInput(event: FormEvent<HTMLInputElement>, ancestorIds: string[]) {
		const collapsedAncestorIds = ancestorIds.filter((id) => collapsedIds.includes(id));
		if (collapsedAncestorIds.length === 0) return;
		event.preventDefault();
		setCollapsedIds((current) => current.filter((id) => !collapsedAncestorIds.includes(id)));
		const input = event.currentTarget;
		requestAnimationFrame(() => {
			input.focus();
			input.reportValidity();
		});
	}

	function renderNodes(
		items: HierarchyNode[],
		nested: boolean,
		ancestorIds: string[] = [],
		hidden = false
	) {
		return (
			<ul {...stylex.props(nested ? styles.children : styles.tree)} hidden={hidden}>
				{items.map((node) => {
					const expanded = !collapsedIds.includes(node.id);
					return (
						<li key={node.id}>
							<div {...stylex.props(styles.node)}>
								{node.children ? (
									<button
										type="button"
										{...stylex.props(
											styles.score,
											node.score >= 80 && styles.medium,
											node.score >= 90 && styles.high,
											styles.expandable
										)}
										aria-label={`${node.name}, score ${node.score}, toggle children`}
										aria-expanded={expanded}
										onClick={() => toggleNode(node.id)}
									>
										{node.score}
									</button>
								) : (
									<span
										{...stylex.props(
											styles.score,
											node.score >= 80 && styles.medium,
											node.score >= 90 && styles.high
										)}
									>
										{node.score}
									</span>
								)}
								<div {...stylex.props(styles.copy)}>
									<p {...stylex.props(ui.caption, ui.truncate)}>{node.name}</p>
									<p {...stylex.props(ui.tiny, ui.secondary, ui.truncate)}>{node.reference}</p>
								</div>
								{editingTimings ? (
									<input
										{...stylex.props(ui.input, styles.duration)}
										aria-label={`${node.name} duration in milliseconds`}
										name={`duration-${node.id}`}
										type="number"
										min="0"
										step="any"
										placeholder="ms"
										value={durations[node.id] ?? node.durationMs ?? ''}
										onChange={(event) =>
											setDurations((current) => ({
												...current,
												[node.id]: event.target.value
											}))
										}
										onInvalid={(event) => revealInvalidInput(event, ancestorIds)}
									/>
								) : null}
							</div>
							{node.children
								? renderNodes(node.children, true, [...ancestorIds, node.id], !expanded)
								: null}
						</li>
					);
				})}
			</ul>
		);
	}

	function submitTimings(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!editingTimings) {
			setEditingTimings(true);
			return;
		}
		const timings = flattenNodes(nodes).map((node) => ({
			id: node.id,
			durationMs: Number(durations[node.id] ?? node.durationMs ?? 0)
		}));
		setTotal(timings.reduce((sum, timing) => sum + timing.durationMs, 0));
		setEditingTimings(false);
		onCalculate?.(timings);
	}

	if (closed) {
		return (
			<section {...stylex.props(ui.mockup, ui.panel, styles.root, styles.closed)}>
				<button type="button" {...stylex.props(ui.button)} onClick={() => setClosed(false)}>
					Open {title}
				</button>
			</section>
		);
	}

	return (
		<form {...stylex.props(ui.mockup, ui.panel, styles.root)} onSubmit={submitTimings}>
			<header {...stylex.props(styles.header)}>
				<div {...stylex.props(styles.headerTitle)}>
					<FormsIcon name="Hierarchy-imgActivityLog" />
					<h2 {...stylex.props(ui.title, ui.truncate)}>{title}</h2>
				</div>
				<button
					type="button"
					{...stylex.props(styles.iconButton)}
					aria-label={`Close ${title}`}
					onClick={() => {
						setClosed(true);
						onClose?.();
					}}
				>
					<FormsIcon name="Hierarchy-imgCross2" />
				</button>
			</header>
			<div {...stylex.props(styles.content)}>{renderNodes(nodes, false)}</div>
			<button type="submit" {...stylex.props(ui.button, ui.tiny, styles.calculate)}>
				<FormsIcon name="Hierarchy-imgLeftIcon" size={12} />
				{editingTimings
					? 'Calculate Total'
					: total === undefined
						? 'Calculate Timings'
						: `Total: ${total.toLocaleString()} ms`}
			</button>
		</form>
	);
}
