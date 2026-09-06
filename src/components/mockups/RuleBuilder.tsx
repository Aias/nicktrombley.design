import { Fragment, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { ui } from '../../styles/primitives';
import { colors, radius, space } from '../../styles/tokens.stylex';
import { FormsIcon } from './FormsIcon';
import { MockupIcon } from './MockupIcon';

export type RuleCondition = {
	kind: 'rule';
	id: string;
	field: string;
	comparator: string;
	value: string;
	detail?: string;
	count: number;
};

export type RuleGroupData = {
	kind: 'group';
	id: string;
	name: string;
	operator: 'AND' | 'OR';
	count: number;
	items: RuleBuilderItem[];
	date?: string;
};

export type RuleBuilderItem = RuleCondition | RuleGroupData;

type RuleBuilderProps = {
	value?: RuleGroupData;
	defaultValue?: RuleGroupData;
	onChange?: (group: RuleGroupData) => void;
};

const defaultRuleGroup: RuleGroupData = {
	kind: 'group',
	id: 'root',
	name: 'Untitled Subpopulation',
	operator: 'AND',
	count: 9,
	items: [
		{
			kind: 'rule',
			id: 'state',
			field: 'Resident State',
			comparator: 'IS ANY OF',
			value: 'Massachusetts, New York, New Hampshire, Rhode Island, Vermont, Connecticut, Maine',
			count: 146
		},
		{
			kind: 'group',
			id: 'conditions',
			name: 'Patients With Active Conditions',
			operator: 'OR',
			count: 1038695,
			items: [
				{
					kind: 'rule',
					id: 'stage',
					field: 'Disease Stage',
					comparator: 'IS ANY OF',
					value: 'III, IV',
					count: 146
				},
				{
					kind: 'rule',
					id: 'diagnosis',
					field: 'Submitted Diagnosis',
					comparator: 'IS ANY OF',
					value: 'Brain Glioblastoma (GBM)',
					detail:
						'Brain Glioblastoma Multiforme, Brain Glioblastoma (NOS), Frontal Lobe Glioblastoma, Temporal Lobe Multiforme, Temporal Lobe Glioblastoma',
					count: 146
				},
				{
					kind: 'rule',
					id: 'status',
					field: 'Disease Status',
					comparator: 'IS',
					value: 'Active',
					count: 146
				},
				{
					kind: 'rule',
					id: 'risk',
					field: 'Disease Risk',
					comparator: 'IS',
					value: 'All With Values',
					count: 146
				}
			]
		},
		{
			kind: 'group',
			id: 'treatment',
			name: 'Treatment Status',
			operator: 'AND',
			count: 426,
			items: [
				{
					kind: 'rule',
					id: 'therapy',
					field: 'Therapy Status',
					comparator: 'IS',
					value: 'Active',
					count: 426
				},
				{
					kind: 'rule',
					id: 'response',
					field: 'Response',
					comparator: 'IS ANY OF',
					value: 'Stable, Improving',
					count: 318
				}
			]
		},
		{
			kind: 'group',
			id: 'demographics',
			name: 'Demographics',
			operator: 'AND',
			count: 731,
			items: [
				{
					kind: 'rule',
					id: 'age',
					field: 'Current Age',
					comparator: 'IS BETWEEN',
					value: '35 and 72',
					count: 731
				},
				{
					kind: 'rule',
					id: 'consent',
					field: 'Research Consent',
					comparator: 'IS',
					value: 'Granted',
					count: 608
				}
			]
		}
	]
};

const styles = stylex.create({
	group: {
		display: 'flex',
		width: '100%',
		flexDirection: 'column',
		overflow: 'hidden',
		borderWidth: 1,
		borderLeftWidth: space[4],
		borderStyle: 'solid',
		borderColor: colors.divider,
		borderRadius: radius.medium,
		backgroundColor: colors.container
	},
	rootGroup: { borderTopWidth: 0 },
	toolbar: {
		display: 'flex',
		minWidth: 0,
		flexShrink: 0,
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: space[8],
		paddingBlock: space[6],
		paddingInline: space[12],
		backgroundColor: colors.tone
	},
	toolbarLeft: { display: 'flex', minWidth: 0, alignItems: 'center', gap: space[8] },
	operator: {
		display: 'flex',
		width: '7rem',
		height: space[24],
		alignItems: 'center',
		gap: space[8],
		paddingInline: space[4],
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: colors.border,
		borderRadius: radius.small,
		backgroundColor: { 'default': colors.component, ':hover': colors.tone },
		color: colors.primary,
		cursor: 'pointer'
	},
	booleanSymbol: {
		display: 'flex',
		width: space[24],
		height: space[16],
		flexShrink: 0,
		alignItems: 'center',
		justifyContent: 'center'
	},
	booleanIcon: { width: '1.1rem', height: '0.7rem' },
	operatorLabel: { minWidth: 0, flex: '1', fontWeight: 575 },
	calendar: {
		height: space[24],
		paddingInline: space[6],
		backgroundColor: { 'default': colors.component, ':hover': colors.tone }
	},
	toolbarMenu: { display: 'flex', flexShrink: 0, alignItems: 'center', gap: space[12] },
	count: { display: 'flex', alignItems: 'center', gap: space[4] },
	iconButton: {
		display: 'flex',
		flexShrink: 0,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 0,
		backgroundColor: 'transparent',
		cursor: 'pointer'
	},
	actions: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		gap: space[4],
		paddingBlock: space[4],
		paddingInline: space[12],
		borderBottomWidth: 1,
		borderBottomStyle: 'solid',
		borderBottomColor: colors.dividerSubtle,
		backgroundColor: colors.tint
	},
	dateRow: {
		display: 'flex',
		alignItems: 'center',
		gap: space[8],
		paddingBlock: space[4],
		paddingInline: space[12],
		backgroundColor: colors.tint
	},
	dateInput: { width: '8rem' },
	body: {
		display: 'flex',
		flexDirection: 'column',
		gap: space[8],
		paddingBlock: space[6],
		paddingInline: space[12]
	},
	rootBody: { minHeight: 0, overflowY: 'auto' },
	nameRow: { display: 'flex', minWidth: 0, alignItems: 'center', gap: space[6] },
	name: { minWidth: 0, color: colors.ghost },
	collapse: { marginInlineStart: 'auto' },
	nestedName: { color: colors.primary, fontWeight: 575 },
	nameInput: { flex: '1' },
	summary: {
		width: '100%',
		paddingBlock: space[4],
		paddingInline: space[6],
		borderRadius: radius.small,
		backgroundColor: colors.tint,
		color: colors.secondary,
		textAlign: 'center'
	},
	items: { display: 'flex', flexDirection: 'column', gap: space[8] },
	rule: { display: 'flex', minWidth: 0, alignItems: 'flex-start', gap: space[12] },
	ruleCopy: { display: 'flex', minWidth: 0, flex: '1', flexDirection: 'column' },
	ruleEditor: {
		display: 'grid',
		minWidth: 0,
		flex: '1',
		gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 0.75fr) minmax(0, 1.5fr) auto',
		gap: space[4]
	},
	ruleEditorActions: { display: 'flex', alignItems: 'center', gap: space[4] },
	ruleLine: { display: 'flex', minWidth: 0, alignItems: 'center', gap: space[4] },
	field: { flexShrink: 0, color: colors.accent, fontWeight: 575 },
	comparator: {
		flexShrink: 0,
		paddingBlock: space[2],
		paddingInline: space[4],
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: colors.dividerSubtle,
		borderRadius: radius.tiny,
		backgroundColor: colors.tint,
		color: colors.secondary,
		fontWeight: 550
	},
	value: { minWidth: 0, flex: '1' },
	detail: {
		display: '-webkit-box',
		overflow: 'hidden',
		WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 3
	},
	ruleMenu: {
		display: 'flex',
		flexShrink: 0,
		alignItems: 'center',
		gap: space[12],
		paddingTop: space[2]
	},
	move: { cursor: 'pointer' },
	badge: {
		display: 'flex',
		width: '2.5rem',
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'flex-start',
		paddingBlock: space[2],
		paddingInline: '0.625rem',
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: colors.divider,
		borderRadius: radius.small,
		backgroundColor: colors.tint,
		fontWeight: 575
	},
	andBadge: { borderColor: 'transparent', backgroundColor: colors.paint }
});

