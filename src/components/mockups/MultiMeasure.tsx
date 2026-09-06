import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { area, curveMonotoneX } from 'd3-shape';
import { ui } from '../../styles/primitives';
import { colors, radius, space, typeScale } from '../../styles/tokens.stylex';
import { MockupIcon } from './MockupIcon';

export interface MeasureSeries {
	id: string;
	name: string;
	values: number[];
	trend?: number[];
}

export interface MultiMeasureProps {
	title?: string;
	periodLabels?: string[];
	trendLabels?: string[];
	availableMeasures?: MeasureSeries[];
	initialMeasureIds?: string[];
	onMeasuresChange?: (measures: MeasureSeries[]) => void;
}

const defaultMeasures: MeasureSeries[] = [
	{
		id: 'breast-screening',
		name: 'Breast Cancer Screening',
		values: [20, 30, 30, 50, 30, 50, 20, 80, 10, 90, 80, 100]
	},
	{
		id: 'a1c',
		name: 'Hemoglobin A1C Testing',
		values: [30, 30, 20, 50, 70, 50, 10, 50, 80, 50, 90, 80],
		trend: [
			78, 84, 81, 86, 88, 85, 87, 79, 81, 83, 80, 84, 86, 92, 86, 88, 86, 89, 93, 82, 92, 88, 90,
			88, 91, 92, 89, 93, 90, 86, 90, 94, 91, 93, 96, 95
		]
	},
	{
		id: 'eye-exam',
		name: 'Diabetes Eye Exam',
		values: [10, 20, 20, 30, 10, 70, 30, 40, 10, 70, 80, 90]
	},
	{
		id: 'influenza',
		name: 'Influenza Immunization',
		values: [20, 10, 50, 20, 30, 40, 20, 40, 80, 30, 80, 100]
	},
	{
		id: 'blood-pressure',
		name: 'Controlling High Blood Pressure',
		values: [42, 46, 55, 58, 64, 69, 73, 76, 79, 84, 88, 92]
	}
];
const defaultPeriods = [
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul'
];
const defaultTrendLabels = ['2018', 'Feb', 'Mar', 'May', 'Jun', 'Jul', 'Today'];

