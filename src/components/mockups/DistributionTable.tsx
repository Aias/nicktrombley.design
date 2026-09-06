import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { ui } from '../../styles/primitives';
import { colors, radius, space, typeScale } from '../../styles/tokens.stylex';

export interface DistributionRow {
	id: string;
	analyte: string;
	formula: string;
	values: number[];
	catalogId?: string;
	imageSrc?: string;
}

export interface DistributionTableProps {
	rows?: DistributionRow[];
	unitLabel?: string;
	onRowSelect?: (row: DistributionRow) => void;
}

type SortKey = 'analyte' | 'formula' | 'median';

const defaultRows: DistributionRow[] = [
	{
		id: 'fucose',
		analyte: 'L-Fucose',
		formula: 'C₆H₁₂O₅',
		values: [2.4, 2.5, 3.1, 4.7, 5.2, 5.6, 6.1, 6.4, 7.9, 8.1, 9.4, 10.8],
		catalogId: '439554',
		imageSrc: '/mockup-icons/charts/DistributionTable/imgImage.png'
	},
	{
		id: 'lysine',
		analyte: 'Lysine',
		formula: 'C₆H₁₄N₂O₂',
		values: [1.9, 2.1, 2.3, 2.8, 3.6, 4.4, 5.7, 6.9, 8.2, 10.1, 11.5, 13.2],
		catalogId: '5962',
		imageSrc: '/mockup-icons/charts/DistributionTable/imgImage1.png'
	},
	{
		id: 'glucose',
		analyte: 'D-Glucose',
		formula: 'C₆H₁₂O₆',
		values: [2.1, 2.4, 3.2, 3.5, 4.2, 4.4, 4.7, 5.1, 5.5, 6.3, 7.8, 9.2, 10.6, 11.9],
		catalogId: '64689',
		imageSrc: '/mockup-icons/charts/DistributionTable/imgImage2.png'
	},
	{
		id: 'glutamine',
		analyte: 'Glutamine',
		formula: 'C₅H₁₀N₂O₃',
		values: [1.8, 2.2, 2.9, 3.1, 3.7, 4.2, 5.8, 7.4, 8.1, 9.8, 10.2, 12.1],
		catalogId: '5961',
		imageSrc: '/mockup-icons/charts/DistributionTable/imgImage3.png'
	}
];

function median(values: number[]) {
	const sorted = values.toSorted((left, right) => left - right);
	if (sorted.length === 0) return 0;
	const middle = Math.floor(sorted.length / 2);
	const upper = sorted[middle] ?? 0;
	const lower = sorted[middle - 1] ?? upper;
	return sorted.length % 2 === 0 ? (lower + upper) / 2 : upper;
}

function Scatter({ values, label }: { values: number[]; label: string }) {
	const maximum = Math.max(1, ...values);
	const center = median(values);
	return (
		<svg
			{...stylex.props(styles.distribution)}
			aria-label={`${label} distribution, median ${center.toFixed(1)}`}
		>
			<title>{`${label} distribution, median ${center.toFixed(1)}`}</title>
			<line
				x1="0"
				y1="50%"
				x2="100%"
				y2="50%"
				stroke="currentColor"
				opacity="0.2"
				vectorEffect="non-scaling-stroke"
			/>
			<line
				x1={`${((4 + (center / maximum) * 272) / 280) * 100}%`}
				y1="15.625%"
				x2={`${((4 + (center / maximum) * 272) / 280) * 100}%`}
				y2="84.375%"
				stroke="currentColor"
				strokeWidth="0.1875rem"
				vectorEffect="non-scaling-stroke"
			/>
			{values.map((value, index) => (
				<circle
					key={`${value}-${index}`}
					cx={`${((4 + (value / maximum) * 272) / 280) * 100}%`}
					cy={`${((12 + ((index * 7) % 9)) / 32) * 100}%`}
					r="0.1875rem"
					{...stylex.props(styles.point)}
					opacity="0.5"
				>
					<title>{value.toFixed(1)}</title>
				</circle>
			))}
		</svg>
	);
}

