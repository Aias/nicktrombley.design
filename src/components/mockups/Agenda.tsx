import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { ui } from '../../styles/primitives';
import { colors, radius, space, typeScale } from '../../styles/tokens.stylex';
import { MockupIcon } from './MockupIcon';

export interface AgendaEvent {
	id: string;
	title: string;
	category: string;
	description: string;
	location: string;
	minutes: number;
	date: string;
}

export interface AgendaProps {
	events?: AgendaEvent[];
	initialDate?: string;
	onDateChange?: (date: string) => void;
}

const agendaEvents: AgendaEvent[] = [
	{
		id: 'books',
		title: 'Book Browsing',
		category: 'Shopping',
		description: 'Time for finding new treasures.',
		location: 'Boston Athenæum',
		minutes: 120,
		date: '2025-03-20'
	},
	{
		id: 'cocktails',
		title: 'Cocktail Hour',
		category: 'Food & Drink',
		description: 'Small plates and crafted quaffs, with a bit of witchiness.',
		location: 'North End',
		minutes: 90,
		date: '2025-03-20'
	},
	{
		id: 'reading',
		title: 'Reading, Writing & Relaxation',
		category: 'Experiences',
		description: 'Pairs best with contemplative solitude and blueberry-lemon tea.',
		location: 'Home',
		minutes: 60,
		date: '2025-03-20'
	}
];

const styles = stylex.create({
	root: {
		display: 'flex',
		flexDirection: 'column',
		gap: space[8],
		padding: space[12]
	},
	header: {
		display: 'flex',
		alignItems: 'center',
		gap: space[8],
		flexShrink: 0
	},
	datePicker: {
		display: 'flex',
		alignItems: 'center',
		flexShrink: 0,
		height: space[24],
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: colors.border,
		borderRadius: radius.tiny,
		overflow: 'hidden'
	},
	dateButton: {
		width: space[20],
		height: '100%',
		padding: 0,
		borderWidth: 0,
		backgroundColor: { 'default': colors.container, ':hover': colors.tint },
		cursor: 'pointer'
	},
	dateButtonNext: {
		borderLeftWidth: 1,
		borderLeftStyle: 'solid',
		borderLeftColor: colors.border
	},
	dateButtonPrevious: {
		borderRightWidth: 1,
		borderRightStyle: 'solid',
		borderRightColor: colors.border
	},
	dateIcon: {
		display: 'block',
		width: space[12],
		height: space[12],
		marginInline: 'auto'
	},
	date: {
		minWidth: '4.75rem',
		paddingInline: space[8],
		fontSize: typeScale.tiny,
		lineHeight: typeScale.tinyLine,
		textAlign: 'center'
	},
	events: {
		display: 'flex',
		flex: '1',
		minHeight: 0,
		flexDirection: 'column',
		gap: space[8],
		overflowY: 'auto',
		paddingTop: space[2]
	},
	event: {
		display: 'flex',
		flexDirection: 'column',
		gap: space[2],
		paddingBottom: space[8],
		borderBottomWidth: 1,
		borderBottomStyle: 'solid',
		borderBottomColor: colors.divider,
		flexShrink: 0
	},
	eventHeading: {
		display: 'flex',
		alignItems: 'center',
		gap: space[16],
		minWidth: 0
	},
	eventTitle: {
		flex: '1',
		fontSize: typeScale.body,
		lineHeight: typeScale.bodyLine,
		fontWeight: 400
	},
	category: {
		flexShrink: 0,
		paddingBlock: space[2],
		paddingInline: space[4],
		borderRadius: radius.tiny,
		backgroundColor: colors.tone,
		fontSize: typeScale.tiny,
		lineHeight: typeScale.tinyLine
	},
	description: {
		fontSize: typeScale.caption,
		lineHeight: typeScale.captionLine
	},
	meta: {
		display: 'flex',
		alignItems: 'center',
		gap: space[12],
		minWidth: 0,
		color: colors.accent,
		fontSize: typeScale.tiny,
		lineHeight: typeScale.tinyLine,
		fontWeight: 550
	},
	metaItem: {
		display: 'flex',
		alignItems: 'center',
		gap: space[4],
		minWidth: 0
	},
	metaIcon: { width: space[8], height: space[8], flexShrink: 0 },
	empty: { paddingBlock: space[16] }
});

function moveDate(date: string, offset: number): string {
	const next = new Date(`${date}T12:00:00`);
	next.setDate(next.getDate() + offset);
	return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-${String(next.getDate()).padStart(2, '0')}`;
}

export function Agenda({
	events = agendaEvents,
	initialDate = '2025-03-20',
	onDateChange
}: AgendaProps) {
	const [date, setDate] = useState(initialDate);
	const visibleEvents = events.filter((event) => event.date === date);
	const changeDate = (offset: number) => {
		const value = moveDate(date, offset);
		setDate(value);
		onDateChange?.(value);
	};
	return (
		<section {...stylex.props(ui.mockup, ui.panel, styles.root)}>
			<header {...stylex.props(styles.header)}>
				<h2 {...stylex.props(ui.title, ui.truncate)}>
					{date === initialDate ? 'Today’s Agenda' : 'Agenda'}
				</h2>
				<div {...stylex.props(styles.datePicker)}>
					<button
						{...stylex.props(styles.dateButton, styles.dateButtonPrevious)}
						aria-label="Previous day"
						onClick={() => changeDate(-1)}
					>
						<MockupIcon
							iconStyle={styles.dateIcon}
							src="/mockup-icons/timelines/Agenda-imgRightIcon.svg"
						/>
					</button>
					<time {...stylex.props(styles.date)} dateTime={date}>
						{new Date(`${date}T12:00:00`).toLocaleDateString('en-US')}
					</time>
					<button
						{...stylex.props(styles.dateButton, styles.dateButtonNext)}
						aria-label="Next day"
						onClick={() => changeDate(1)}
					>
						<MockupIcon
							iconStyle={styles.dateIcon}
							src="/mockup-icons/timelines/Agenda-imgRightIcon1.svg"
						/>
					</button>
				</div>
			</header>
			<div {...stylex.props(styles.events)}>
				{visibleEvents.map((event) => (
					<article {...stylex.props(styles.event)} key={event.id}>
						<div {...stylex.props(styles.eventHeading)}>
							<h3 {...stylex.props(styles.eventTitle, ui.truncate)}>{event.title}</h3>
							<span {...stylex.props(styles.category)}>{event.category}</span>
						</div>
						<p {...stylex.props(styles.description, ui.secondary, ui.truncate)}>
							{event.description}
						</p>
						<div {...stylex.props(styles.meta)}>
							<span {...stylex.props(styles.metaItem, ui.truncate)}>
								<MockupIcon
									iconStyle={styles.metaIcon}
									src="/mockup-icons/timelines/Agenda-imgSewingPin.svg"
								/>
								{event.location}
							</span>
							<span {...stylex.props(styles.metaItem)}>
								<MockupIcon
									iconStyle={styles.metaIcon}
									src="/mockup-icons/timelines/Agenda-imgClock.svg"
								/>
								{event.minutes} mins
							</span>
						</div>
					</article>
				))}
				{visibleEvents.length === 0 ? (
					<p {...stylex.props(ui.caption, ui.hint, styles.empty)}>No events scheduled.</p>
				) : null}
			</div>
		</section>
	);
}
