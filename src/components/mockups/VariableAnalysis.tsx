import { useId, useLayoutEffect, useRef, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { ui } from '../../styles/primitives';
import { colors, radius, space, typeScale } from '../../styles/tokens.stylex';
import { MockupIcon } from './MockupIcon';

export interface AnalysisVariable {
	id: string;
	label: string;
}
export interface AnalysisStatistics {
	variableLabel: string;
	cohort: string;
	riskDifference: number;
	pValue: string;
	summary?: string;
}
export interface DirectionalAnalysisStatistics {
	forward?: AnalysisStatistics;
	reverse?: AnalysisStatistics;
}
export interface VariableAnalysisProps {
	title?: string;
	predictor?: AnalysisVariable;
	outcome?: AnalysisVariable;
	confounders?: AnalysisVariable[];
	statistics?: DirectionalAnalysisStatistics;
	onSwap?: (predictor: AnalysisVariable, outcome: AnalysisVariable) => void;
}
interface Point {
	x: number;
	y: number;
}
interface Connectors {
	width: number;
	height: number;
	direct: string;
	confounders: { id: string; inbound: string; outbound: string }[];
}

const defaultPredictor: AnalysisVariable = { id: 'minimum-spo2', label: 'MINIMUM SPO2 (%)' };
const defaultOutcome: AnalysisVariable = { id: 'expired', label: 'EXPIRED' };
const defaultConfounders: AnalysisVariable[] = [
	{ id: 'comorbidities', label: 'COMORBIDITIES' },
	{ id: 'age', label: 'AGE' },
	{ id: 'gender', label: 'GENDER' }
];
const defaultStatistics: DirectionalAnalysisStatistics = {
	forward: {
		variableLabel: 'Minimum SPO2 (%)',
		cohort: 'Uncontrolled',
		riskDifference: -0.013,
		pValue: '<0.001',
		summary:
			'The impact of Minimum SPO2 (%) on membership in “Expired” was statistically significant, with a p-value below 0.001. The risk difference is the probability change associated with a one-unit increase in SPO2.'
	}
};
const emptyConnectors: Connectors = { width: 1, height: 1, direct: '', confounders: [] };

function leftCenter(node: DOMRect, root: DOMRect): Point {
	return { x: node.left - root.left, y: node.top - root.top + node.height / 2 };
}
function rightCenter(node: DOMRect, root: DOMRect): Point {
	return { x: node.right - root.left, y: node.top - root.top + node.height / 2 };
}
function bottomCenter(node: DOMRect, root: DOMRect): Point {
	return { x: node.left - root.left + node.width / 2, y: node.bottom - root.top };
}
function curvedPath(start: Point, end: Point) {
	const middle = (start.x + end.x) / 2;
	return `M${start.x},${start.y} C${middle},${start.y} ${middle},${end.y} ${end.x},${end.y}`;
}
function confounderPath(start: Point, end: Point, lane: number, bend: number, outbound = false) {
	const turn = Math.min(start.y + bend, end.y - bend);
	const approach = end.x > lane ? lane + bend : lane - bend;
	return outbound
		? `M${end.x},${end.y} L${approach},${end.y} Q${lane},${end.y} ${lane},${end.y - bend} L${lane},${turn + bend} C${lane},${turn} ${start.x},${turn} ${start.x},${start.y}`
		: `M${start.x},${start.y} C${start.x},${turn} ${lane},${turn} ${lane},${turn + bend} L${lane},${end.y - bend} Q${lane},${end.y} ${approach},${end.y} L${end.x},${end.y}`;
}

export function VariableAnalysis(props: VariableAnalysisProps) {
	const {
		title = 'Controlled Analysis',
		predictor = defaultPredictor,
		outcome = defaultOutcome,
		confounders = defaultConfounders,
		onSwap
	} = props;
	const statistics =
		props.statistics ??
		(props.predictor === undefined && props.outcome === undefined ? defaultStatistics : undefined);
	const [reversed, setReversed] = useState(false);
	const [helpOpen, setHelpOpen] = useState(false);
	const [connectors, setConnectors] = useState(emptyConnectors);
	const markerId = useId().replaceAll(':', '');
	const graphRef = useRef<HTMLDivElement>(null);
	const predictorRef = useRef<HTMLDivElement>(null);
	const outcomeRef = useRef<HTMLDivElement>(null);
	const confounderRefs = useRef(new Map<string, HTMLDivElement>());
	const visiblePredictor = reversed ? outcome : predictor;
	const visibleOutcome = reversed ? predictor : outcome;
	const visibleStatistics = reversed ? statistics?.reverse : statistics?.forward;

	useLayoutEffect(() => {
		const graph = graphRef.current;
		const predictorNode = predictorRef.current;
		const outcomeNode = outcomeRef.current;
		if (!graph || !predictorNode || !outcomeNode) return undefined;
		const measure = () => {
			const root = graph.getBoundingClientRect();
			const predictorBounds = predictorNode.getBoundingClientRect();
			const outcomeBounds = outcomeNode.getBoundingClientRect();
			const nodes = confounders.flatMap((confounder) => {
				const node = confounderRefs.current.get(confounder.id);
				return node ? [{ id: confounder.id, bounds: node.getBoundingClientRect() }] : [];
			});
			const bend = predictorBounds.height / 2;
			const predictorPort = bottomCenter(predictorBounds, root);
			const outcomePort = bottomCenter(outcomeBounds, root);
			const leftLane = Math.min(
				predictorPort.x,
				...nodes.map(({ bounds }) => bounds.left - root.left - bend)
			);
			const rightLane = Math.max(
				outcomePort.x,
				...nodes.map(({ bounds }) => bounds.right - root.left + bend)
			);
			const measured = nodes.map(({ id, bounds }, index) => {
				const spread = nodes.length < 2 ? 0 : index / (nodes.length - 1);
				return {
					id,
					inbound: confounderPath(
						predictorPort,
						leftCenter(bounds, root),
						leftLane - spread * bend,
						bend
					),
					outbound: confounderPath(
						outcomePort,
						rightCenter(bounds, root),
						rightLane + spread * bend,
						bend,
						true
					)
				};
			});
			setConnectors({
				width: root.width,
				height: root.height,
				direct: curvedPath(rightCenter(predictorBounds, root), leftCenter(outcomeBounds, root)),
				confounders: measured
			});
		};
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(graph);
		observer.observe(predictorNode);
		observer.observe(outcomeNode);
		for (const node of confounderRefs.current.values()) observer.observe(node);
		return () => observer.disconnect();
	}, [confounders]);

	return (
		<section {...stylex.props(ui.mockup, ui.panel, styles.root)} aria-label={title}>
			<div {...stylex.props(styles.intro)}>
				<header {...stylex.props(ui.row, styles.header)}>
					<h2 {...stylex.props(ui.title, ui.truncate, styles.grow)}>{title}</h2>
					<button
						{...stylex.props(styles.helpButton)}
						aria-expanded={helpOpen}
						onClick={() => setHelpOpen(!helpOpen)}
					>
						<MockupIcon
							src="/mockup-icons/charts/VariableAnalysis/imgQuestionMarkCircled.svg"
							iconStyle={styles.helpIcon}
						/>
						What is Risk Difference?
					</button>
				</header>
				{helpOpen ? (
					<p {...stylex.props(ui.tiny, styles.helpText)}>
						Risk difference measures the absolute change in outcome probability associated with a
						one-unit predictor increase while holding the listed confounders constant.
					</p>
				) : null}
				<p {...stylex.props(ui.caption, styles.summary)}>
					{visibleStatistics?.summary ??
						`Analysis of ${visiblePredictor.label} and ${visibleOutcome.label}, controlling for ${confounders.length === 0 ? 'no confounders' : confounders.map((confounder) => confounder.label).join(', ')}.`}
				</p>
			</div>
			<div {...stylex.props(styles.content)}>
				<div {...stylex.props(ui.scrollFade, styles.graphViewport)}>
					<div {...stylex.props(styles.graphCanvas)} ref={graphRef}>
						<svg
							{...stylex.props(styles.connectors)}
							viewBox={`0 0 ${connectors.width} ${connectors.height}`}
							aria-hidden="true"
						>
							<defs>
								<marker
									id={markerId}
									markerWidth="6"
									markerHeight="6"
									refX="6"
									refY="3"
									orient="auto"
								>
									<path d="M0 0L6 3L0 6Z" fill="currentColor" />
								</marker>
							</defs>
							<path
								{...stylex.props(styles.directConnector)}
								d={connectors.direct}
								markerEnd={`url(#${markerId})`}
							/>
							{connectors.confounders.map((connector) => (
								<g key={connector.id}>
									<path d={connector.inbound} markerEnd={`url(#${markerId})`} />
									<path d={connector.outbound} markerEnd={`url(#${markerId})`} />
								</g>
							))}
						</svg>
						<div {...stylex.props(styles.primaryRow)}>
							<div {...stylex.props(styles.variableGroup)}>
								<span {...stylex.props(ui.caption, styles.groupLabel)}>Predictor</span>
								<div
									{...stylex.props(ui.caption, ui.truncate, styles.primaryNode)}
									ref={predictorRef}
									title={visiblePredictor.label}
								>
									{visiblePredictor.label}
								</div>
							</div>
							<div {...stylex.props(styles.variableGroup)}>
								<span {...stylex.props(ui.caption, styles.groupLabel)}>Outcome</span>
								<div
									{...stylex.props(ui.caption, ui.truncate, styles.primaryNode)}
									ref={outcomeRef}
									title={visibleOutcome.label}
								>
									{visibleOutcome.label}
								</div>
							</div>
						</div>
						<div {...stylex.props(styles.confounderArea)}>
							<span {...stylex.props(ui.caption, styles.groupLabel)}>Confounders</span>
							<div {...stylex.props(styles.confounderList)}>
								{confounders.length === 0 ? (
									<span {...stylex.props(ui.tiny, ui.hint)}>None</span>
								) : (
									confounders.map((confounder) => (
										<div
											key={confounder.id}
											{...stylex.props(ui.caption, ui.truncate, styles.confounderNode)}
											ref={(node) => {
												if (node) confounderRefs.current.set(confounder.id, node);
												else confounderRefs.current.delete(confounder.id);
											}}
											title={confounder.label}
										>
											{confounder.label}
										</div>
									))
								)}
							</div>
						</div>
					</div>
				</div>
				<div {...stylex.props(styles.side)}>
					<div {...stylex.props(styles.stats)}>
						{visibleStatistics ? (
							<>
								<span {...stylex.props(styles.statsTitle)}>
									<span {...stylex.props(styles.legendDot)} />
									<strong {...stylex.props(ui.caption, ui.truncate)}>
										{visibleStatistics.variableLabel}
									</strong>
								</span>
								<dl {...stylex.props(ui.tiny, styles.definitionList)}>
									<div {...stylex.props(styles.definitionRow)}>
										<dt>Cohort</dt>
										<dd>{visibleStatistics.cohort}</dd>
									</div>
									<div {...stylex.props(styles.definitionRow)}>
										<dt>Risk</dt>
										<dd>{visibleStatistics.riskDifference.toFixed(3)}</dd>
									</div>
									<div {...stylex.props(styles.definitionRow)}>
										<dt>P-Value</dt>
										<dd>{visibleStatistics.pValue}</dd>
									</div>
								</dl>
							</>
						) : (
							<p {...stylex.props(ui.caption, ui.secondary)}>
								No analysis results for this direction.
							</p>
						)}
					</div>
					<button
						{...stylex.props(ui.button, styles.swap)}
						onClick={() => {
							const next = !reversed;
							setReversed(next);
							onSwap?.(next ? outcome : predictor, next ? predictor : outcome);
						}}
					>
						<MockupIcon
							src="/mockup-icons/charts/VariableAnalysis/imgLeftIcon.svg"
							iconStyle={styles.swapIcon}
						/>
						Swap Variables
					</button>
				</div>
			</div>
		</section>
	);
}

const styles = stylex.create({
	root: { display: 'flex', flexDirection: 'column', gap: space[12], padding: space[16] },
	intro: { display: 'flex', flexDirection: 'column', gap: space[8], flexShrink: 0 },
	header: { position: 'relative' },
	grow: { flex: '1' },
	helpButton: {
		display: 'inline-flex',
		alignItems: 'center',
		gap: space[6],
		padding: 0,
		borderWidth: 0,
		backgroundColor: 'transparent',
		color: colors.accent,
		fontSize: typeScale.caption,
		lineHeight: typeScale.captionLine,
		cursor: 'pointer',
		whiteSpace: 'nowrap'
	},
	helpIcon: { width: '0.875rem', height: '0.875rem' },
	helpText: {
		position: 'absolute',
		zIndex: 4,
		insetInlineEnd: space[16],
		marginTop: space[24],
		width: '13rem',
		padding: space[8],
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: colors.divider,
		borderRadius: radius.small,
		backgroundColor: colors.container,
		boxShadow: `0 0.25rem 0.75rem ${colors.borderShadow}`,
		color: colors.secondary
	},
	summary: {
		display: '-webkit-box',
		maxHeight: space[48],
		overflow: 'hidden',
		WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 3,
		color: colors.primary
	},
	content: { display: 'flex', flex: '1', minHeight: 0, alignItems: 'stretch', gap: space[24] },
	graphViewport: {
		flexGrow: 3,
		flexShrink: 1,
		flexBasis: '14rem',
		minWidth: 0,
		minHeight: 0,
		overflow: 'auto'
	},
	graphCanvas: {
		position: 'relative',
		display: 'flex',
		minWidth: '13rem',
		minHeight: '8rem',
		flexDirection: 'column',
		gap: space[12],
		padding: space[2],
		color: colors.symbol
	},
	connectors: {
		position: 'absolute',
		color: colors.borderActive,
		zIndex: 0,
		inset: 0,
		width: '100%',
		height: '100%',
		overflow: 'visible',
		fill: 'none',
		stroke: 'currentColor',
		strokeWidth: 1,
		strokeDasharray: '3 3'
	},
	directConnector: { strokeDasharray: 'none' },
	primaryRow: {
		position: 'relative',
		zIndex: 1,
		display: 'flex',
		justifyContent: 'space-between',
		gap: space[24]
	},
	variableGroup: {
		display: 'flex',
		minWidth: 0,
		width: '6rem',
		flexDirection: 'column',
		alignItems: 'center',
		gap: space[4]
	},
	groupLabel: { color: colors.accent, fontWeight: 575, textAlign: 'center' },
	primaryNode: {
		width: '100%',
		paddingBlock: space[2],
		paddingInline: space[8],
		borderRadius: radius.small,
		backgroundColor: colors.main,
		color: colors.mainContrast,
		fontWeight: 575,
		textAlign: 'center'
	},
	confounderArea: {
		position: 'relative',
		zIndex: 1,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		gap: space[4]
	},
	confounderList: {
		display: 'flex',
		width: '7rem',
		flexDirection: 'column',
		alignItems: 'center',
		gap: space[6],
		textAlign: 'center'
	},
	confounderNode: {
		width: 'fit-content',
		maxWidth: '100%',
		paddingBlock: space[2],
		paddingInline: space[8],
		borderRadius: radius.small,
		backgroundColor: colors.container,
		backgroundImage: `linear-gradient(${colors.paint}, ${colors.paint})`,
		color: colors.accent,
		fontWeight: 575,
		textAlign: 'center'
	},
	side: {
		display: 'flex',
		flexGrow: 1,
		flexShrink: 1,
		flexBasis: '9rem',
		minWidth: '8rem',
		flexDirection: 'column',
		justifyContent: 'flex-end',
		gap: space[16]
	},
	stats: {
		display: 'flex',
		flexDirection: 'column',
		gap: space[8],
		paddingBlock: space[6],
		paddingInline: space[12],
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: colors.dividerSubtle,
		borderRadius: radius.small,
		backgroundColor: colors.tint
	},
	statsTitle: { display: 'flex', alignItems: 'center', gap: space[6], minWidth: 0 },
	legendDot: {
		width: '0.625rem',
		height: '0.625rem',
		flexShrink: 0,
		borderRadius: radius.full,
		backgroundColor: colors.main
	},
	definitionList: {
		display: 'flex',
		flexDirection: 'column',
		gap: space[4],
		margin: 0,
		color: colors.primary
	},
	definitionRow: {
		display: 'grid',
		gridTemplateColumns: '2.6875rem minmax(0, 1fr)',
		gap: space[12]
	},
	swap: { width: '100%', height: space[32], backgroundColor: colors.component },
	swapIcon: { width: space[16], height: space[16] }
});