function countRules(group: RuleGroupData): number {
	return group.items.reduce(
		(total, item) => total + (item.kind === 'rule' ? 1 : countRules(item)),
		0
	);
}

function countGroups(group: RuleGroupData): number {
	return group.items.reduce(
		(total, item) => total + (item.kind === 'group' ? 1 + countGroups(item) : 0),
		0
	);
}

function RuleGroup({
	group,
	root,
	movable,
	onChange,
	onRemove,
	onMove
}: {
	group: RuleGroupData;
	root: boolean;
	movable: boolean;
	onChange: (group: RuleGroupData) => void;
	onRemove?: () => void;
	onMove?: () => void;
}) {
	const [collapsed, setCollapsed] = useState(false);
	const [editingName, setEditingName] = useState(false);
	const [editingRuleId, setEditingRuleId] = useState<string>();
	const [showActions, setShowActions] = useState(false);
	const [showDate, setShowDate] = useState(false);

	function updateItem(id: string, nextItem: RuleBuilderItem) {
		onChange({ ...group, items: group.items.map((item) => (item.id === id ? nextItem : item)) });
	}

	function removeItem(id: string) {
		onChange({ ...group, items: group.items.filter((item) => item.id !== id) });
		if (editingRuleId === id) setEditingRuleId(undefined);
	}

	function moveItem(id: string) {
		const index = group.items.findIndex((item) => item.id === id);
		const currentItem = group.items.find((item) => item.id === id);
		if (index < 0 || !currentItem || group.items.length < 2) return;
		const nextIndex = index === group.items.length - 1 ? 0 : index + 1;
		const items = group.items.flatMap((item) => (item.id === id ? [] : [item]));
		items.splice(nextIndex, 0, currentItem);
		onChange({ ...group, items });
	}

	function addRule() {
		const rule: RuleCondition = {
			kind: 'rule',
			id: crypto.randomUUID(),
			field: 'New Variable',
			comparator: 'IS',
			value: 'All With Values',
			count: group.count
		};
		onChange({ ...group, items: [...group.items, rule] });
		setCollapsed(false);
		setEditingRuleId(rule.id);
		setShowActions(false);
	}

	return (
		<section
			{...stylex.props(root && ui.mockup, root && ui.panel, styles.group, root && styles.rootGroup)}
		>
			<header {...stylex.props(styles.toolbar)}>
				<div {...stylex.props(styles.toolbarLeft)}>
					<button
						type="button"
						{...stylex.props(ui.caption, styles.operator)}
						aria-label={`Change ${group.name} boolean operator`}
						onClick={() =>
							onChange({ ...group, operator: group.operator === 'AND' ? 'OR' : 'AND' })
						}
					>
						<span {...stylex.props(styles.booleanSymbol)}>
							<MockupIcon
								src={`/mockup-icons/forms/RuleBuilder-imgBoolean${group.operator === 'AND' ? 'Intersection' : 'Union'}.svg`}
								iconStyle={styles.booleanIcon}
							/>
						</span>
						<span {...stylex.props(ui.truncate, styles.operatorLabel)}>
							{group.operator === 'AND' ? 'ALL OF' : 'ANY OF'}
						</span>
						<FormsIcon name="RuleBuilder-imgTriangleDown" size={12} />
					</button>
					<button
						type="button"
						{...stylex.props(ui.button, styles.calendar)}
						aria-label={`${showDate ? 'Hide' : 'Set'} date constraint`}
						aria-expanded={showDate}
						onClick={() => setShowDate((current) => !current)}
					>
						<FormsIcon name="RuleBuilder-imgCalendar" size={12} />
					</button>
				</div>
				<div {...stylex.props(styles.toolbarMenu)}>
					<span {...stylex.props(ui.tiny, styles.count)}>
						<FormsIcon name="RuleBuilder-imgPerson" size={12} />
						{group.count.toLocaleString()}
					</span>
					<button
						type="button"
						{...stylex.props(styles.iconButton)}
						aria-label={`${showActions ? 'Close' : 'Open'} ${group.name} actions`}
						aria-expanded={showActions}
						onClick={() => setShowActions((current) => !current)}
					>
						<FormsIcon name="RuleBuilder-imgButton" size={12} />
					</button>
					{onMove && movable ? (
						<button
							type="button"
							{...stylex.props(styles.iconButton, styles.move)}
							aria-label={`Move ${group.name}`}
							onClick={onMove}
						>
							<FormsIcon name="RuleBuilder-imgDragHandleDots2" size={12} />
						</button>
					) : null}
				</div>
			</header>
			{showDate ? (
				<div {...stylex.props(styles.dateRow)}>
					<label {...stylex.props(ui.tiny, ui.secondary)} htmlFor={`date-${group.id}`}>
						As of
					</label>
					<input
						id={`date-${group.id}`}
						type="date"
						{...stylex.props(ui.input, styles.dateInput)}
						value={group.date ?? ''}
						onChange={(event) => onChange({ ...group, date: event.target.value })}
					/>
				</div>
			) : null}
			{showActions ? (
				<div {...stylex.props(styles.actions)}>
					<button type="button" {...stylex.props(ui.button, ui.tiny)} onClick={addRule}>
						Add rule
					</button>
					{onRemove ? (
						<button type="button" {...stylex.props(ui.button, ui.tiny)} onClick={onRemove}>
							Remove group
						</button>
					) : null}
				</div>
			) : null}
			<div {...stylex.props(styles.body, root && styles.rootBody, root && ui.scrollFade)}>
				<div {...stylex.props(styles.nameRow)}>
					{editingName ? (
						<input
							{...stylex.props(ui.input, styles.nameInput)}
							aria-label="Group name"
							value={group.name}
							onChange={(event) => onChange({ ...group, name: event.target.value })}
							onBlur={() => setEditingName(false)}
						/>
					) : (
						<p {...stylex.props(ui.tiny, ui.truncate, styles.name, !root && styles.nestedName)}>
							{group.name}
						</p>
					)}
					<button
						type="button"
						{...stylex.props(styles.iconButton)}
						aria-label={`Edit ${group.name}`}
						onClick={() => setEditingName(true)}
					>
						<FormsIcon name="RuleBuilder-imgPencil1" size={12} />
					</button>
					<button
						type="button"
						{...stylex.props(styles.iconButton, styles.collapse)}
						aria-label={`${collapsed ? 'Expand' : 'Collapse'} ${group.name}`}
						aria-expanded={!collapsed}
						onClick={() => setCollapsed((current) => !current)}
					>
						<FormsIcon
							name={collapsed ? 'RuleBuilder-imgCaretDown' : 'RuleBuilder-imgCaretUp'}
							size={16}
						/>
					</button>
				</div>
				{collapsed ? (
					<p {...stylex.props(ui.caption, styles.summary)}>
						{countGroups(group)} Subgroups, {countRules(group)} Rules
					</p>
				) : (
					<div {...stylex.props(styles.items)}>
						{group.items.map((item, index) => (
							<Fragment key={item.id}>
								{item.kind === 'rule' ? (
									<div {...stylex.props(styles.rule)}>
										{editingRuleId === item.id ? (
											<div {...stylex.props(styles.ruleEditor)}>
												<input
													{...stylex.props(ui.input)}
													aria-label="Rule field"
													placeholder="Field"
													value={item.field}
													onChange={(event) =>
														updateItem(item.id, { ...item, field: event.target.value })
													}
												/>
												<input
													{...stylex.props(ui.input)}
													aria-label="Rule comparator"
													placeholder="Comparator"
													value={item.comparator}
													onChange={(event) =>
														updateItem(item.id, { ...item, comparator: event.target.value })
													}
												/>
												<input
													{...stylex.props(ui.input)}
													aria-label="Rule value"
													placeholder="Value"
													value={item.value}
													onChange={(event) =>
														updateItem(item.id, { ...item, value: event.target.value })
													}
												/>
												<div {...stylex.props(styles.ruleEditorActions)}>
													<button
														type="button"
														{...stylex.props(ui.button, ui.tiny)}
														onClick={() => setEditingRuleId(undefined)}
													>
														Done
													</button>
													<button
														type="button"
														{...stylex.props(ui.button, ui.tiny)}
														onClick={() => removeItem(item.id)}
													>
														Remove
													</button>
												</div>
											</div>
										) : (
											<div {...stylex.props(styles.ruleCopy)}>
												<div {...stylex.props(ui.caption, styles.ruleLine)}>
													<span {...stylex.props(ui.truncate, styles.field)}>{item.field}</span>
													<span {...stylex.props(ui.tiny, styles.comparator)}>
														{item.comparator}
													</span>
													<span {...stylex.props(ui.truncate, styles.value)}>{item.value}</span>
												</div>
												{item.detail ? (
													<p {...stylex.props(ui.caption, styles.detail)}>{item.detail}</p>
												) : null}
											</div>
										)}
										<div {...stylex.props(styles.ruleMenu)}>
											<span {...stylex.props(ui.tiny, ui.secondary)}>
												{item.count.toLocaleString()}
											</span>
											<button
												type="button"
												{...stylex.props(styles.iconButton)}
												aria-label={`${editingRuleId === item.id ? 'Close' : 'Edit'} ${item.field}`}
												aria-expanded={editingRuleId === item.id}
												onClick={() =>
													setEditingRuleId((current) => (current === item.id ? undefined : item.id))
												}
											>
												<FormsIcon name="RuleBuilder-imgButton" size={12} />
											</button>
											{group.items.length > 1 ? (
												<button
													type="button"
													{...stylex.props(styles.iconButton)}
													aria-label={`Move ${item.field}`}
													onClick={() => moveItem(item.id)}
												>
													<FormsIcon name="RuleBuilder-imgDragHandleDots2" size={12} />
												</button>
											) : null}
										</div>
									</div>
								) : (
									<RuleGroup
										group={item}
										root={false}
										movable={group.items.length > 1}
										onChange={(nextGroup) => updateItem(item.id, nextGroup)}
										onRemove={() => removeItem(item.id)}
										onMove={() => moveItem(item.id)}
									/>
								)}
								{index < group.items.length - 1 ? (
									<span
										{...stylex.props(
											ui.caption,
											styles.badge,
											group.operator === 'AND' && styles.andBadge
										)}
									>
										{group.operator}
									</span>
								) : null}
							</Fragment>
						))}
					</div>
				)}
			</div>
		</section>
	);
}

export function RuleBuilder({
	value,
	defaultValue = defaultRuleGroup,
	onChange
}: RuleBuilderProps) {
	const [localGroup, setLocalGroup] = useState(defaultValue);
	const group = value ?? localGroup;

	function update(nextGroup: RuleGroupData) {
		setLocalGroup(nextGroup);
		onChange?.(nextGroup);
	}

	return <RuleGroup group={group} root movable={false} onChange={update} />;
}
