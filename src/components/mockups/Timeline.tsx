import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { ui } from '../../styles/primitives';
import { colors, radius, space, typeScale } from '../../styles/tokens.stylex';
import { MockupIcon } from './MockupIcon';

export interface CaseEvent {
	id: string;
	title: string;
	detail?: string;
	date: string;
	time: string;
	author: string;
	note?: string;
	kind: 'action' | 'note';
}

export interface TimelineProps {
	events?: CaseEvent[];
	title?: string;
	onFilterChange?: (filter: { date: string; systemOnly: boolean }) => void;
}

const caseEvents: CaseEvent[] = [
	{
		id: 'isolate',
		title: 'Auto Action',
		detail: 'Isolate Hosts',
		date: '2024-04-16',
		time: '11:43 AM',
		author: 'System',
		kind: 'action'
	},
	{
		id: 'note',
		title: 'Note Added',
		date: '2024-04-16',
		time: '11:42 AM',
		author: 'Nick Trombley',
		note: 'Temporarily disabling these hosts.',
		kind: 'note'
	},
	{
		id: 'search',
		title: 'Search Results Added',
		date: '2024-04-16',
		time: '11:42 AM',
		author: 'System',
		kind: 'action'
	},
	{
		id: 'filters',
		title: 'Filters Applied',
		date: '2024-04-16',
		time: '11:42 AM',
		author: 'Nick Trombley',
		kind: 'note'
	},
	{
		id: 'chart',
		title: 'Chart Added',
		detail: 'Network Activity Graph',
		date: '2024-04-16',
		time: '9:15 AM',
		author: 'Nick Trombley',
		kind: 'note'
	}
];

const styles = stylex.create({
	root: { display: 'flex', flexDirection: 'column', padding: space[16] },
	header: {
		display: 'flex',
		alignItems: 'flex-start',
		gap: space[8],
		flexShrink: 0
	},
	heading: {
		display: 'flex',
		flex: '1',
		minWidth: 0,
		flexDirection: 'column',
		gap: space[2]
	},
	iconButton: {
		display: 'grid',
		placeItems: 'center',
		width: space[20],
		height: space[20],
		padding: 0,
		borderWidth: 0,
		backgroundColor: { 'default': 'transparent', ':hover': colors.tint },
		borderRadius: radius.small,
		cursor: 'pointer'
	},
	icon: { width: space[16], height: space[16] },
	filter: {
		display: 'flex',
		alignItems: 'center',
		gap: space[8],
		height: space[32],
		marginTop: space[8],
		paddingInline: space[8],
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: colors.border,
		backgroundColor: colors.container,
		flexShrink: 0
	},
	filterIcon: { width: space[16], height: space[16], flexShrink: 0 },
	filterInput: {
		'flex': '1',
		'minWidth': 0,
		'borderWidth': 0,
		'outlineWidth': 0,
		'backgroundColor': 'transparent',
		'color': colors.secondary,
		'fontSize': typeScale.caption,
		'lineHeight': typeScale.captionLine,
		'::placeholder': { color: colors.ghost }
	},
	events: {
		display: 'flex',
		flex: '1',
		minHeight: 0,
		flexDirection: 'column',
		overflowY: 'auto',
		marginTop: space[8]
	},
	event: {
		display: 'flex',
		flexDirection: 'column',
		gap: space[4],
		paddingBottom: '0.625rem',
		flexShrink: 0
	},
	eventAfterFirst: {
		paddingTop: space[6],
		borderTopWidth: 1,
		borderTopStyle: 'solid',
		borderTopColor: colors.divider
	},
	eventLast: { paddingBottom: 0 },
	eventHeading: {
		display: 'flex',
		alignItems: 'center',
		gap: space[8],
		minWidth: 0
	},
	eventTitle: {
		display: 'flex',
		alignItems: 'baseline',
		flex: '1',
		minWidth: 0,
		gap: space[4],
		fontSize: typeScale.caption,
		lineHeight: typeScale.captionLine
	},
	eventLabel: { flexShrink: 0, fontWeight: 475 },
	eventDetail: { minWidth: 0, color: colors.accent },
	eventIcon: { width: space[12], height: space[12], flexShrink: 0 },
	meta: {
		fontSize: typeScale.tiny,
		lineHeight: typeScale.tinyLine,
		color: colors.secondary
	},
	note: {
		marginTop: space[2],
		paddingBlock: space[4],
		paddingInline: space[8],
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: colors.divider,
		borderRadius: radius.small,
		backgroundColor: colors.tint,
		color: colors.secondary,
		fontSize: typeScale.tiny,
		lineHeight: typeScale.tinyLine,
		textAlign: 'center'
	},
	empty: { paddingBlock: space[16] }
});

