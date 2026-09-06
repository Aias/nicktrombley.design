import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { ui } from '../../styles/primitives';
import { colors, radius, space, typeScale } from '../../styles/tokens.stylex';
import { MockupIcon } from './MockupIcon';

type TaskState = 'complete' | 'skipped' | 'pending';

export interface UpgradeTask {
	id: string;
	label: string;
	description?: string;
	state?: TaskState;
}

export interface UpgradeStage {
	id: string;
	label: string;
	completed: number;
	inProgress: number;
	skipped: number;
	tasks?: UpgradeTask[];
}

export interface UpgradeOwner {
	id: string;
	name: string;
	status: string;
	summary: string;
	avatar?: string;
	initials: string;
	email?: string;
	messageUrl?: string;
}

export interface TaskListProps {
	title?: string;
	month?: string;
	roles?: string[];
	initialRole?: string;
	owners?: UpgradeOwner[];
	stages?: UpgradeStage[];
	onMonthChange?: (month: string) => void;
	onRoleChange?: (role: string) => void;
	onTaskChange?: (taskId: string, state: TaskState) => void;
	onContact?: (ownerId: string, method: 'email' | 'message') => void;
}

const defaultStages: UpgradeStage[] = [
	{
		id: 'preparation',
		label: 'Preparation',
		completed: 8,
		inProgress: 0,
		skipped: 1
	},
	{
		id: 'pre-checks',
		label: 'Pre-Checks',
		completed: 2,
		inProgress: 2,
		skipped: 0,
		tasks: [
			{
				id: 'space',
				label: 'Verify Space for New System Files',
				state: 'complete',
				description:
					'Confirm that the installation volume has enough free space for system files and a recovery copy.'
			},
			{
				id: 'activity',
				label: 'Confirm No User Activities in Progress',
				state: 'complete',
				description: 'Check active sessions and wait for running jobs to finish.'
			},
			{
				id: 'queries',
				label: 'Recompile all SQL Queries',
				description:
					'Compile saved queries against the target database to identify invalid references and incompatible runtime parameters.'
			},
			{
				id: 'integrity',
				label: 'Run SQL Integrity Check',
				description:
					'Validate database consistency and review the integrity report before continuing.'
			},
			{
				id: 'version',
				label: 'Check RedAlert Version',
				description: 'Confirm that the installed application version supports the target system.'
			}
		]
	},
	{ id: 'upgrade', label: 'Upgrade', completed: 0, inProgress: 9, skipped: 0 },
	{
		id: 'post-checks',
		label: 'Post-Checks',
		completed: 0,
		inProgress: 3,
		skipped: 0
	}
];

const defaultOwners: UpgradeOwner[] = [
	{
		id: 'jan',
		name: 'Jan Tschichold',
		status: 'Active',
		summary: 'Complete Pre-Checks on 3/20/2025',
		avatar: '/mockup-icons/timelines/TaskList-imgImage.png',
		initials: 'JT'
	},
	{
		id: 'virginia',
		name: 'Virginia Tufte',
		status: 'Waiting',
		summary: 'No Active Tasks',
		initials: 'VT'
	}
];

