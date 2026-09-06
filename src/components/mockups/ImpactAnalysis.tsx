import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { ui } from '../../styles/primitives';
import { colors, space, typeScale } from '../../styles/tokens.stylex';
import { MockupIcon } from './MockupIcon';

export interface ImpactFactor {
	id: string;
	label: string;
	value: string | number;
	decrease: number;
	increase: number;
}

export interface ImpactAnalysisProps {
	factors?: ImpactFactor[];
	onFactorSelect?: (factor: ImpactFactor) => void;
}

const defaultFactors: ImpactFactor[] = [
	{ id: 'rules', label: 'Unique Rules', value: 1, decrease: 0.23, increase: 0 },
	{ id: 'detections', label: 'High-Scoring Detections', value: 8, decrease: 0, increase: 0.2 },
	{ id: 'rarity', label: 'Top-10% Rarity Detections', value: 4, decrease: 0, increase: 0.15 },
	{ id: 'use-cases', label: 'Unique Use Cases', value: 1, decrease: 0, increase: 0 },
	{ id: 'tactics', label: 'Unique MITRE Tactics', value: 4, decrease: 0, increase: 0.27 },
	{ id: 'techniques', label: 'Unique MITRE Techniques', value: 7, decrease: 0, increase: 0.15 },
	{ id: 'tier-one', label: 'Tier 1 Entity Affected?', value: 'No', decrease: 0.1, increase: 0 }
];

function impactLabel(factor: ImpactFactor) {
	if (factor.increase > factor.decrease) return 'Increase';
	if (factor.decrease > factor.increase) return 'Decrease';
	return 'None';
}

function WeightGraphic({ factor, maximum }: { factor: ImpactFactor; maximum: number }) {
	const decreaseX = 50 - (factor.decrease / maximum) * 42;
	const increaseX = 50 + (factor.increase / maximum) * 42;
	return (
		<span {...stylex.props(styles.weightGraphic)}>
			<span {...stylex.props(styles.change, factor.decrease === 0 && styles.inactive)}>
				<MockupIcon
					src="/mockup-icons/charts/ImpactAnalysis/imgMinus.svg"
					iconStyle={styles.changeIcon}
				/>
				{factor.decrease.toFixed(2)}
			</span>
			<svg
				{...stylex.props(
					styles.weightTrack,
					factor.increase === 0 && styles.decreaseMark,
					factor.increase === 0 && factor.decrease === 0 && styles.neutralMark
				)}
				aria-hidden="true"
			>
				<line
					x1="4%"
					y1="50%"
					x2="96%"
					y2="50%"
					stroke="currentColor"
					opacity="0.16"
					vectorEffect="non-scaling-stroke"
				/>
				{factor.decrease > 0 ? (
					<line
						{...stylex.props(styles.decreaseMark)}
						x1="50%"
						y1="50%"
						x2={`${decreaseX}%`}
						y2="50%"
						stroke="currentColor"
						vectorEffect="non-scaling-stroke"
					/>
				) : null}
				{factor.increase > 0 ? (
					<line
						x1="50%"
						y1="50%"
						x2={`${increaseX}%`}
						y2="50%"
						stroke="currentColor"
						vectorEffect="non-scaling-stroke"
					/>
				) : null}
				<circle cx="50%" cy="50%" r={`${1 / 6}rem`} fill="currentColor" />
				{factor.decrease > 0 ? (
					<circle
						{...stylex.props(styles.decreaseMark)}
						cx={`${decreaseX}%`}
						cy="50%"
						r={`${1 / 6}rem`}
						fill="currentColor"
					/>
				) : null}
				{factor.increase > 0 ? (
					<circle cx={`${increaseX}%`} cy="50%" r={`${1 / 6}rem`} fill="currentColor" />
				) : null}
			</svg>
			<span {...stylex.props(styles.change, factor.increase === 0 && styles.inactive)}>
				<MockupIcon
					src="/mockup-icons/charts/ImpactAnalysis/imgPlus.svg"
					iconStyle={styles.changeIcon}
				/>
				{factor.increase.toFixed(2)}
			</span>
		</span>
	);
}

