import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { ui } from '../../styles/primitives';
import { colors, space } from '../../styles/tokens.stylex';
import { FormsIcon } from './FormsIcon';

export type ComparisonVariableChild = { id: string; label: string; public?: boolean };
export type ComparisonVariable = {
	id: string;
	label: string;
	category?: string;
	kind?: 'molecular';
	children?: ComparisonVariableChild[];
};

type VariableSelectionProps = {
	items?: ComparisonVariable[];
	selectedId?: string;
	defaultSelectedId?: string;
	onChange?: (items: ComparisonVariable[]) => void;
	onSelect?: (id: string) => void;
};

const defaultVariables: ComparisonVariable[] = [
	{ id: 'age', label: 'Current Age', category: 'Demographics' },
	{ id: 'severity', label: 'Severity Score', category: 'Clinical Data' },
	{ id: 'alt', label: 'Alanine Aminotransferase (ALT)', category: 'Clinical Data' },
	{ id: 'survival', label: 'Survival' },
	{
		id: 'saved',
		label: 'Saved Subpopulations',
		children: [
			{ id: 'smokers', label: 'Hospitalized Smokers' },
			{ id: 'covid', label: 'COVID-19 Positive Patients', public: true },
			{ id: 'profiling', label: 'Molecular Profiling Required' }
		]
	},
	{ id: 'molecular', label: 'Molecular Data', kind: 'molecular' }
];

const styles = stylex.create({
	list: { width: '100%', height: '100%', overflowY: 'auto', listStyle: 'none', padding: 0 },
	item: { borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: colors.divider },
	row: {
		display: 'flex',
		minHeight: space[32],
		alignItems: 'center',
		gap: space[12],
		paddingBlock: space[6],
		paddingInline: space[8]
	},
	categoryRow: { minHeight: space[48] },
	selected: { backgroundColor: colors.tint },
	label: {
		display: 'flex',
		minWidth: 0,
		flex: '1',
		alignItems: 'center',
		gap: space[4],
		borderWidth: 0,
		backgroundColor: 'transparent',
		color: colors.primary,
		textAlign: 'left',
		cursor: 'pointer'
	},
	labelWithCategory: { display: 'grid', gap: 0 },
	selectedLabel: { color: colors.accent, fontWeight: 550 },
	labelText: { minWidth: 0 },
	caret: { display: 'flex' },
	caretCollapsed: { rotate: '-90deg' },
	category: { gridColumnStart: '1', gridColumnEnd: '-1' },
	select: { width: space[48], height: space[24], flexShrink: 0, padding: 0 },
	selectedButton: { backgroundColor: { 'default': colors.tone, ':hover': colors.paint } },
	iconButton: {
		display: 'flex',
		width: '0.875rem',
		height: '0.875rem',
		flexShrink: 0,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 0,
		backgroundColor: 'transparent',
		cursor: 'pointer'
	},
	children: { width: '100%', listStyle: 'none', padding: 0 },
	child: {
		display: 'flex',
		height: '1.75rem',
		alignItems: 'center',
		gap: space[12],
		paddingBlock: space[4],
		paddingInline: space[8]
	},
	childSelected: { backgroundColor: colors.tint },
	check: { opacity: 0.65 },
	publicIcon: { display: 'flex', flexShrink: 0 }
});

function removeVariable(items: ComparisonVariable[], id: string) {
	return items.filter((item) => item.id !== id).map((item) => filterChildren(item, [id]));
}

function filterChildren(item: ComparisonVariable, removedIds: string[]): ComparisonVariable {
	if (!item.children) return item;
	return { ...item, children: item.children.filter((child) => !removedIds.includes(child.id)) };
}

