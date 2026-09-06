import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { ui } from '../../styles/primitives';
import { colors, radius, space } from '../../styles/tokens.stylex';
import { MockupIcon } from './MockupIcon';

export interface MetricPoint {
	week: number;
	minimum: number;
	firstQuartile: number;
	median: number;
	thirdQuartile: number;
	maximum: number;
}

export interface MetricSeries {
	id: string;
	label: string;
	yAxisLines: [string, string, string];
	points: MetricPoint[];
}

export interface SingleMetricProps {
	title?: string;
	owner?: string;
	metrics?: MetricSeries[];
	initialMetricId?: string;
	onMetricChange?: (metric: MetricSeries) => void;
}

const workloadPoints: MetricPoint[] = [
	{ week: 0, minimum: 74, firstQuartile: 91, median: 98, thirdQuartile: 110, maximum: 118 },
	{ week: 1.5, minimum: 74, firstQuartile: 87, median: 93, thirdQuartile: 105, maximum: 111 },
	{ week: 3, minimum: 71, firstQuartile: 78, median: 86, thirdQuartile: 96, maximum: 104 },
	{ week: 4.5, minimum: 59, firstQuartile: 77, median: 85, thirdQuartile: 99, maximum: 106 },
	{ week: 6, minimum: 54, firstQuartile: 65, median: 71, thirdQuartile: 84, maximum: 91 },
	{ week: 7.5, minimum: 38, firstQuartile: 60, median: 69, thirdQuartile: 85, maximum: 98 },
	{ week: 9, minimum: 39, firstQuartile: 56, median: 66, thirdQuartile: 82, maximum: 91 },
	{ week: 10.5, minimum: 39, firstQuartile: 45, median: 51, thirdQuartile: 56, maximum: 94 },
	{ week: 12, minimum: 28, firstQuartile: 36, median: 52, thirdQuartile: 74, maximum: 85 },
	{ week: 13.5, minimum: 23, firstQuartile: 32, median: 45, thirdQuartile: 60, maximum: 73 },
	{ week: 15, minimum: 29, firstQuartile: 36, median: 49, thirdQuartile: 63, maximum: 90 },
	{ week: 16.5, minimum: 33, firstQuartile: 41, median: 50, thirdQuartile: 59, maximum: 81 },
	{ week: 18, minimum: 18, firstQuartile: 25, median: 35, thirdQuartile: 43, maximum: 61 },
	{ week: 19.5, minimum: 13, firstQuartile: 22, median: 33, thirdQuartile: 54, maximum: 68 },
	{ week: 21, minimum: 4, firstQuartile: 13, median: 24, thirdQuartile: 29, maximum: 55 },
	{ week: 22.5, minimum: 6, firstQuartile: 12, median: 16, thirdQuartile: 23, maximum: 35 },
	{ week: 24, minimum: 4, firstQuartile: 8, median: 12, thirdQuartile: 17, maximum: 21 }
];

const defaultMetrics: MetricSeries[] = [
	{
		id: 'nursing-effort',
		label: 'Nursing Effort by Case Duration',
		yAxisLines: ['Minutes', 'Spent', 'Per Case'],
		points: workloadPoints
	},
	{
		id: 'documentation',
		label: 'Documentation Time by Case Duration',
		yAxisLines: ['Minutes', 'Spent', 'Per Case'],
		points: workloadPoints.map((point) => ({
			week: point.week,
			minimum: Math.round(point.minimum * 0.65),
			firstQuartile: Math.round(point.firstQuartile * 0.68),
			median: Math.round(point.median * 0.7),
			thirdQuartile: Math.round(point.thirdQuartile * 0.72),
			maximum: Math.round(point.maximum * 0.75)
		}))
	}
];

const emptyMetric: MetricSeries = {
	id: 'empty',
	label: 'No metric available',
	yAxisLines: ['Metric', 'Value', ''],
	points: []
};