export function ImpactAnalysis({ factors = defaultFactors, onFactorSelect }: ImpactAnalysisProps) {
	const [selectedId, setSelectedId] = useState('');
	const maximum = Math.max(
		0.01,
		...factors.flatMap((factor) => [factor.decrease, factor.increase])
	);
	return (
		<div {...stylex.props(ui.mockup, ui.panel)} aria-label="Impact analysis">
			<div {...stylex.props(ui.scrollFade, styles.viewport)}>
				<div {...stylex.props(styles.content)}>
					<div {...stylex.props(styles.row, styles.header)}>
						<span>Factor</span>
						<span {...stylex.props(styles.value)}>Value</span>
						<span {...stylex.props(styles.weightHeading)}>Weight vs. Reference</span>
						<span>Impact</span>
					</div>
					<div {...stylex.props(ui.scrollFade, styles.body)}>
						{factors.map((factor) => {
							const impact = impactLabel(factor);
							return (
								<button
									key={factor.id}
									{...stylex.props(
										styles.row,
										styles.dataRow,
										selectedId === factor.id && styles.selected
									)}
									onClick={() => {
										setSelectedId(factor.id);
										onFactorSelect?.(factor);
									}}
									aria-pressed={selectedId === factor.id}
								>
									<span {...stylex.props(ui.truncate)}>{factor.label}</span>
									<span {...stylex.props(styles.value)}>{factor.value}</span>
									<WeightGraphic factor={factor} maximum={maximum} />
									<span {...stylex.props(styles.impact, impact === 'None' && styles.none)}>
										{impact === 'Increase' ? (
											<MockupIcon
												src="/mockup-icons/charts/ImpactAnalysis/imgArrowTopRight.svg"
												iconStyle={styles.impactIcon}
											/>
										) : null}
										{impact === 'Decrease' ? (
											<MockupIcon
												src="/mockup-icons/charts/ImpactAnalysis/imgArrowBottomRight.svg"
												iconStyle={styles.impactIcon}
											/>
										) : null}
										{impact === 'None' ? <span aria-hidden="true">−</span> : null}
										{impact}
									</span>
								</button>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}

const styles = stylex.create({
	viewport: {
		width: '100%',
		height: '100%',
		minWidth: 0,
		minHeight: 0,
		overflowX: 'auto',
		overflowY: 'hidden'
	},
	content: {
		display: 'flex',
		flexDirection: 'column',
		minWidth: `calc(10rem + 3rem + 13rem + 6.125rem + ${space[12]} * 5)`,
		height: '100%'
	},
	body: {
		display: 'flex',
		flex: '1',
		minHeight: 0,
		flexDirection: 'column',
		overflowX: 'hidden',
		overflowY: 'auto'
	},
	row: {
		display: 'grid',
		gridTemplateColumns: 'minmax(10rem, 1fr) 3rem 13rem 6.125rem',
		alignItems: 'center',
		gap: space[12],
		width: '100%',
		paddingBlock: space[6],
		paddingInline: space[12]
	},
	header: {
		flexShrink: 0,
		minHeight: space[32],
		backgroundColor: colors.component,
		color: colors.secondary,
		fontSize: typeScale.caption,
		lineHeight: typeScale.captionLine,
		fontWeight: 475
	},
	dataRow: {
		flex: '1',
		minHeight: '1.75rem',
		borderWidth: 0,
		borderTopWidth: 1,
		borderTopStyle: 'solid',
		borderTopColor: colors.divider,
		backgroundColor: { 'default': 'transparent', ':hover': colors.tint },
		color: colors.primary,
		fontSize: typeScale.caption,
		lineHeight: typeScale.captionLine,
		textAlign: 'left',
		cursor: 'pointer'
	},
	selected: { backgroundColor: colors.tint },
	value: { textAlign: 'center' },
	weightHeading: { textAlign: 'center' },
	weightGraphic: {
		display: 'grid',
		gridTemplateColumns: '3rem minmax(0, 1fr) 3rem',
		alignItems: 'center',
		gap: space[4],
		minWidth: 0
	},
	change: { display: 'inline-flex', alignItems: 'center', gap: space[2], whiteSpace: 'nowrap' },
	inactive: { opacity: 0.15 },
	changeIcon: { width: space[12], height: space[12] },
	weightTrack: {
		strokeWidth: '0.0625rem',
		display: 'block',
		width: '100%',
		height: space[16],
		color: colors.main,
		overflow: 'visible'
	},
	decreaseMark: { color: colors.borderActive },
	neutralMark: { color: colors.divider },
	impact: {
		display: 'flex',
		alignItems: 'center',
		gap: space[4],
		minWidth: 0,
		color: colors.accent,
		fontWeight: 475
	},
	impactIcon: { width: space[16], height: space[16] },
	none: { color: colors.hint }
});