export function MultiMeasure({
	title = 'Measure Performance Trending',
	periodLabels = defaultPeriods,
	trendLabels = defaultTrendLabels,
	availableMeasures = defaultMeasures,
	initialMeasureIds,
	onMeasuresChange
}: MultiMeasureProps) {
	const [selection, setSelectedIds] = useState<string[]>();
	const selectedIds =
		selection ?? initialMeasureIds ?? availableMeasures.slice(0, 4).map((measure) => measure.id);
	const [activeId, setActiveId] = useState('a1c');
	const [candidateId, setCandidateId] = useState('');
	const [periodCount, setPeriodCount] = useState<6 | 12>(12);
	const selected = selectedIds.flatMap((id) => {
		const measure = availableMeasures.find((candidate) => candidate.id === id);
		return measure ? [measure] : [];
	});
	const active = selected.find((measure) => measure.id === activeId) ?? selected[0];
	const trend = active?.trend ?? active?.values ?? [];
	const activeTrend = trend.slice(-Math.ceil((trend.length * periodCount) / 12));
	const domainMinimum = Math.min(75, ...activeTrend);
	const domainMaximum = Math.max(100, ...activeTrend);
	const domainRange = Math.max(1, domainMaximum - domainMinimum);
	const chartX = (index: number) => 4 + (index / Math.max(1, activeTrend.length - 1)) * 252;
	const chartY = (value: number) => 4 + ((domainMaximum - value) / domainRange) * 64;
	const trendArea = area<number>()
		.x((_value, index) => chartX(index))
		.y0(68)
		.y1(chartY)
		.curve(curveMonotoneX);
	const areaPath = trendArea(activeTrend);
	const linePath = trendArea.lineY1()(activeTrend);
	const update = (ids: string[]) => {
		setSelectedIds(ids);
		onMeasuresChange?.(
			ids.flatMap((id) => {
				const measure = availableMeasures.find((candidate) => candidate.id === id);
				return measure ? [measure] : [];
			})
		);
	};
	const togglePeriod = () => setPeriodCount(periodCount === 12 ? 6 : 12);

	return (
		<section {...stylex.props(ui.mockup, ui.panel, styles.root)} aria-label={title}>
			<div {...stylex.props(styles.top)}>
				<header {...stylex.props(ui.row)}>
					<h2 {...stylex.props(ui.title, ui.truncate, styles.grow)}>{title}</h2>
					<button {...stylex.props(styles.periodButton)} onClick={togglePeriod}>
						{`Last ${periodCount} months`}
						<MockupIcon
							src="/mockup-icons/charts/MultiMeasure/imgCaretSort.svg"
							iconStyle={styles.periodIcon}
						/>
					</button>
				</header>
				<div {...stylex.props(styles.addRow)}>
					<label {...stylex.props(styles.picker)}>
						<select
							{...stylex.props(styles.pickerSelect)}
							value={candidateId}
							onChange={(event) => setCandidateId(event.currentTarget.value)}
							aria-label="Measure to add"
						>
							<option value="">Select a measure....</option>
							{availableMeasures.map((measure) => (
								<option key={measure.id} value={measure.id}>
									{measure.name}
								</option>
							))}
						</select>
						<MockupIcon
							src="/mockup-icons/charts/MultiMeasure/imgMagnifyingGlass.svg"
							iconStyle={styles.pickerIcon}
						/>
					</label>
					<button
						{...stylex.props(styles.addButton)}
						onClick={() => {
							if (candidateId) {
								if (selectedIds.includes(candidateId)) setActiveId(candidateId);
								else {
									update([...selectedIds, candidateId]);
									setActiveId(candidateId);
								}
							}
						}}
					>
						<MockupIcon
							src="/mockup-icons/charts/MultiMeasure/imgLeftIcon.svg"
							iconStyle={styles.addIcon}
						/>
						{selectedIds.includes(candidateId) ? 'View Measure' : 'Add to List'}
					</button>
				</div>
				<div {...stylex.props(ui.scrollFade, styles.heatmap)}>
					{selected.map((measure) => (
						<button
							key={measure.id}
							{...stylex.props(styles.measureRow, active?.id === measure.id && styles.activeRow)}
							onClick={() => setActiveId(measure.id)}
						>
							<span {...stylex.props(ui.caption, ui.truncate, styles.measureName)}>
								<MockupIcon
									src="/mockup-icons/charts/MultiMeasure/imgDragHandleDots2.svg"
									iconStyle={styles.dragIcon}
								/>
								<span {...stylex.props(ui.truncate)}>{measure.name}</span>
							</span>
							<span {...stylex.props(styles.cells)}>
								{measure.values.slice(-periodCount).map((value, index) => (
									<span
										key={`${measure.id}-${periodLabels.slice(-periodCount)[index] ?? index}`}
										{...stylex.props(styles.cell(Math.max(0.1, Math.min(1, value / 100))))}
										title={`${periodLabels.slice(-periodCount)[index] ?? `Period ${index + 1}`}: ${value}%`}
									/>
								))}
							</span>
						</button>
					))}
				</div>
			</div>
			<div {...stylex.props(styles.details)}>
				<header {...stylex.props(ui.row)}>
					<span>Measure Details</span>
					<span {...stylex.props(styles.divider)} />
					<span {...stylex.props(ui.caption, ui.secondary, ui.truncate, styles.grow)}>
						{active?.name ?? 'Select a measure'}
					</span>
					<button
						{...stylex.props(styles.iconButton)}
						aria-label="Change measurement period"
						onClick={togglePeriod}
					>
						<MockupIcon
							src="/mockup-icons/charts/MultiMeasure/imgCalendar.svg"
							iconStyle={styles.detailIcon}
						/>
					</button>
					{active ? (
						<button
							{...stylex.props(styles.iconButton)}
							aria-label={`Remove ${active.name}`}
							onClick={() => update(selectedIds.filter((id) => id !== active.id))}
						>
							<MockupIcon
								src="/mockup-icons/charts/MultiMeasure/imgCross2.svg"
								iconStyle={styles.detailIcon}
							/>
						</button>
					) : null}
				</header>
				{active ? (
					<div {...stylex.props(styles.detailBody)}>
						<div {...stylex.props(styles.chartLayout)}>
							<div {...stylex.props(ui.tiny, ui.hint, styles.yAxis)}>
								<span>{domainMaximum}%</span>
								<span>{domainMinimum}%</span>
							</div>
							<div {...stylex.props(styles.chartColumn)}>
								<div {...stylex.props(styles.trendPlot)}>
									<svg
										{...stylex.props(styles.trendChart)}
										viewBox="0 0 260 72"
										preserveAspectRatio="none"
										aria-label={`${active.name} trend over the last ${periodCount} months`}
									>
										<title>{`${active.name} trend over the last ${periodCount} months`}</title>
										{areaPath ? <path d={areaPath} fill="currentColor" opacity="0.08" /> : null}
										<line
											x1="4"
											y1="68"
											x2="256"
											y2="68"
											stroke="currentColor"
											opacity="0.25"
											vectorEffect="non-scaling-stroke"
										/>
										{linePath ? (
											<path
												d={linePath}
												fill="none"
												stroke="currentColor"
												strokeWidth="0.09375rem"
												vectorEffect="non-scaling-stroke"
											/>
										) : null}
									</svg>
									<svg {...stylex.props(styles.trendMarkers)} aria-hidden="true">
										{activeTrend.length > 0 ? (
											<>
												<circle
													cx={`${(chartX(0) / 260) * 100}%`}
													cy={`${(chartY(activeTrend[0] ?? domainMinimum) / 72) * 100}%`}
													r="0.15625rem"
													fill="currentColor"
												/>
												<circle
													cx={`${(chartX(activeTrend.length - 1) / 260) * 100}%`}
													cy={`${(chartY(activeTrend.at(-1) ?? domainMinimum) / 72) * 100}%`}
													r="0.15625rem"
													fill="currentColor"
												/>
											</>
										) : null}
									</svg>
								</div>
								<div {...stylex.props(ui.tiny, ui.hint, styles.xAxis)}>
									{trendLabels.slice(-Math.min(periodCount, trendLabels.length)).map((label) => (
										<span key={label}>{label}</span>
									))}
								</div>
							</div>
						</div>
						<div {...stylex.props(styles.lastMeasured)}>
							<strong {...stylex.props(ui.heading, styles.lastValue)}>
								{activeTrend.at(-1) ?? 0}%
							</strong>
							<span {...stylex.props(ui.tiny, ui.secondary)}>
								Last
								<br />
								Measured
							</span>
						</div>
					</div>
				) : (
					<p {...stylex.props(ui.caption, ui.hint)}>Add a measure to compare its performance.</p>
				)}
			</div>
		</section>
	);
}

