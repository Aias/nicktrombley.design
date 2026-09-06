import { useEffect, useId, useRef, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { ui } from '../../styles/primitives';
import { colors, radius, space, typeScale } from '../../styles/tokens.stylex';
import { MockupIcon } from './MockupIcon';

export interface JourneyEvent {
	id: string;
	label: string;
	content: string;
	phase: 'before' | 'after';
	position?: number;
	height?: number;
}

export interface JourneyMapProps {
	title?: string;
	person?: string;
	caption?: string;
	events?: JourneyEvent[];
	initialBeforeAfter?: boolean;
	onBeforeAfterChange?: (visible: boolean) => void;
	onEventSelect?: (event: JourneyEvent) => void;
}

const defaultEvents: JourneyEvent[] = [
	{
		id: 'companion',
		label: 'Care Companion',
		content:
			'Through patient matching, a care coordinator is assigned to help answer my questions.',
		phase: 'after',
		position: 80 / 576,
		height: 86 / 220
	},
	{
		id: 'healthy',
		label: 'Healthy Planet',
		content:
			'Patients who are high risk are automatically sent reminders before every appointment.',
		phase: 'after',
		position: 0.5,
		height: 33 / 220
	},
	{
		id: 'mobile',
		label: 'Mobile App',
		content: 'Checklists, patient education materials, and videos help build new, healthy habits.',
		phase: 'after',
		position: 496 / 576,
		height: 54 / 220
	},
	{
		id: 'diagnosis',
		label: 'New Diagnosis',
		content: 'I’m overwhelmed. My recent diagnosis of diabetes has completely upended my life.',
		phase: 'before',
		position: 80 / 576,
		height: 6 / 120
	},
	{
		id: 'missed',
		label: 'Missed Appointment',
		content:
			'I thought that I could manage everything myself, but I keep missing important meetings.',
		phase: 'before',
		position: 0.5,
		height: 39 / 120
	},
	{
		id: 'condition',
		label: 'Condition Management',
		content:
			'I didn’t realize there would be so many different aspects of this condition to deal with.',
		phase: 'before',
		position: 496 / 576,
		height: 62 / 120
	}
];

const chartWidth = 1000;
const cardMaximumWidth = 10;
const cardWidthPercentage = 28;

const styles = stylex.create({
	root: { position: 'relative', display: 'flex', flexDirection: 'column', padding: space[16] },
	map: { position: 'relative', flex: '1', minHeight: 0 },
	identity: {
		position: 'absolute',
		zIndex: 3,
		top: 0,
		left: 0,
		display: 'flex',
		alignItems: 'flex-start',
		gap: space[4],
		minWidth: 0
	},
	personIcon: {
		width: '0.875rem',
		height: '0.875rem',
		marginTop: space[3],
		flexShrink: 0
	},
	identityCopy: { display: 'flex', flexDirection: 'column', minWidth: 0 },
	canvas: {
		position: 'absolute',
		inset: 0,
		width: '100%',
		height: '100%',
		overflow: 'visible'
	},
	curve: {
		fill: 'none',
		stroke: colors.main,
		strokeWidth: 1,
		vectorEffect: 'non-scaling-stroke'
	},
	endpoint: { fill: colors.main },
	dot: (left: string, top: string) => ({
		position: 'absolute',
		zIndex: 1,
		left,
		top,
		width: space[8],
		height: space[8],
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: colors.ring,
		borderRadius: radius.full,
		backgroundColor: colors.component,
		transform: 'translate(-50%, -50%)'
	}),
	dotBefore: { backgroundColor: colors.background },
	startDot: { width: space[6], height: space[6], borderWidth: 0, backgroundColor: colors.main },
	card: (left: string, top: string) => ({
		position: 'absolute',
		zIndex: 2,
		left,
		top,
		display: 'flex',
		flexDirection: 'column',
		gap: space[4],
		width: `min(${cardMaximumWidth}rem, ${cardWidthPercentage}%)`,
		paddingBlock: space[8],
		paddingInline: space[12],
		borderWidth: 0,
		boxShadow: `inset 0 0 0 1px ${colors.border}`,
		borderRadius: radius.medium,
		backgroundColor: colors.container,
		color: colors.primary,
		textAlign: 'left',
		transform: `translate(-50%, calc(-100% - ${space[16]}))`,
		cursor: 'pointer'
	}),
	cardBefore: {
		backgroundColor: colors.background,
		boxShadow: `inset 0 0 0 1px ${colors.dividerSubtle}`,
		transform: `translate(-50%, ${space[16]})`
	},
	cardSelected: {
		borderColor: colors.borderActive,
		boxShadow: `0 0 0 1px ${colors.ring}`
	},
	cardAfterTail: {
		'::after': {
			content: '""',
			position: 'absolute',
			left: 'calc(50% - 0.353553rem)',
			bottom: '-0.353553rem',
			width: '0.707107rem',
			height: '0.707107rem',
			borderRightWidth: 1,
			borderRightStyle: 'solid',
			borderRightColor: colors.border,
			borderBottomWidth: 1,
			borderBottomStyle: 'solid',
			borderBottomColor: colors.border,
			backgroundColor: colors.container,
			transform: 'rotate(45deg)'
		}
	},
	cardBeforeTail: {
		'::before': {
			content: '""',
			position: 'absolute',
			left: 'calc(50% - 0.353553rem)',
			top: '-0.353553rem',
			width: '0.707107rem',
			height: '0.707107rem',
			borderLeftWidth: 1,
			borderLeftStyle: 'solid',
			borderLeftColor: colors.dividerSubtle,
			borderTopWidth: 1,
			borderTopStyle: 'solid',
			borderTopColor: colors.dividerSubtle,
			backgroundColor: colors.background,
			transform: 'rotate(45deg)'
		}
	},
	cardTitle: {
		position: 'relative',
		zIndex: 1,
		fontSize: typeScale.caption,
		lineHeight: typeScale.captionLine,
		fontWeight: 575,
		textAlign: 'center'
	},
	cardContent: {
		position: 'relative',
		zIndex: 1,
		display: '-webkit-box',
		overflow: 'hidden',
		fontSize: typeScale.tiny,
		lineHeight: typeScale.tinyLine,
		WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 3
	},
	caption: {
		position: 'absolute',
		right: 0,
		top: '50%',
		width: 'min(18rem, 50%)',
		padding: space[8],
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: colors.divider,
		borderRadius: radius.small,
		backgroundColor: colors.background,
		color: colors.accent,
		fontSize: typeScale.tiny,
		lineHeight: typeScale.tinyLine,
		textAlign: 'center',
		transform: 'translateY(-50%)'
	},
	footer: {
		position: 'absolute',
		bottom: space[16],
		left: space[16],
		display: 'flex',
		alignItems: 'center',
		gap: space[6],
		height: space[16],
		flexShrink: 0
	},
	toggleControl: { display: 'grid', placeItems: 'center', flexShrink: 0 },
	toggle: {
		gridColumnStart: '1',
		gridRowStart: '1',
		appearance: 'none',
		width: '0.875rem',
		height: '0.875rem',
		padding: 0,
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: colors.border,
		borderRadius: radius.small,
		backgroundColor: { 'default': colors.container, ':hover': colors.tint },
		cursor: 'pointer'
	},
	toggleActive: { backgroundColor: colors.tint },
	check: {
		gridColumnStart: '1',
		gridRowStart: '1',
		width: space[12],
		height: space[12],
		pointerEvents: 'none'
	}
});

function clampHeight(value: number): number {
	return Math.max(0.05, Math.min(0.95, value));
}

function positionInset(availableWidth: number): number | undefined {
	if (availableWidth <= 0) return undefined;
	const cardWidth = Math.min(cardMaximumWidth, (availableWidth * cardWidthPercentage) / 100);
	return cardWidth / availableWidth / 2;
}

function eventPosition(
	event: JourneyEvent,
	index: number,
	count: number,
	inset: number | undefined
): number {
	if (event.position !== undefined)
		return inset === undefined
			? Math.max(0, Math.min(1, event.position))
			: Math.max(inset, Math.min(1 - inset, event.position));
	if (count <= 1) return 0.5;
	const boundary = inset ?? cardWidthPercentage / 200;
	return boundary + (index / (count - 1)) * (1 - boundary * 2);
}

function pointHeight(event: JourneyEvent, index: number): number {
	return clampHeight(event.height ?? 0.26 + (index % 3) * 0.2);
}

function curvePath(points: { x: number; y: number }[], startY: number, endY: number): string {
	const [first, ...remaining] = points;
	if (first === undefined) return '';
	let path = `M 0 ${startY} C ${first.x * 0.45} ${startY}, ${first.x * 0.55} ${first.y}, ${first.x} ${first.y}`;
	let previous = first;
	for (const point of remaining) {
		const middle = (previous.x + point.x) / 2;
		path += ` C ${middle} ${previous.y}, ${middle} ${point.y}, ${point.x} ${point.y}`;
		previous = point;
	}
	path += ` C ${(previous.x + chartWidth) / 2} ${previous.y}, ${(previous.x + chartWidth) / 2} ${endY}, ${chartWidth} ${endY}`;
	return path;
}

export function JourneyMap({
	title = 'User Journey',
	person = 'Nick Trombley',
	caption = 'Via targeted interventions at key points in the user’s journey, we can dramatically increase perceived value and willingness to participate in future treatment.',
	events = defaultEvents,
	initialBeforeAfter = true,
	onBeforeAfterChange,
	onEventSelect
}: JourneyMapProps) {
	const markerId = useId();
	const [beforeAfter, setBeforeAfter] = useState(initialBeforeAfter);
	const [selectedEventId, setSelectedEventId] = useState<string>();
	const [availableWidth, setAvailableWidth] = useState(0);
	const mapRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const map = mapRef.current;
		if (map === null) return undefined;
		const observer = new ResizeObserver(([entry]) => {
			if (entry === undefined) return;
			const remSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
			if (!Number.isFinite(remSize) || remSize <= 0) return;
			const width = entry.contentRect.width / remSize;
			setAvailableWidth((current) => (current === width ? current : width));
		});
		observer.observe(map);
		return () => observer.disconnect();
	}, []);
	const visibleEvents = beforeAfter ? events : events.filter((event) => event.phase === 'after');
	const afterEvents = visibleEvents.filter((event) => event.phase === 'after');
	const beforeEvents = visibleEvents.filter((event) => event.phase === 'before');
	const inset = positionInset(availableWidth);
	const afterPoints = afterEvents.map((event, index) => ({
		event,
		x: eventPosition(event, index, afterEvents.length, inset) * chartWidth,
		y: 55 + pointHeight(event, index) * 220
	}));
	const beforePoints = beforeEvents.map((event, index) => ({
		event,
		x: eventPosition(event, index, beforeEvents.length, inset) * chartWidth,
		y: 170 + pointHeight(event, index) * 120
	}));
	const toggleBeforeAfter = () => {
		const next = !beforeAfter;
		setBeforeAfter(next);
		onBeforeAfterChange?.(next);
	};
	return (
		<section {...stylex.props(ui.mockup, ui.panel, styles.root)}>
			<div {...stylex.props(styles.map)} ref={mapRef}>
				<div {...stylex.props(styles.identity)}>
					<MockupIcon
						iconStyle={styles.personIcon}
						src="/mockup-icons/timelines/JourneyMap-imgPerson.svg"
					/>
					<div {...stylex.props(styles.identityCopy)}>
						<h2 {...stylex.props(ui.title, ui.truncate)}>{title}</h2>
						<p {...stylex.props(ui.caption, ui.secondary, ui.truncate)}>{person}</p>
					</div>
				</div>
				<svg
					{...stylex.props(styles.canvas)}
					viewBox={`0 0 ${chartWidth} 320`}
					preserveAspectRatio="none"
					aria-hidden="true"
				>
					<defs>
						<marker
							id={markerId}
							viewBox="0 0 6 6"
							refX="5"
							refY="3"
							markerWidth="6"
							markerHeight="6"
							orient="auto"
						>
							<path {...stylex.props(styles.endpoint)} d="M 0 0 L 6 3 L 0 6 L 1 3 Z" />
						</marker>
					</defs>
					<path
						{...stylex.props(styles.curve)}
						d={curvePath(afterPoints, 150, 97)}
						markerEnd={`url(#${markerId})`}
					/>
					<path
						{...stylex.props(styles.curve)}
						d={curvePath(beforePoints, 169, 227)}
						markerEnd={`url(#${markerId})`}
					/>
				</svg>
				{afterPoints.length > 0 ? (
					<span
						{...stylex.props(styles.dot('0%', `${150 / 3.2}%`), styles.startDot)}
						aria-hidden="true"
					/>
				) : null}
				{beforePoints.length > 0 ? (
					<span
						{...stylex.props(styles.dot('0%', `${169 / 3.2}%`), styles.startDot)}
						aria-hidden="true"
					/>
				) : null}
				{[...afterPoints, ...beforePoints].map((point) => (
					<span
						{...stylex.props(
							styles.dot(`${(point.x / chartWidth) * 100}%`, `${point.y / 3.2}%`),
							point.event.phase === 'before' && styles.dotBefore
						)}
						key={point.event.id}
						aria-hidden="true"
					/>
				))}
				{afterPoints.map((point) => (
					<button
						{...stylex.props(
							styles.card(`${(point.x / chartWidth) * 100}%`, `${point.y / 3.2}%`),
							styles.cardAfterTail,
							selectedEventId === point.event.id && styles.cardSelected
						)}
						key={point.event.id}
						aria-pressed={selectedEventId === point.event.id}
						onClick={() => {
							setSelectedEventId(point.event.id);
							onEventSelect?.(point.event);
						}}
					>
						<span {...stylex.props(styles.cardTitle, ui.truncate)}>{point.event.label}</span>
						<span {...stylex.props(styles.cardContent)}>{point.event.content}</span>
					</button>
				))}
				{beforePoints.map((point) => (
					<button
						{...stylex.props(
							styles.card(`${(point.x / chartWidth) * 100}%`, `${point.y / 3.2}%`),
							styles.cardBefore,
							styles.cardBeforeTail,
							selectedEventId === point.event.id && styles.cardSelected
						)}
						key={point.event.id}
						aria-pressed={selectedEventId === point.event.id}
						onClick={() => {
							setSelectedEventId(point.event.id);
							onEventSelect?.(point.event);
						}}
					>
						<span {...stylex.props(styles.cardTitle, ui.truncate)}>{point.event.label}</span>
						<span {...stylex.props(styles.cardContent)}>{point.event.content}</span>
					</button>
				))}
				{caption ? <p {...stylex.props(styles.caption)}>{caption}</p> : null}
			</div>
			<label {...stylex.props(styles.footer)}>
				<span {...stylex.props(styles.toggleControl)}>
					<input
						{...stylex.props(styles.toggle, beforeAfter && styles.toggleActive)}
						type="checkbox"
						checked={beforeAfter}
						aria-label="Toggle before and after events"
						onChange={toggleBeforeAfter}
					/>
					{beforeAfter ? (
						<MockupIcon
							iconStyle={styles.check}
							src="/mockup-icons/timelines/JourneyMap-imgCheck.svg"
						/>
					) : null}
				</span>
				<span {...stylex.props(ui.caption)}>Toggle Before/After</span>
			</label>
		</section>
	);
}