export function DistributionTable({
	rows = defaultRows,
	unitLabel = 'µM',
	onRowSelect
}: DistributionTableProps) {
	const [sort, setSort] = useState<SortKey>();
	const [descending, setDescending] = useState(false);
	const [selectedId, setSelectedId] = useState('');
	const sorted = sort
		? rows.toSorted((left, right) => {
				const result =
					sort === 'median'
						? median(left.values) - median(right.values)
						: left[sort].localeCompare(right[sort]);
				return descending ? -result : result;
			})
		: rows;
	const setSorting = (next: SortKey) => {
		if (next === sort) setDescending(!descending);
		else {
			setSort(next);
			setDescending(false);
		}
	};

	return (
		<div
			{...stylex.props(ui.mockup, ui.panel, styles.root)}
			aria-label="Analyte concentration distributions"
		>
			<div {...stylex.props(styles.content)}>
				<div {...stylex.props(styles.header)}>
					<button
						{...stylex.props(styles.heading, styles.analyteHeading)}
						onClick={() => setSorting('analyte')}
					>
						Analyte {sort === 'analyte' ? (descending ? '↓' : '↑') : ''}
					</button>
					<button {...stylex.props(styles.heading)} onClick={() => setSorting('formula')}>
						Formula {sort === 'formula' ? (descending ? '↓' : '↑') : ''}
					</button>
					<button {...stylex.props(styles.heading)} onClick={() => setSorting('median')}>
						Concentrations <span {...stylex.props(ui.hint)}>({unitLabel})</span>{' '}
						{sort === 'median' ? (descending ? '↓' : '↑') : ''}
					</button>
				</div>
				<div {...stylex.props(styles.body)}>
					{sorted.map((row) => (
						<button
							key={row.id}
							{...stylex.props(styles.row, selectedId === row.id && styles.selected)}
							onClick={() => {
								setSelectedId(row.id);
								onRowSelect?.(row);
							}}
							aria-pressed={selectedId === row.id}
						>
							<span {...stylex.props(styles.analyte)}>
								<span {...stylex.props(styles.chemicalImage)}>
									{row.imageSrc ? (
										<img {...stylex.props(styles.chemicalImageAsset)} src={row.imageSrc} alt="" />
									) : null}
								</span>
								<span {...stylex.props(styles.copy, ui.truncate)}>
									<strong {...stylex.props(ui.caption, ui.truncate)}>{row.analyte}</strong>
									{row.catalogId ? (
										<small {...stylex.props(ui.tiny, ui.hint)}>#{row.catalogId}</small>
									) : null}
								</span>
							</span>
							<span {...stylex.props(styles.formula, styles.formulaValue)}>{row.formula}</span>
							<span {...stylex.props(styles.concentrations)}>
								<Scatter values={row.values} label={row.analyte} />
							</span>
						</button>
					))}
				</div>
			</div>
		</div>
	);
}

const styles = stylex.create({
	root: { overflowX: 'auto', overflowY: 'hidden' },
	content: {
		display: 'flex',
		flexDirection: 'column',
		minWidth: `calc(10.75rem + 7rem + 10rem + ${space[8]} * 2)`,
		height: '100%'
	},
	header: {
		display: 'grid',
		gridTemplateColumns: '10.75rem 7rem minmax(10rem, 1fr)',
		flexShrink: 0,
		height: space[32],
		paddingInline: space[8],
		borderBottomWidth: 1,
		borderBottomStyle: 'solid',
		borderBottomColor: colors.divider,
		backgroundColor: colors.tint
	},
	heading: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: space[4],
		paddingInline: space[8],
		borderWidth: 0,
		backgroundColor: 'transparent',
		color: colors.accent,
		fontSize: typeScale.body,
		lineHeight: typeScale.bodyLine,
		fontWeight: 550,
		cursor: 'pointer',
		textAlign: 'center',
		whiteSpace: 'nowrap'
	},
	analyteHeading: { justifyContent: 'flex-start' },
	body: { flex: '1', minHeight: 0, overflowX: 'hidden', overflowY: 'auto' },
	row: {
		display: 'grid',
		gridTemplateColumns: '10.75rem 7rem minmax(10rem, 1fr)',
		alignItems: 'center',
		width: '100%',
		minHeight: space[48],
		paddingInline: space[8],
		borderWidth: 0,
		borderBottomWidth: 1,
		borderBottomStyle: 'solid',
		borderBottomColor: colors.divider,
		backgroundColor: { 'default': 'transparent', ':hover': colors.tint },
		color: colors.primary,
		textAlign: 'left',
		cursor: 'pointer'
	},
	selected: { backgroundColor: colors.tint },
	analyte: {
		display: 'flex',
		alignItems: 'center',
		gap: space[8],
		minWidth: 0,
		paddingInline: space[8]
	},
	formula: { minWidth: 0, paddingInline: space[8] },
	concentrations: { display: 'flex', minWidth: 0, paddingInline: space[8] },
	chemicalImage: {
		display: 'block',
		width: space[24],
		height: space[24],
		flexShrink: 0,
		overflow: 'hidden',
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: colors.dividerSubtle,
		borderRadius: radius.small,
		backgroundColor: colors.background
	},
	chemicalImageAsset: {
		display: 'block',
		width: '100%',
		height: '100%',
		objectFit: 'cover',
		filter: 'saturate(0)'
	},
	copy: {
		display: 'inline-flex',
		maxWidth: '100%',
		minWidth: 0,
		alignItems: 'baseline',
		gap: space[4],
		verticalAlign: 'middle'
	},
	formulaValue: { color: colors.accent, fontWeight: 550, textAlign: 'center' },
	point: { fill: colors.symbol, stroke: colors.border, strokeWidth: '0.0625rem' },
	distribution: {
		display: 'block',
		flex: '1',
		minWidth: 0,
		height: space[32],
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: colors.divider,
		borderRadius: radius.tiny,
		backgroundColor: colors.component,
		color: colors.symbol,
		overflow: 'hidden'
	}
});