const styles = stylex.create({
	root: {
		display: 'flex',
		flexDirection: 'column',
		gap: space[8],
		paddingBlock: space[8],
		paddingInline: space[12]
	},
	header: { flexShrink: 0 },
	owner: { flex: '1' },
	metricControl: {
		position: 'relative',
		display: 'flex',
		width: '100%',
		height: '1.625rem',
		minWidth: 0,
		alignItems: 'center',
		gap: space[2],
		paddingInline: space[6],
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: colors.border,
		borderRadius: radius.tiny,
		backgroundColor: colors.container
	},
	metricLabel: { flexShrink: 0, color: colors.accent, fontWeight: 550 },
	select: {
		appearance: 'none',
		width: '100%',
		height: '100%',
		minWidth: 0,
		paddingInline: 0,
		paddingRight: space[20],
		borderWidth: 0,
		backgroundColor: 'transparent',
		color: colors.accent,
		fontSize: '0.59375rem',
		lineHeight: '0.75rem',
		cursor: 'pointer'
	},
	caret: {
		position: 'absolute',
		right: space[6],
		width: space[12],
		height: space[12],
		pointerEvents: 'none'
	},
	chart: {
		display: 'grid',
		gridTemplateColumns: `${space[64]} minmax(0, 1fr)`,
		width: '100%',
		minHeight: 0,
		flex: '1',
		overflow: 'hidden'
	},
	yAxis: {
		position: 'relative',
		display: 'flex',
		minHeight: 0,
		alignItems: 'center',
		justifyContent: 'flex-end',
		paddingRight: space[8],
		color: colors.secondary,
		textAlign: 'right'
	},
	yMaximum: { position: 'absolute', top: 0, right: space[8], color: colors.hint },
	yLabel: { display: 'flex', flexDirection: 'column' },
	plotColumn: {
		display: 'grid',
		minWidth: 0,
		minHeight: 0,
		gridTemplateRows: 'minmax(0, 1fr) 0.75rem 1rem'
	},
	plot: {
		minWidth: 0,
		minHeight: 0,
		borderBottomWidth: 1,
		borderBottomStyle: 'solid',
		borderBottomColor: colors.divider
	},
	svg: { display: 'block', width: '100%', height: '100%', overflow: 'hidden' },
	ticks: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		color: colors.hint
	},
	xLabel: { color: colors.secondary, textAlign: 'center' },
	outerBox: { fill: colors.tone },
	innerBox: { fill: colors.paint },
	median: { stroke: colors.main, strokeWidth: 0.5, vectorEffect: 'non-scaling-stroke' },
	summary: {
		display: 'grid',
		gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
		flexShrink: 0,
		paddingBlock: space[3],
		paddingInline: space[6],
		borderRadius: radius.small,
		backgroundColor: colors.tint
	},
	summaryItem: {
		display: 'flex',
		minWidth: 0,
		alignItems: 'center',
		justifyContent: 'center',
		gap: space[8]
	}
});