export function Timeline({
	events = caseEvents,
	title = 'Case Timeline',
	onFilterChange
}: TimelineProps) {
	const [date, setDate] = useState('');
	const [systemOnly, setSystemOnly] = useState(false);
	const [oldestFirst, setOldestFirst] = useState(false);
	const visibleEvents = events.filter(
		(event) =>
			(date.length === 0 || event.date === date) && (!systemOnly || event.author === 'System')
	);
	const orderedEvents = oldestFirst ? visibleEvents.toReversed() : visibleEvents;
	const updateDate = (nextDate: string) => {
		setDate(nextDate);
		onFilterChange?.({ date: nextDate, systemOnly });
	};
	const toggleSystem = () => {
		const nextSystemOnly = !systemOnly;
		setSystemOnly(nextSystemOnly);
		onFilterChange?.({ date, systemOnly: nextSystemOnly });
	};
	return (
		<section {...stylex.props(ui.mockup, ui.panel, styles.root)}>
			<header {...stylex.props(styles.header)}>
				<div {...stylex.props(styles.heading)}>
					<h2 {...stylex.props(ui.title, ui.truncate)}>{title}</h2>
					<p {...stylex.props(ui.caption, ui.secondary)}>
						{systemOnly ? 'System Events' : 'All Events'}
					</p>
				</div>
				<button
					{...stylex.props(styles.iconButton)}
					aria-label="Show only system events"
					aria-pressed={systemOnly}
					onClick={toggleSystem}
				>
					<MockupIcon iconStyle={styles.icon} src="/mockup-icons/timelines/Timeline-imgGear.svg" />
				</button>
				<button
					{...stylex.props(styles.iconButton)}
					aria-label="Reverse event order"
					aria-pressed={oldestFirst}
					onClick={() => setOldestFirst(!oldestFirst)}
				>
					<MockupIcon
						iconStyle={styles.icon}
						src="/mockup-icons/timelines/Timeline-imgDotsHorizontal.svg"
					/>
				</button>
			</header>
			<label {...stylex.props(styles.filter)}>
				<MockupIcon
					iconStyle={styles.filterIcon}
					src="/mockup-icons/timelines/Timeline-imgCalendar.svg"
				/>
				<input
					{...stylex.props(styles.filterInput)}
					aria-label="Filter events by date"
					placeholder="Filter events by date"
					type={date.length > 0 ? 'date' : 'text'}
					value={date}
					onFocus={(event) => {
						event.currentTarget.type = 'date';
					}}
					onBlur={(event) => {
						if (date.length === 0) event.currentTarget.type = 'text';
					}}
					onChange={(event) => updateDate(event.target.value)}
				/>
			</label>
			<div {...stylex.props(ui.scrollFade, styles.events)}>
				{orderedEvents.map((event, index) => (
					<article
						{...stylex.props(
							styles.event,
							index > 0 && styles.eventAfterFirst,
							index === orderedEvents.length - 1 && styles.eventLast
						)}
						key={event.id}
					>
						<div {...stylex.props(styles.eventHeading)}>
							<div {...stylex.props(styles.eventTitle, ui.truncate)}>
								<span {...stylex.props(styles.eventLabel)}>{event.title}</span>
								{event.detail === undefined ? null : (
									<span {...stylex.props(styles.eventDetail, ui.truncate)}>{event.detail}</span>
								)}
							</div>
							<MockupIcon
								iconStyle={styles.eventIcon}
								src={`/mockup-icons/timelines/Timeline-imgInstance${event.kind === 'action' ? '' : '1'}.svg`}
							/>
						</div>
						<p {...stylex.props(styles.meta, ui.truncate)}>
							{new Date(`${event.date}T12:00:00`).toLocaleDateString('en-US')} {event.time} ·{' '}
							{event.author}
						</p>
						{event.note === undefined ? null : (
							<p {...stylex.props(styles.note, ui.truncate)}>{event.note}</p>
						)}
					</article>
				))}
				{orderedEvents.length === 0 ? (
					<p {...stylex.props(ui.caption, ui.hint, styles.empty)}>No matching events.</p>
				) : null}
			</div>
		</section>
	);
}
