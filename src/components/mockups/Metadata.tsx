import { useRef, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { ui } from '../../styles/primitives';
import { colors, radius, space } from '../../styles/tokens.stylex';
import { FormsIcon } from './FormsIcon';

export type MetadataField = {
	id: string;
	label: string;
	value?: string;
	detail?: string;
	expanded?: boolean;
	icon?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
	children?: MetadataField[];
};

export type MetadataSection = {
	id: string;
	title: string;
	pinned?: boolean;
	expanded?: boolean;
	fields: MetadataField[];
};

type MetadataProps = {
	title?: string;
	requestId?: string;
	sections?: MetadataSection[];
	onOpenRequest?: (requestId: string) => void;
	onPinChange?: (sectionId: string, pinned: boolean) => void;
};

const defaultSections: MetadataSection[] = [
	{
		id: 'pinned',
		title: 'Pinned',
		pinned: true,
		expanded: true,
		fields: [
			{ id: 'events', label: 'Common Events', value: 'Login Success, Authentication', icon: 0 },
			{ id: 'user', label: 'User', value: 'Nick Trombley (nick.trombley)', icon: 1 },
			{ id: 'host', label: 'Host', value: 'Analytics Node 1', icon: 2 },
			{ id: 'source-name', label: 'Log Source Name', value: 'host-abc-windows-event-log', icon: 3 },
			{ id: 'source-type', label: 'Log Source Type', value: 'Windows Event Log', icon: 4 },
			{ id: 'standard-time', label: 'Standard Time', value: '5/9/2023 7:48:30 AM', icon: 5 }
		]
	},
	{
		id: 'action',
		title: 'Action',
		expanded: true,
		fields: [
			{ id: 'type', label: 'Type', value: 'Apache Tomcat', icon: 4 },
			{ id: 'start', label: 'Start Time', value: '5/8/2023 2:32:01 PM', icon: 5 },
			{ id: 'end', label: 'End Time', value: '5/8/2023 2:32:15 PM', icon: 5 },
			{ id: 'duration', label: 'Duration', value: '00:00:14', icon: 6 },
			{
				id: 'authentication',
				label: 'Authentication',
				icon: 7,
				expanded: false,
				children: []
			},
			{
				id: 'network',
				label: 'Network',
				icon: 7,
				expanded: true,
				children: [
					{ id: 'method', label: 'HTTP Method', value: 'GET', icon: 4 },
					{
						id: 'agent',
						label: 'User Agent String',
						value: '${${::-j}${::-n}${::-d}${::-i}${::-}${::-d}$',
						detail:
							'bunnies.threatblue.ninja:1389/Mozilla/5.0 (Windows NT 10.0; Win64; x64) Apple WebKit / 537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
						icon: 3
					},
					{
						id: 'protocol',
						label: 'Protocol | Name',
						value: 'HTTP/1.1',
						icon: 7,
						expanded: false,
						children: []
					},
					{
						id: 'packets',
						label: 'Packet Information',
						icon: 7,
						expanded: true,
						children: [
							{ id: 'total', label: 'Total', value: '1,098', icon: 8 },
							{ id: 'sent', label: 'Sent', value: '942', icon: 8 },
							{ id: 'received', label: 'Received', value: '156', icon: 8 }
						]
					},
					{
						id: 'process',
						label: 'Process | Name',
						value: 'Login Success',
						icon: 7,
						expanded: false,
						children: []
					}
				]
			}
		]
	},
	{ id: 'event', title: 'Event', expanded: false, fields: [] },
	{
		id: 'source',
		title: 'Source',
		expanded: true,
		fields: [
			{
				id: 'server',
				label: 'Server',
				icon: 7,
				expanded: true,
				children: [
					{ id: 'server-type', label: 'Type', value: 'Ping', icon: 4 },
					{ id: 'server-origin', label: 'Origin', value: 'New York, NY', icon: 10 },
					{ id: 'server-target', label: 'Target', value: 'Boston, MA', icon: 10 }
				]
			},
			{
				id: 'client',
				label: 'Client',
				icon: 7,
				expanded: true,
				children: [
					{ id: 'client-type', label: 'Type', value: 'Page Request', icon: 4 },
					{ id: 'client-origin', label: 'Origin', value: 'Boston, MA', icon: 10 },
					{ id: 'client-target', label: 'Target', value: 'New York, NY', icon: 10 }
				]
			}
		]
	}
];

const styles = stylex.create({
	root: { display: 'flex', flexDirection: 'column' },
	header: {
		display: 'flex',
		flexShrink: 0,
		gap: space[8],
		alignItems: 'flex-start',
		paddingBlock: space[12],
		paddingInline: space[16],
		borderBottomWidth: 1,
		borderBottomStyle: 'solid',
		borderBottomColor: colors.divider,
		backgroundColor: colors.component
	},
	headerCopy: { display: 'flex', minWidth: 0, flex: '1', flexDirection: 'column', gap: space[2] },
	headerActions: { display: 'flex', height: space[20], alignItems: 'center', gap: space[8] },
	iconButton: {
		display: 'flex',
		flexShrink: 0,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 0,
		backgroundColor: 'transparent',
		cursor: 'pointer'
	},
	search: { display: 'flex', flexShrink: 0, alignItems: 'center', gap: space[4] },
	searchInput: { width: '7rem' },
	dialog: {
		margin: 'auto',
		width: 'min(40rem, calc(100dvw - 4rem))',
		maxHeight: '80dvh',
		overflow: 'hidden',
		padding: space[16],
		backgroundColor: colors.background,
		color: colors.primary
	},
	dialogHeader: {
		display: 'flex',
		justifyContent: 'space-between',
		gap: space[16],
		marginBottom: space[16]
	},
	dialogContent: { maxHeight: 'calc(80dvh - 5rem)', overflowY: 'auto' },
	body: {
		display: 'flex',
		minHeight: 0,
		flex: '1',
		flexDirection: 'column',
		gap: space[12],
		overflowY: 'auto',
		paddingBlock: space[12],
		paddingInline: space[16]
	},
	section: {
		display: 'flex',
		width: '100%',
		flexDirection: 'column',
		gap: space[8],
		paddingBottom: space[12],
		borderBottomWidth: 1,
		borderBottomStyle: 'solid',
		borderBottomColor: colors.divider
	},
	sectionHeader: {
		display: 'flex',
		width: '100%',
		minWidth: 0,
		alignItems: 'center',
		gap: space[6]
	},
	sectionTitle: { flex: '1', color: colors.accent, fontWeight: 575 },
	fields: { display: 'flex', flexDirection: 'column', gap: space[4] },
	field: { display: 'flex', minWidth: 0, alignItems: 'flex-start', gap: space[6] },
	nestedFields: { paddingLeft: '1.625rem' },
	expansion: {
		display: 'flex',
		width: '0.875rem',
		height: space[16],
		flexShrink: 0,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 0,
		backgroundColor: 'transparent',
		cursor: 'pointer'
	},
	expansionMark: {
		display: 'flex',
		width: '0.625rem',
		height: '0.625rem',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: radius.tiny,
		backgroundColor: colors.main
	},
	fieldIcon: {
		display: 'flex',
		width: '0.875rem',
		height: space[16],
		flexShrink: 0,
		alignItems: 'center',
		justifyContent: 'center'
	},
	fieldContent: { display: 'flex', minWidth: 0, flex: '1', flexDirection: 'column' },
	fieldCopy: {
		display: 'flex',
		minWidth: 0,
		alignItems: 'center',
		gap: space[4],
		color: colors.primary
	},
	fieldLabel: { minWidth: 0, color: colors.secondary, fontWeight: 475 },
	parentLabel: { color: colors.accent, fontWeight: 575 },
	colon: { color: colors.ghost },
	fieldValue: { minWidth: 0, flex: '1' },
	fieldDetail: {
		display: '-webkit-box',
		overflow: 'hidden',
		WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 3
	},
	empty: { paddingBlock: space[8], textAlign: 'center', color: colors.hint }
});

function iconName(icon: MetadataField['icon']) {
	return icon === undefined || icon === 0
		? 'Metadata-imgDataTypeIcon'
		: `Metadata-imgDataTypeIcon${icon}`;
}

function filterFields(fields: MetadataField[], query: string): MetadataField[] {
	return fields.flatMap((field) => {
		const children = field.children ? filterFields(field.children, query) : [];
		const matches = `${field.label} ${field.value ?? ''} ${field.detail ?? ''}`
			.toLocaleLowerCase()
			.includes(query);
		if (!matches && children.length === 0) return [];
		if (matches) return [field];
		return [{ ...field, children }];
	});
}

function initiallyCollapsedFields(fields: MetadataField[]): string[] {
	return fields.flatMap((field) => [
		...(field.children !== undefined && field.expanded === false ? [field.id] : []),
		...initiallyCollapsedFields(field.children ?? [])
	]);
}

export function Metadata({
	title = 'Inspect Metadata',
	requestId = '108762891',
	sections = defaultSections,
	onOpenRequest,
	onPinChange
}: MetadataProps) {
	const [collapsedSectionIds, setCollapsedSectionIds] = useState<string[]>(
		sections.filter((section) => section.expanded === false).map((section) => section.id)
	);
	const [collapsedFieldIds, setCollapsedFieldIds] = useState<string[]>(
		sections.flatMap((section) => initiallyCollapsedFields(section.fields))
	);
	const [pinOverrides, setPinOverrides] = useState<Record<string, boolean>>({});
	const [searching, setSearching] = useState(false);
	const [query, setQuery] = useState('');
	const dialog = useRef<HTMLDialogElement>(null);
	const normalizedQuery = query.trim().toLocaleLowerCase();
	const filteredSections = normalizedQuery
		? sections.flatMap((section) => {
				if (section.title.toLocaleLowerCase().includes(normalizedQuery)) return [section];
				const fields = filterFields(section.fields, normalizedQuery);
				return fields.length > 0 ? [{ ...section, fields }] : [];
			})
		: sections;
	const visibleSections = filteredSections.toSorted(
		(first, second) =>
			Number(pinOverrides[second.id] ?? second.pinned ?? false) -
			Number(pinOverrides[first.id] ?? first.pinned ?? false)
	);

	function toggleSection(id: string) {
		setCollapsedSectionIds((current) =>
			current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
		);
	}

	function toggleField(id: string) {
		setCollapsedFieldIds((current) =>
			current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
		);
	}

	function togglePinned(section: MetadataSection) {
		const pinned = !(pinOverrides[section.id] ?? section.pinned ?? false);
		setPinOverrides((current) => ({ ...current, [section.id]: pinned }));
		onPinChange?.(section.id, pinned);
	}

	function renderFields(fields: MetadataField[]) {
		const reserveExpansion = fields.some((field) => field.children !== undefined);
		return fields.map((field) => {
			const expanded = normalizedQuery.length > 0 || !collapsedFieldIds.includes(field.id);
			return (
				<div key={field.id}>
					<div {...stylex.props(styles.field)}>
						{field.children !== undefined ? (
							<button
								type="button"
								{...stylex.props(styles.expansion)}
								aria-label={`${expanded ? 'Collapse' : 'Expand'} ${field.label}`}
								aria-expanded={expanded}
								onClick={() => toggleField(field.id)}
							>
								<span {...stylex.props(styles.expansionMark)}>
									<FormsIcon name={expanded ? 'Metadata-imgMinus' : 'Metadata-imgPlus'} size={10} />
								</span>
							</button>
						) : reserveExpansion ? (
							<span {...stylex.props(styles.expansion)} />
						) : null}
						<span {...stylex.props(styles.fieldIcon)}>
							<FormsIcon name={iconName(field.icon)} size={12} />
						</span>
						<span {...stylex.props(styles.fieldContent)}>
							<span {...stylex.props(ui.caption, styles.fieldCopy)}>
								<span
									{...stylex.props(
										ui.truncate,
										styles.fieldLabel,
										field.children !== undefined && styles.parentLabel
									)}
								>
									{field.label}
								</span>
								{field.value ? (
									<>
										<span {...stylex.props(styles.colon)}>:</span>
										<span {...stylex.props(ui.truncate, styles.fieldValue)}>{field.value}</span>
									</>
								) : null}
							</span>
							{field.detail ? (
								<span {...stylex.props(ui.caption, styles.fieldDetail)}>{field.detail}</span>
							) : null}
						</span>
					</div>
					{field.children !== undefined && expanded ? (
						<div {...stylex.props(styles.nestedFields)}>
							{field.children.length > 0 ? (
								renderFields(field.children)
							) : (
								<p {...stylex.props(ui.tiny, ui.hint)}>No fields</p>
							)}
						</div>
					) : null}
				</div>
			);
		});
	}

	return (
		<section {...stylex.props(ui.mockup, ui.panel, styles.root)}>
			<header {...stylex.props(styles.header)}>
				<div {...stylex.props(styles.headerCopy)}>
					<h2 {...stylex.props(ui.title, ui.truncate)}>{title}</h2>
					<p {...stylex.props(ui.caption, ui.secondary)}>Request #{requestId}</p>
				</div>
				<div {...stylex.props(styles.headerActions)}>
					{searching ? (
						<span {...stylex.props(styles.search)}>
							<input
								{...stylex.props(ui.input, styles.searchInput)}
								aria-label="Search metadata"
								value={query}
								onChange={(event) => setQuery(event.target.value)}
							/>
							<button
								type="button"
								{...stylex.props(styles.iconButton)}
								aria-label="Close search"
								onClick={() => {
									setSearching(false);
									setQuery('');
								}}
							>
								<FormsIcon name="Metadata-imgMinus" size={14} />
							</button>
						</span>
					) : (
						<button
							type="button"
							{...stylex.props(styles.iconButton)}
							aria-label="Search metadata"
							onClick={() => setSearching(true)}
						>
							<FormsIcon name="Metadata-imgMagnifyingGlass" />
						</button>
					)}
					<button
						type="button"
						{...stylex.props(styles.iconButton)}
						aria-label={`Open request ${requestId}`}
						onClick={() => {
							if (onOpenRequest) onOpenRequest(requestId);
							else dialog.current?.showModal();
						}}
					>
						<FormsIcon name="Metadata-imgExternalLink" />
					</button>
				</div>
			</header>
			<div {...stylex.props(styles.body, ui.scrollFade)}>
				{visibleSections.length === 0 ? (
					<p {...stylex.props(ui.caption, styles.empty)}>No matching metadata</p>
				) : (
					visibleSections.map((section) => {
						const expanded =
							normalizedQuery.length > 0 || !collapsedSectionIds.includes(section.id);
						const pinned = pinOverrides[section.id] ?? section.pinned ?? false;
						return (
							<section key={section.id} {...stylex.props(styles.section)}>
								<header {...stylex.props(styles.sectionHeader)}>
									<button
										type="button"
										{...stylex.props(styles.iconButton)}
										aria-label={`${pinned ? 'Unpin' : 'Pin'} ${section.title}`}
										aria-pressed={pinned}
										onClick={() => togglePinned(section)}
									>
										<FormsIcon
											name={pinned ? 'Metadata-imgDrawingPin' : 'Metadata-imgDragHandleDots2'}
										/>
									</button>
									<h3 {...stylex.props(ui.caption, ui.truncate, styles.sectionTitle)}>
										{section.title}
									</h3>
									<button
										type="button"
										{...stylex.props(styles.iconButton)}
										aria-label={`${expanded ? 'Collapse' : 'Expand'} ${section.title}`}
										aria-expanded={expanded}
										onClick={() => toggleSection(section.id)}
									>
										<FormsIcon
											name={expanded ? 'Metadata-imgChevronUp' : 'Metadata-imgChevronDown'}
										/>
									</button>
								</header>
								{expanded ? (
									<div {...stylex.props(styles.fields)}>
										{section.fields.length > 0 ? (
											renderFields(section.fields)
										) : (
											<p {...stylex.props(ui.tiny, ui.hint)}>No fields</p>
										)}
									</div>
								) : null}
							</section>
						);
					})
				)}
			</div>
			<dialog
				ref={dialog}
				aria-label={`Request ${requestId}`}
				{...stylex.props(ui.panel, styles.dialog)}
			>
				<header {...stylex.props(styles.dialogHeader)}>
					<h2 {...stylex.props(ui.heading)}>Request {requestId}</h2>
					<form method="dialog">
						<button {...stylex.props(ui.button)}>Close</button>
					</form>
				</header>
				<div {...stylex.props(styles.dialogContent, ui.scrollFade)}>
					{sections.map((section) => (
						<section key={section.id} {...stylex.props(styles.section)}>
							<h3 {...stylex.props(ui.title)}>{section.title}</h3>
							{renderFields(section.fields)}
						</section>
					))}
				</div>
			</dialog>
		</section>
	);
}