function average(values: number[]) {
	return values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function SingleMetric({
	title = 'Manager Workload',
	owner = 'Ursula Franklin',
	metrics = defaultMetrics,
	initialMetricId = 'nursing-effort',
	onMetricChange
}: SingleMetricProps) {
	const [metricId, setMetricId] = useState(initialMetricId);
	const metric =
		metrics.find((candidate) => candidate.id === metricId) ?? metrics[0] ?? emptyMetric;
	const yMaximum = Math.max(
		10,
		Math.ceil(Math.max(0, ...metric.points.map((point) => point.maximum)) / 10) * 10
	);
	const maxWeek = Math.max(1, ...metric.points.map((point) => point.week));
	const points = metric.points.toSorted((left, right) => left.week - right.week);
	const normalizedWeekGaps = points
		.slice(1)
		.map((point, index) => {
			const previousPoint = points[index];
			return previousPoint ? ((point.week - previousPoint.week) / maxWeek) * 100 : 100;
		})
		.filter((gap) => gap > 0);
	const boxWidth = Math.max(
		0.5,
		Math.min(12, 80 / Math.max(1, points.length), Math.min(100, ...normalizedWeekGaps) * 0.8)
	);
	const xTicks = Array.from({ length: 4 }, (_, index) => (maxWeek * index) / 3);
	const medians = points.map((point) => point.median);
	const mean = Math.round(average(medians));
	const meanDelta = average(
		medians.slice(1).map((value, index) => Math.abs(value - (medians[index] ?? value)))
	);
	const meanChange = mean === 0 ? 0 : Math.round((meanDelta / mean) * 100);
	const position = (week: number) => boxWidth / 2 + (week / maxWeek) * (100 - boxWidth);
	const y = (value: number) => 100 - (value / yMaximum) * 100;

	return (
		<section {...stylex.props(ui.mockup, ui.panel, styles.root)} aria-label={title}>
			<header {...stylex.props(ui.row, styles.header)}>
				<h2 {...stylex.props(ui.title, ui.truncate)}>{title}</h2>
				<span {...stylex.props(ui.secondary, ui.truncate, styles.owner)}>{owner}</span>
			</header>
			<label {...stylex.props(ui.tiny, styles.metricControl)}>
				<span {...stylex.props(styles.metricLabel)}>Metric:</span>
				<select
					{...stylex.props(styles.select)}
					value={metric.id}
					onChange={(event) => {
						const nextMetric = metrics.find(
							(candidate) => candidate.id === event.currentTarget.value
						);
						if (!nextMetric) return;
						setMetricId(nextMetric.id);
						onMetricChange?.(nextMetric);
					}}
				>
					{metrics.map((candidate) => (
						<option key={candidate.id} value={candidate.id}>
							{candidate.label}
						</option>
					))}
				</select>
				<MockupIcon
					src="/mockup-icons/charts/SingleMetric/imgCaretDown.svg"
					iconStyle={styles.caret}
				/>
			</label>
			<div {...stylex.props(styles.chart)}>
				<div {...stylex.props(ui.caption, styles.yAxis)}>
					<span {...stylex.props(ui.tiny, styles.yMaximum)}>{yMaximum}</span>
					<span {...stylex.props(styles.yLabel)}>
						{metric.yAxisLines.map((line, index) => (
							<span key={`${line}-${index}`}>{line || '\u00a0'}</span>
						))}
					</span>
				</div>
				<div {...stylex.props(styles.plotColumn)}>
					<div {...stylex.props(styles.plot)}>
						<svg
							{...stylex.props(styles.svg)}
							viewBox="0 0 100 100"
							preserveAspectRatio="none"
							aria-label={`${metric.label} box plot over ${maxWeek} weeks`}
						>
							<title>{`${metric.label} box plot over ${maxWeek} weeks`}</title>
							{points.map((point) => {
								const x = position(point.week);
								return (
									<g key={point.week}>
										<rect
											{...stylex.props(styles.outerBox)}
											x={x - boxWidth / 2}
											y={y(point.maximum)}
											width={boxWidth}
											height={Math.max(0, y(point.minimum) - y(point.maximum))}
										>
											<title>{`Week ${point.week}: ${point.minimum}–${point.maximum}`}</title>
										</rect>
										<rect
											{...stylex.props(styles.innerBox)}
											x={x - boxWidth / 2}
											y={y(point.thirdQuartile)}
											width={boxWidth}
											height={Math.max(0, y(point.firstQuartile) - y(point.thirdQuartile))}
										/>
										<line
											{...stylex.props(styles.median)}
											x1={x - boxWidth / 2}
											x2={x + boxWidth / 2}
											y1={y(point.median)}
											y2={y(point.median)}
										/>
									</g>
								);
							})}
						</svg>
					</div>
					<div {...stylex.props(ui.tiny, styles.ticks)}>
						{xTicks.map((tick) => (
							<span key={tick}>{Number(tick.toFixed(1)).toLocaleString()}</span>
						))}
					</div>
					<p {...stylex.props(ui.caption, ui.truncate, styles.xLabel)}>Weeks Since Case Start</p>
				</div>
			</div>
			<div {...stylex.props(styles.summary)}>
				<div {...stylex.props(styles.summaryItem)}>
					<strong {...stylex.props(ui.heading)}>{mean}</strong>
					<span {...stylex.props(ui.tiny, ui.secondary)}>
						Avg. Minutes
						<br />
						Per Week
					</span>
				</div>
				<div {...stylex.props(styles.summaryItem)}>
					<strong {...stylex.props(ui.heading)}>{meanChange}%</strong>
					<span {...stylex.props(ui.tiny, ui.secondary)}>
						Avg. Change
						<br />
						Week to Week
					</span>
				</div>
			</div>
		</section>
	);
}