const styles = stylex.create({
	root: {
		display: 'flex',
		flexDirection: 'column',
		paddingBlock: space[12],
		overflow: 'hidden'
	},
	header: {
		display: 'flex',
		alignItems: 'center',
		gap: space[8],
		minHeight: space[20],
		paddingInline: space[12],
		flexShrink: 0
	},
	titleIcon: { width: space[16], height: space[16], flexShrink: 0 },
	monthInput: {
		width: '5.5rem',
		height: space[20],
		paddingInline: space[6],
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: colors.divider,
		borderRadius: radius.tiny,
		backgroundColor: colors.tint,
		color: colors.accent,
		fontSize: typeScale.tiny,
		lineHeight: typeScale.tinyLine
	},
	roleControl: {
		position: 'relative',
		marginBlock: space[8],
		marginInline: space[12],
		flexShrink: 0
	},
	roleCaret: {
		position: 'absolute',
		right: space[6],
		top: space[4],
		width: space[16],
		height: space[16],
		pointerEvents: 'none'
	},
	roleSelect: {
		width: '100%',
		minHeight: space[24],
		paddingRight: space[24],
		paddingInline: space[6],
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: colors.border,
		borderRadius: radius.tiny,
		backgroundColor: colors.container,
		color: colors.accent,
		fontSize: typeScale.tiny,
		lineHeight: typeScale.tinyLine,
		cursor: 'pointer'
	},
	content: {
		display: 'flex',
		flex: '1',
		minHeight: 0,
		flexDirection: 'column',
		overflow: 'auto'
	},
	owner: {
		display: 'flex',
		flexDirection: 'column',
		gap: space[4],
		paddingBlock: space[8],
		paddingInline: space[12],
		borderTopWidth: 1,
		borderTopStyle: 'solid',
		borderTopColor: colors.divider,
		flexShrink: 0
	},
	ownerFirst: { borderTopWidth: 0 },
	ownerHeader: {
		display: 'flex',
		alignItems: 'center',
		gap: space[8],
		minWidth: 0
	},
	avatar: {
		display: 'grid',
		placeItems: 'center',
		width: '2.5rem',
		height: '2.5rem',
		flexShrink: 0,
		overflow: 'hidden',
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: colors.divider,
		borderRadius: radius.full,
		backgroundColor: colors.tint,
		color: colors.hint,
		fontSize: typeScale.heading,
		lineHeight: typeScale.headingLine,
		fontWeight: 500
	},
	avatarImage: {
		width: '100%',
		height: '100%',
		objectFit: 'cover',
		filter: 'grayscale(1)'
	},
	ownerCopy: {
		display: 'flex',
		flex: '1',
		minWidth: 0,
		flexDirection: 'column',
		gap: space[2]
	},
	ownerName: {
		display: 'flex',
		alignItems: 'baseline',
		gap: space[6],
		minWidth: 0
	},
	ownerTitle: {
		fontSize: typeScale.body,
		lineHeight: typeScale.bodyLine,
		fontWeight: 400
	},
	ownerStatus: {
		flexShrink: 0,
		color: colors.secondary,
		fontSize: typeScale.caption,
		lineHeight: typeScale.captionLine
	},
	ownerSummary: {
		color: colors.accent,
		fontSize: typeScale.caption,
		lineHeight: typeScale.captionLine,
		fontWeight: 475
	},
	contact: { display: 'flex', gap: space[8], flexShrink: 0 },
	contactButton: {
		display: 'grid',
		placeItems: 'center',
		width: space[12],
		height: space[16],
		padding: 0,
		borderWidth: 0,
		backgroundColor: { 'default': 'transparent', ':hover': colors.tint },
		cursor: 'pointer'
	},
	contactIcon: { width: space[12], height: space[12] },
	contactDetail: {
		display: 'flex',
		alignItems: 'center',
		gap: space[6],
		minWidth: 0,
		paddingBlock: space[4],
		paddingInline: space[8],
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: colors.divider,
		borderRadius: radius.small,
		backgroundColor: colors.tint,
		color: colors.secondary,
		fontSize: typeScale.tiny,
		lineHeight: typeScale.tinyLine
	},
	contactLink: {
		flexShrink: 0,
		color: colors.accent,
		fontWeight: 550,
		textDecoration: 'underline'
	},
	stages: {
		display: 'flex',
		flexDirection: 'column',
		gap: space[2],
		paddingInline: space[12]
	},
	stage: { display: 'flex', flexDirection: 'column' },
	stageHeader: {
		display: 'flex',
		alignItems: 'center',
		gap: space[6],
		width: '100%',
		minWidth: 0,
		minHeight: space[32],
		padding: 0,
		borderWidth: 0,
		backgroundColor: { 'default': 'transparent', ':hover': colors.tint },
		color: colors.accent,
		cursor: 'pointer'
	},
	stepNumber: {
		display: 'grid',
		placeItems: 'center',
		width: space[20],
		height: space[20],
		flexShrink: 0,
		borderRadius: radius.full,
		backgroundColor: colors.tone,
		fontSize: typeScale.caption,
		lineHeight: typeScale.captionLine
	},
	stageLabel: {
		flexShrink: 0,
		fontSize: typeScale.caption,
		lineHeight: typeScale.captionLine,
		fontWeight: 475
	},
	caret: { width: '0.875rem', height: '0.875rem', flexShrink: 0 },
	rule: {
		flex: '1',
		minWidth: space[8],
		height: 1,
		backgroundColor: colors.divider
	},
	stats: {
		display: 'flex',
		alignItems: 'center',
		gap: space[6],
		flexShrink: 0,
		color: colors.secondary,
		fontSize: typeScale.tiny,
		lineHeight: typeScale.tinyLine
	},
	stat: { display: 'flex', alignItems: 'center', gap: space[2] },
	statIcon: { width: space[12], height: space[12] },
	tasks: {
		display: 'flex',
		flexDirection: 'column',
		gap: space[4],
		paddingBottom: space[4],
		paddingLeft: space[4]
	},
	task: {
		display: 'flex',
		flexDirection: 'column',
		gap: space[2],
		paddingBlock: space[4],
		paddingInline: space[8],
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: colors.dividerSubtle,
		borderRadius: radius.small,
		backgroundColor: colors.tint
	},
	taskRow: {
		display: 'flex',
		alignItems: 'center',
		gap: space[6],
		minWidth: 0
	},
	taskBullet: {
		display: 'grid',
		placeItems: 'center',
		width: '0.875rem',
		height: '0.875rem',
		flexShrink: 0,
		padding: 0,
		borderWidth: 0,
		backgroundColor: 'transparent',
		cursor: 'pointer'
	},
	taskToggleIcon: { width: '0.875rem', height: '0.875rem' },
	taskLabel: {
		flex: '1',
		minWidth: 0,
		color: colors.primary,
		fontSize: typeScale.caption,
		lineHeight: typeScale.captionLine
	},
	taskAction: {
		display: 'grid',
		placeItems: 'center',
		width: space[24],
		height: space[20],
		padding: 0,
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: colors.border,
		borderRadius: radius.small,
		backgroundColor: { 'default': colors.container, ':hover': colors.tone },
		cursor: 'pointer'
	},
	taskActionActive: { backgroundColor: colors.paint },
	taskActionIcon: { width: space[12], height: space[12] },
	description: {
		display: '-webkit-box',
		overflow: 'hidden',
		color: colors.secondary,
		fontSize: typeScale.tiny,
		lineHeight: typeScale.tinyLine,
		WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 3
	},
	emptyStages: { paddingBlock: space[16], textAlign: 'center' }
});