const styles = stylex.create({
	root: { display: 'flex', flexDirection: 'column' },
	top: {
		display: 'flex',
		flex: '1',
		minHeight: 0,
		flexDirection: 'column',
		gap: space[8],
		paddingBlock: space[12],
		paddingInline: space[16]
	},
	grow: { flex: '1' },
	periodButton: {
		display: 'inline-flex',
		alignItems: 'center',
		gap: space[4],
		padding: 0,
		borderWidth: 0,
		backgroundColor: 'transparent',
		color: colors.secondary,
		fontSize: typeScale.caption,
		lineHeight: typeScale.captionLine,
		fontWeight: 475,
		cursor: 'pointer'
	},
	periodIcon: { width: '0.875rem', height: '0.875rem' },
	addRow: { display: 'flex', alignItems: 'stretch', width: '100%' },
	picker: { position: 'relative', display: 'flex', flex: '1', minWidth: 0, alignItems: 'center' },
	pickerSelect: {
		width: '100%',
		minWidth: 0,
		height: space[24],
		paddingInlineStart: space[6],
		paddingInlineEnd: space[24],
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: colors.border,
		borderRadius: `${radius.tiny} 0 0 ${radius.tiny}`,
		backgroundColor: colors.container,
		color: colors.ghost,
		fontSize: typeScale.tiny,
		lineHeight: typeScale.tinyLine,
		appearance: 'none'
	},
	pickerIcon: {
		position: 'absolute',
		insetInlineEnd: space[6],
		width: space[12],
		height: space[12],
		pointerEvents: 'none'
	},
	addButton: {
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: space[6],
		height: space[24],
		paddingInline: space[8],
		borderWidth: 1,
		borderInlineStartWidth: 0,
		borderStyle: 'solid',
		borderColor: colors.border,
		borderRadius: `0 ${radius.small} ${radius.small} 0`,
		backgroundColor: { 'default': colors.component, ':hover': colors.tint },
		color: colors.accent,
		fontSize: typeScale.tiny,
		lineHeight: typeScale.tinyLine,
		fontWeight: 550,
		cursor: 'pointer'
	},
	addIcon: { width: space[12], height: space[12] },
	heatmap: {
		display: 'flex',
		flex: '1',
		minHeight: 0,
		flexDirection: 'column',
		justifyContent: 'center',
		gap: '0.0625rem',
		overflow: 'auto'
	},
	measureRow: {
		display: 'flex',
		alignItems: 'center',
		gap: space[12],
		width: '100%',
		minWidth: 0,
		padding: 0,
		borderWidth: 0,
		backgroundColor: { 'default': 'transparent', ':hover': colors.tint },
		color: colors.accent,
		cursor: 'pointer',
		textAlign: 'left'
	},
	activeRow: { backgroundColor: colors.tint, color: colors.primary, fontWeight: 575 },
	measureName: { display: 'inline-flex', alignItems: 'center', flex: '1', gap: space[4] },
	dragIcon: { flexShrink: 0, width: space[12], height: space[12] },
	cells: {
		display: 'flex',
		gap: '0.0625rem',
		width: '12.6875rem',
		maxWidth: '58%',
		borderRadius: radius.tiny,
		overflow: 'hidden'
	},
	cell: (opacity: number) => ({
		flex: '1',
		aspectRatio: '1',
		minWidth: '0.35rem',
		maxWidth: space[16],
		backgroundColor: colors.main,
		opacity
	}),
	details: {
		display: 'flex',
		minHeight: '7rem',
		flexDirection: 'column',
		gap: space[8],
		flexShrink: 0,
		paddingBlock: space[12],
		paddingInline: space[16],
		borderTopWidth: 1,
		borderTopStyle: 'solid',
		borderTopColor: colors.divider
	},
	divider: { width: 1, height: space[12], backgroundColor: colors.divider },
	iconButton: {
		display: 'inline-flex',
		width: space[24],
		height: space[24],
		alignItems: 'center',
		justifyContent: 'center',
		padding: 0,
		borderWidth: 0,
		backgroundColor: 'transparent',
		cursor: 'pointer'
	},
	detailIcon: { width: space[16], height: space[16] },
	detailBody: { display: 'flex', flex: '1', minHeight: 0, alignItems: 'stretch', gap: space[16] },
	chartLayout: { display: 'flex', flex: '1', minWidth: 0, gap: space[4] },
	yAxis: {
		display: 'flex',
		width: '2.5rem',
		flexDirection: 'column',
		justifyContent: 'space-between',
		paddingBottom: space[16],
		textAlign: 'right'
	},
	chartColumn: { display: 'flex', flex: '1', minWidth: 0, flexDirection: 'column' },
	trendPlot: {
		position: 'relative',
		display: 'flex',
		flex: '1',
		minHeight: 0,
		flexDirection: 'column'
	},
	trendMarkers: {
		position: 'absolute',
		inset: 0,
		width: '100%',
		height: '100%',
		color: colors.symbol,
		pointerEvents: 'none',
		overflow: 'visible'
	},
	trendChart: {
		display: 'block',
		flex: '1',
		width: '100%',
		minHeight: 0,
		color: colors.symbol,
		overflow: 'visible'
	},
	xAxis: { display: 'flex', justifyContent: 'space-between', flexShrink: 0, whiteSpace: 'nowrap' },
	lastMeasured: {
		display: 'flex',
		width: '4.5rem',
		flexShrink: 0,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		textAlign: 'center'
	},
	lastValue: {
		color: colors.accent,
		fontSize: typeScale.heading,
		lineHeight: typeScale.headingLine,
		fontWeight: 375
	}
});