export function VariableSelection({
	items = defaultVariables,
	selectedId,
	defaultSelectedId = 'severity',
	onChange,
	onSelect
}: VariableSelectionProps) {
	const [removedIds, setRemovedIds] = useState<string[]>([]);
	const [collapsedIds, setCollapsedIds] = useState<string[]>([]);
	const [localSelection, setLocalSelection] = useState(defaultSelectedId);
	const selection = selectedId ?? localSelection;
	const visibleItems = items
		.filter((item) => !removedIds.includes(item.id))
		.map((item) => filterChildren(item, removedIds));

	function select(id: string) {
		setLocalSelection(id);
		onSelect?.(id);
	}

	function remove(id: string) {
		setRemovedIds((current) => [...current, id]);
		onChange?.(removeVariable(visibleItems, id));
	}

	function toggle(id: string) {
		setCollapsedIds((current) =>
			current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
		);
	}

	return (
		<section {...stylex.props(ui.mockup, ui.panel)} aria-label="Comparison variables">
			<ul {...stylex.props(ui.scrollFade, styles.list)}>
				{visibleItems.map((item) => {
					const isSelected = selection === item.id;
					const isCollapsed = collapsedIds.includes(item.id);
					return (
						<li key={item.id} {...stylex.props(styles.item)}>
							<div
								{...stylex.props(
									styles.row,
									Boolean(item.category) && styles.categoryRow,
									isSelected && styles.selected
								)}
							>
								<FormsIcon name="VariableSelection-imgDragHandleDots2" />
								<button
									type="button"
									{...stylex.props(
										styles.label,
										Boolean(item.category) && styles.labelWithCategory,
										isSelected && styles.selectedLabel
									)}
									onClick={() => (item.children ? toggle(item.id) : select(item.id))}
									aria-expanded={item.children ? !isCollapsed : undefined}
								>
									<span {...stylex.props(ui.truncate, styles.labelText)}>
										{item.label}
										{item.children ? (
											<span {...stylex.props(ui.caption, ui.secondary)}>
												{' '}
												({item.children.length})
											</span>
										) : null}
									</span>
									{item.children ? (
										<span {...stylex.props(styles.caret, isCollapsed && styles.caretCollapsed)}>
											<FormsIcon name="VariableSelection-imgCaretDown" size={12} />
										</span>
									) : null}
									{item.category ? (
										<span {...stylex.props(ui.caption, ui.secondary, ui.truncate, styles.category)}>
											{item.category}
										</span>
									) : null}
								</button>
								<button
									type="button"
									{...stylex.props(ui.button, styles.select, isSelected && styles.selectedButton)}
									aria-label={`Select ${item.label}`}
									aria-pressed={isSelected}
									onClick={() => select(item.id)}
								>
									<FormsIcon
										name={
											item.kind === 'molecular'
												? 'VariableSelection-imgRightIcon1'
												: 'VariableSelection-imgRightIcon'
										}
										size={16}
									/>
								</button>
								<button
									type="button"
									{...stylex.props(styles.iconButton)}
									aria-label={`Remove ${item.label}`}
									onClick={() => remove(item.id)}
								>
									<FormsIcon name="VariableSelection-imgDragHandleDots3" />
								</button>
							</div>
							{item.children && !isCollapsed ? (
								<ul {...stylex.props(styles.children)}>
									{item.children.map((child) => (
										<li
											key={child.id}
											{...stylex.props(
												styles.child,
												selection === child.id && styles.childSelected
											)}
										>
											<span {...stylex.props(styles.check)}>
												<FormsIcon name="VariableSelection-imgCheck" />
											</span>
											<button
												type="button"
												{...stylex.props(ui.caption, styles.label)}
												aria-pressed={selection === child.id}
												onClick={() => select(child.id)}
											>
												<span {...stylex.props(ui.truncate, styles.labelText)}>{child.label}</span>
												{child.public ? (
													<span {...stylex.props(styles.publicIcon)}>
														<FormsIcon name="VariableSelection-imgGlobe" size={12} />
													</span>
												) : null}
											</button>
											<button
												type="button"
												{...stylex.props(styles.iconButton)}
												aria-label={`Remove ${child.label}`}
												onClick={() => remove(child.id)}
											>
												<FormsIcon name="VariableSelection-imgDragHandleDots3" />
											</button>
										</li>
									))}
								</ul>
							) : null}
						</li>
					);
				})}
			</ul>
		</section>
	);
}