function Stat({ icon, value }: { icon: string; value: number }) {
	return (
		<span {...stylex.props(styles.stat)}>
			<MockupIcon iconStyle={styles.statIcon} src={icon} />
			{value}
		</span>
	);
}

export function TaskList({
	title = 'Upgrade Path',
	month = '2025-03',
	roles = ['Operational Database Administrator'],
	initialRole = roles[0] ?? '',
	owners = defaultOwners,
	stages = defaultStages,
	onMonthChange,
	onRoleChange,
	onTaskChange,
	onContact
}: TaskListProps) {
	const [selectedMonth, setSelectedMonth] = useState(month);
	const [role, setRole] = useState(initialRole);
	const [expanded, setExpanded] = useState<string[]>(['pre-checks']);
	const [taskStates, setTaskStates] = useState<Record<string, TaskState>>({});
	const [expandedTasks, setExpandedTasks] = useState<string[]>(['queries']);
	const [contact, setContact] = useState<{ ownerId: string; method: 'email' | 'message' }>();
	const taskState = (task: UpgradeTask) => taskStates[task.id] ?? task.state ?? 'pending';
	const setTaskState = (task: UpgradeTask, state: TaskState) => {
		const nextState = taskState(task) === state ? 'pending' : state;
		setTaskStates((current) => ({ ...current, [task.id]: nextState }));
		onTaskChange?.(task.id, nextState);
	};
	return (
		<section {...stylex.props(ui.mockup, ui.panel, styles.root)}>
			<header {...stylex.props(styles.header)}>
				<MockupIcon
					iconStyle={styles.titleIcon}
					src="/mockup-icons/timelines/TaskList-imgSlider.svg"
				/>
				<h2 {...stylex.props(ui.title, ui.truncate)}>{title}</h2>
				<input
					{...stylex.props(styles.monthInput)}
					aria-label="Upgrade month"
					type="month"
					value={selectedMonth}
					onChange={(event) => {
						setSelectedMonth(event.target.value);
						onMonthChange?.(event.target.value);
					}}
				/>
			</header>
			<div {...stylex.props(styles.roleControl)}>
				<select
					{...stylex.props(styles.roleSelect)}
					aria-label="Role"
					value={role}
					onChange={(event) => {
						setRole(event.target.value);
						onRoleChange?.(event.target.value);
					}}
				>
					{roles.map((option) => (
						<option key={option} value={option}>
							Role: {option}
						</option>
					))}
				</select>
				<MockupIcon
					src="/mockup-icons/timelines/TaskList-imgCaretSort.svg"
					iconStyle={styles.roleCaret}
				/>
			</div>
			<div {...stylex.props(styles.content)}>
				{owners.map((owner, ownerIndex) => (
					<div
						{...stylex.props(styles.owner, ownerIndex === 0 && styles.ownerFirst)}
						key={owner.id}
					>
						<div {...stylex.props(styles.ownerHeader)}>
							<div {...stylex.props(styles.avatar)}>
								{owner.avatar === undefined ? (
									owner.initials
								) : (
									<img {...stylex.props(styles.avatarImage)} src={owner.avatar} alt="" />
								)}
							</div>
							<div {...stylex.props(styles.ownerCopy)}>
								<div {...stylex.props(styles.ownerName)}>
									<p {...stylex.props(styles.ownerTitle, ui.truncate)}>{owner.name}</p>
									<span {...stylex.props(styles.ownerStatus)}>{owner.status}</span>
								</div>
								<p {...stylex.props(styles.ownerSummary, ui.truncate)}>{owner.summary}</p>
							</div>
							<div {...stylex.props(styles.contact)}>
								<button
									{...stylex.props(styles.contactButton)}
									aria-label={`Email ${owner.name}`}
									onClick={() => {
										setContact({ ownerId: owner.id, method: 'email' });
										onContact?.(owner.id, 'email');
									}}
								>
									<MockupIcon
										iconStyle={styles.contactIcon}
										src="/mockup-icons/timelines/TaskList-imgEnvelopeClosed.svg"
									/>
								</button>
								<button
									{...stylex.props(styles.contactButton)}
									aria-label={`Message ${owner.name}`}
									onClick={() => {
										setContact({ ownerId: owner.id, method: 'message' });
										onContact?.(owner.id, 'message');
									}}
								>
									<MockupIcon
										iconStyle={styles.contactIcon}
										src="/mockup-icons/timelines/TaskList-imgChatBubble.svg"
									/>
								</button>
							</div>
						</div>
						{contact?.ownerId === owner.id ? (
							<output {...stylex.props(styles.contactDetail)}>
								<span {...stylex.props(ui.truncate)}>
									{contact.method === 'email'
										? (owner.email ?? `No email address provided for ${owner.name}.`)
										: (owner.messageUrl ?? `No message destination provided for ${owner.name}.`)}
								</span>
								{contact.method === 'email' && owner.email !== undefined ? (
									<a {...stylex.props(styles.contactLink)} href={`mailto:${owner.email}`}>
										Open email
									</a>
								) : contact.method === 'message' && owner.messageUrl !== undefined ? (
									<a {...stylex.props(styles.contactLink)} href={owner.messageUrl}>
										Open message
									</a>
								) : null}
							</output>
						) : null}
						{ownerIndex === 0 ? (
							<div {...stylex.props(styles.stages)}>
								{stages.map((stage, index) => {
									const isExpanded = expanded.includes(stage.id);
									const counts = stage.tasks
										? {
												completed: stage.tasks.filter((task) => taskState(task) === 'complete')
													.length,
												inProgress: stage.tasks.filter((task) => taskState(task) === 'pending')
													.length,
												skipped: stage.tasks.filter((task) => taskState(task) === 'skipped').length
											}
										: stage;
									return (
										<div {...stylex.props(styles.stage)} key={stage.id}>
											<button
												{...stylex.props(styles.stageHeader)}
												aria-expanded={stage.tasks === undefined ? undefined : isExpanded}
												onClick={() =>
													setExpanded(
														isExpanded
															? expanded.filter((id) => id !== stage.id)
															: [...expanded, stage.id]
													)
												}
											>
												<span {...stylex.props(styles.stepNumber)}>{index + 1}</span>
												<span {...stylex.props(styles.stageLabel)}>{stage.label}</span>
												<MockupIcon
													iconStyle={styles.caret}
													src={`/mockup-icons/timelines/TaskList-imgChevron${isExpanded ? 'Up' : 'Down'}.svg`}
												/>
												<span {...stylex.props(styles.rule)} />
												<span {...stylex.props(styles.stats)}>
													<Stat
														icon="/mockup-icons/timelines/TaskList-imgCheckCircled.svg"
														value={counts.completed}
													/>
													<Stat
														icon="/mockup-icons/timelines/TaskList-imgLapTimer.svg"
														value={counts.inProgress}
													/>
													<Stat
														icon="/mockup-icons/timelines/TaskList-imgCircleBackslash.svg"
														value={counts.skipped}
													/>
												</span>
											</button>
											{isExpanded && stage.tasks !== undefined ? (
												<div {...stylex.props(styles.tasks)}>
													{stage.tasks.map((task) => (
														<div {...stylex.props(styles.task)} key={task.id}>
															<div {...stylex.props(styles.taskRow)}>
																<button
																	type="button"
																	{...stylex.props(styles.taskBullet)}
																	aria-label={`${expandedTasks.includes(task.id) ? 'Collapse' : 'Expand'} ${task.label}`}
																	aria-expanded={expandedTasks.includes(task.id)}
																	disabled={!task.description}
																	onClick={() =>
																		setExpandedTasks((current) =>
																			current.includes(task.id)
																				? current.filter((id) => id !== task.id)
																				: [...current, task.id]
																		)
																	}
																>
																	<MockupIcon
																		iconStyle={styles.taskToggleIcon}
																		src={`/mockup-icons/timelines/TaskList-img${expandedTasks.includes(task.id) ? 'Minus' : 'Plus'}Circled.svg`}
																	/>
																</button>
																<p {...stylex.props(styles.taskLabel, ui.truncate)}>{task.label}</p>
																<button
																	{...stylex.props(
																		styles.taskAction,
																		taskState(task) === 'complete' && styles.taskActionActive
																	)}
																	aria-label={`Mark ${task.label} complete`}
																	aria-pressed={taskState(task) === 'complete'}
																	onClick={() => setTaskState(task, 'complete')}
																>
																	<MockupIcon
																		iconStyle={styles.taskActionIcon}
																		src="/mockup-icons/timelines/TaskList-imgCheckCircled.svg"
																	/>
																</button>
																<button
																	{...stylex.props(
																		styles.taskAction,
																		taskState(task) === 'skipped' && styles.taskActionActive
																	)}
																	aria-label={`Skip ${task.label}`}
																	aria-pressed={taskState(task) === 'skipped'}
																	onClick={() => setTaskState(task, 'skipped')}
																>
																	<MockupIcon
																		iconStyle={styles.taskActionIcon}
																		src="/mockup-icons/timelines/TaskList-imgCircleBackslash.svg"
																	/>
																</button>
															</div>
															{task.description && expandedTasks.includes(task.id) ? (
																<p {...stylex.props(styles.description)}>{task.description}</p>
															) : null}
														</div>
													))}
												</div>
											) : null}
										</div>
									);
								})}
								{stages.length === 0 ? (
									<p {...stylex.props(ui.caption, ui.hint, styles.emptyStages)}>
										No stages assigned.
									</p>
								) : null}
							</div>
						) : null}
					</div>
				))}
			</div>
		</section>
	);
}
