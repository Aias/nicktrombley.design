import { useState, type FormEvent } from 'react';
import * as stylex from '@stylexjs/stylex';
import { ui } from '../../styles/primitives';
import { colors, radius, space } from '../../styles/tokens.stylex';
import { FormsIcon } from './FormsIcon';

export type UserAccount = {
	id: string;
	identifier: string;
	type: string;
	source: string;
	primary?: boolean;
};
export type UserField = { label: string; value: string };
export type UserProfile = {
	name: string;
	email: string;
	avatar: string;
	roles: string[];
	fields: UserField[];
	accounts: UserAccount[];
};

type UserDetailsProps = {
	value?: UserProfile;
	defaultValue?: UserProfile;
	availableRoles?: string[];
	onChange?: (profile: UserProfile) => void;
};

const defaultProfile: UserProfile = {
	name: 'Nick Trombley',
	email: 'trombley.nick@gmail.com',
	avatar: '/mockup-icons/forms/UserDetails-imgImage.png',
	roles: ['Plan', 'Design', 'Build'],
	fields: [
		{ label: 'Title', value: 'UX Designer' },
		{ label: 'Company', value: 'Independent' },
		{ label: 'City', value: 'Cambridge' },
		{ label: 'Department', value: 'Product' },
		{ label: 'Started', value: '8/3/2013' },
		{ label: 'Last Updated', value: '3/13/2025' }
	],
	accounts: [
		{ id: 'login', identifier: 'nicktrombley', type: 'Login', source: 'Self', primary: true },
		{ id: 'email', identifier: 'trombley.nick@gmail.com', type: 'Email', source: 'Google' },
		{ id: 'linkedin', identifier: 'nick-trombley', type: 'Profile', source: 'LinkedIn' },
		{ id: 'github', identifier: '@aias', type: 'Profile', source: 'Github' }
	]
};

const styles = stylex.create({
	root: { display: 'flex', flexDirection: 'column' },
	header: {
		display: 'flex',
		height: space[32],
		flexShrink: 0,
		alignItems: 'center',
		gap: space[8],
		paddingInline: space[16],
		borderBottomWidth: 1,
		borderBottomStyle: 'solid',
		borderBottomColor: colors.divider,
		backgroundColor: colors.component
	},
	headerTitle: { flex: '1', color: colors.secondary, fontWeight: 575 },
	iconButton: {
		display: 'flex',
		flexShrink: 0,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 0,
		backgroundColor: 'transparent',
		cursor: 'pointer'
	},
	scroll: {
		minHeight: 0,
		flex: '1',
		overflow: 'auto',
		paddingBlock: space[12],
		paddingInline: space[16]
	},
	profile: { display: 'flex', flexDirection: 'column', gap: space[12] },
	identity: { display: 'flex', minWidth: 0, alignItems: 'center', gap: space[12] },
	avatar: {
		width: '2.5rem',
		height: '2.5rem',
		flexShrink: 0,
		borderRadius: radius.full,
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: colors.divider,
		objectFit: 'cover',
		filter: 'grayscale(1)'
	},
	name: { display: 'flex', minWidth: 0, flex: '1', flexDirection: 'column' },
	bold: { fontWeight: 700 },
	roles: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: space[4] },
	role: {
		display: 'inline-flex',
		height: space[24],
		alignItems: 'center',
		justifyContent: 'center',
		gap: space[4],
		paddingInline: space[8],
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: colors.divider,
		borderRadius: radius.tiny,
		backgroundColor: { 'default': colors.tint, ':hover': colors.tone },
		color: colors.primary,
		fontSize: '0.6875rem',
		lineHeight: '1rem',
		cursor: 'pointer'
	},
	activeRole: {
		borderColor: 'transparent',
		backgroundColor: { 'default': colors.tone, ':hover': colors.paint }
	},
	fields: {
		display: 'grid',
		gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
		gap: `${space[8]} ${space[12]}`
	},
	field: { minWidth: 0 },
	fieldValue: { display: 'block' },
	divider: {
		height: 1,
		marginBlock: '0.625rem',
		marginInline: `calc(${space[16]} * -1)`,
		backgroundColor: colors.divider
	},
	accounts: { display: 'flex', minWidth: 0, flexDirection: 'column', gap: space[8] },
	accountsHeading: { display: 'flex', minWidth: 0, alignItems: 'center', gap: space[8] },
	accountsTitle: { flex: '1', color: colors.hint, fontWeight: 575 },
	remove: { height: '1.25rem' },
	addForm: {
		display: 'grid',
		gridTemplateColumns: 'minmax(0, 1fr) 4.25rem 4.25rem auto',
		gap: space[4]
	},
	tableFrame: {
		minWidth: 0,
		overflowX: 'auto',
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: colors.divider,
		borderRadius: radius.small,
		backgroundColor: colors.background
	},
	table: { width: '100%', minWidth: '20rem', borderCollapse: 'collapse', tableLayout: 'fixed' },
	tableRow: {
		height: space[24],
		borderBottomWidth: 1,
		borderBottomStyle: 'solid',
		borderBottomColor: colors.divider
	},
	accountRow: { borderBottomWidth: { 'default': 1, ':last-child': 0 } },
	tableHeader: {
		backgroundColor: colors.tint,
		color: colors.secondary,
		fontWeight: 475,
		textAlign: 'left'
	},
	selectCell: { width: '2.5rem', paddingInline: space[8], textAlign: 'center' },
	primaryCell: { width: '2rem', textAlign: 'center' },
	identifierCell: { minWidth: 0, paddingInline: space[8] },
	typeCell: { width: '3.8125rem', paddingInline: space[8] },
	sourceCell: { width: '4.625rem', paddingInline: space[8] },
	cellButton: {
		display: 'flex',
		minWidth: 0,
		width: '100%',
		alignItems: 'center',
		gap: space[4],
		borderWidth: 0,
		backgroundColor: 'transparent',
		color: colors.secondary,
		cursor: 'pointer'
	},
	sortIcon: { display: 'flex' },
	sortIconAscending: { rotate: '180deg' },
	checkboxFrame: {
		position: 'relative',
		display: 'inline-flex',
		width: '0.875rem',
		height: '0.875rem',
		alignItems: 'center',
		justifyContent: 'center',
		cursor: 'pointer'
	},
	checkbox: {
		appearance: 'none',
		display: 'block',
		width: '0.875rem',
		height: '0.875rem',
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: colors.border,
		borderRadius: radius.small,
		backgroundColor: colors.component,
		cursor: 'pointer'
	},
	checked: { borderColor: colors.main, backgroundColor: colors.main },
	checkMark: {
		position: 'absolute',
		inset: 0,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		pointerEvents: 'none'
	},
	primary: { fontWeight: 575 },
	primaryMeta: { marginLeft: space[4], color: colors.secondary, fontWeight: 400 }
});

function SelectionBox({
	checked,
	label,
	onChange
}: {
	checked: boolean;
	label: string;
	onChange: (checked: boolean) => void;
}) {
	return (
		<label {...stylex.props(styles.checkboxFrame)}>
			<input
				type="checkbox"
				aria-label={label}
				checked={checked}
				{...stylex.props(styles.checkbox, checked && styles.checked)}
				onChange={(event) => onChange(event.target.checked)}
			/>
			{checked ? (
				<span {...stylex.props(styles.checkMark)}>
					<FormsIcon name="VariableSelection-imgCheck" contrast />
				</span>
			) : null}
		</label>
	);
}

export function UserDetails({
	value,
	defaultValue = defaultProfile,
	availableRoles = ['Plan', 'Design', 'Build', 'Maintain', 'Repair'],
	onChange
}: UserDetailsProps) {
	const [localProfile, setLocalProfile] = useState(defaultValue);
	const [editing, setEditing] = useState(false);
	const [adding, setAdding] = useState(false);
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [sortDirection, setSortDirection] = useState<'original' | 'ascending' | 'descending'>(
		'original'
	);
	const [newAccount, setNewAccount] = useState({ identifier: '', type: 'Profile', source: '' });
	const profile = value ?? localProfile;
	const accounts =
		sortDirection === 'original'
			? profile.accounts
			: profile.accounts.toSorted(
					(first, second) =>
						first.identifier.localeCompare(second.identifier) *
						(sortDirection === 'ascending' ? 1 : -1)
				);

	function update(nextProfile: UserProfile) {
		setLocalProfile(nextProfile);
		onChange?.(nextProfile);
	}

	function submitAccount(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		update({
			...profile,
			accounts: [...profile.accounts, { ...newAccount, id: crypto.randomUUID() }]
		});
		setNewAccount({ identifier: '', type: 'Profile', source: '' });
		setAdding(false);
	}

	return (
		<section {...stylex.props(ui.mockup, ui.panel, styles.root)}>
			<header {...stylex.props(styles.header)}>
				<FormsIcon name="UserDetails-imgPerson" size={16} />
				<h2 {...stylex.props(ui.caption, styles.headerTitle)}>USER DETAILS</h2>
				<button
					type="button"
					{...stylex.props(styles.iconButton)}
					aria-label={editing ? 'Finish editing user' : 'Edit user details'}
					aria-pressed={editing}
					onClick={() => setEditing((current) => !current)}
				>
					<FormsIcon name="UserDetails-imgDotsVertical" size={16} />
				</button>
			</header>
			<div {...stylex.props(styles.scroll)}>
				<div {...stylex.props(styles.profile)}>
					<div {...stylex.props(styles.identity)}>
						<img {...stylex.props(styles.avatar)} src={profile.avatar} alt="" />
						<div {...stylex.props(styles.name)}>
							{editing ? (
								<>
									<input
										{...stylex.props(ui.input)}
										aria-label="Name"
										value={profile.name}
										onChange={(event) => update({ ...profile, name: event.target.value })}
									/>
									<input
										{...stylex.props(ui.input)}
										aria-label="Email"
										value={profile.email}
										onChange={(event) => update({ ...profile, email: event.target.value })}
									/>
								</>
							) : (
								<>
									<h3 {...stylex.props(ui.title, ui.truncate, styles.bold)}>{profile.name}</h3>
									<p {...stylex.props(ui.secondary, ui.truncate)}>{profile.email}</p>
								</>
							)}
						</div>
					</div>
					<div {...stylex.props(styles.roles)}>
						{availableRoles.map((role) => {
							const active = profile.roles.includes(role);
							return (
								<button
									type="button"
									key={role}
									{...stylex.props(styles.role, active && styles.activeRole)}
									aria-pressed={active}
									onClick={() =>
										update({
											...profile,
											roles: active
												? profile.roles.filter((item) => item !== role)
												: [...profile.roles, role]
										})
									}
								>
									{role}
									{active ? null : <FormsIcon name="UserDetails-imgRightIcon" size={16} />}
								</button>
							);
						})}
					</div>
					<dl {...stylex.props(styles.fields)}>
						{profile.fields.map((field, index) => (
							<div key={field.label} {...stylex.props(styles.field)}>
								<dt {...stylex.props(ui.caption, ui.secondary, ui.truncate)}>{field.label}</dt>
								<dd>
									{editing ? (
										<input
											{...stylex.props(ui.input)}
											aria-label={field.label}
											value={field.value}
											onChange={(event) =>
												update({
													...profile,
													fields: profile.fields.map((item, position) =>
														position === index ? { ...item, value: event.target.value } : item
													)
												})
											}
										/>
									) : (
										<span {...stylex.props(ui.truncate, styles.fieldValue)}>{field.value}</span>
									)}
								</dd>
							</div>
						))}
					</dl>
				</div>
				<div {...stylex.props(styles.divider)} />
				<div {...stylex.props(styles.accounts)}>
					<div {...stylex.props(styles.accountsHeading)}>
						<h3 {...stylex.props(ui.caption, styles.accountsTitle)}>KNOWN ACCOUNTS</h3>
						{selectedIds.length > 0 ? (
							<button
								type="button"
								{...stylex.props(ui.button, ui.tiny, styles.remove)}
								onClick={() => {
									update({
										...profile,
										accounts: profile.accounts.filter(
											(account) => !selectedIds.includes(account.id)
										)
									});
									setSelectedIds([]);
								}}
							>
								Remove {selectedIds.length}
							</button>
						) : null}
						<button
							type="button"
							{...stylex.props(styles.iconButton)}
							aria-label={adding ? 'Cancel adding account' : 'Add account'}
							aria-expanded={adding}
							onClick={() => setAdding((current) => !current)}
						>
							<FormsIcon name="UserDetails-imgPlusCircled" size={16} />
						</button>
					</div>
					{adding ? (
						<form {...stylex.props(styles.addForm)} onSubmit={submitAccount}>
							<input
								{...stylex.props(ui.input)}
								required
								aria-label="Account identifier"
								placeholder="Identifier"
								value={newAccount.identifier}
								onChange={(event) =>
									setNewAccount({ ...newAccount, identifier: event.target.value })
								}
							/>
							<input
								{...stylex.props(ui.input)}
								required
								aria-label="Account type"
								placeholder="Type"
								value={newAccount.type}
								onChange={(event) => setNewAccount({ ...newAccount, type: event.target.value })}
							/>
							<input
								{...stylex.props(ui.input)}
								required
								aria-label="Account source"
								placeholder="Source"
								value={newAccount.source}
								onChange={(event) => setNewAccount({ ...newAccount, source: event.target.value })}
							/>
							<button type="submit" {...stylex.props(ui.button)}>
								Add
							</button>
						</form>
					) : null}
					<div {...stylex.props(styles.tableFrame)}>
						<table {...stylex.props(ui.caption, styles.table)}>
							<thead>
								<tr {...stylex.props(styles.tableRow, styles.tableHeader)}>
									<th {...stylex.props(styles.selectCell)}>
										<SelectionBox
											checked={
												profile.accounts.length > 0 &&
												selectedIds.length === profile.accounts.length
											}
											label="Select all accounts"
											onChange={(checked) =>
												setSelectedIds(checked ? profile.accounts.map((account) => account.id) : [])
											}
										/>
									</th>
									<th {...stylex.props(styles.primaryCell)}>
										<FormsIcon name="UserDetails-imgStar" />
									</th>
									<th
										{...stylex.props(styles.identifierCell)}
										aria-sort={sortDirection === 'original' ? 'none' : sortDirection}
									>
										<button
											type="button"
											{...stylex.props(styles.cellButton)}
											onClick={() =>
												setSortDirection(sortDirection === 'ascending' ? 'descending' : 'ascending')
											}
										>
											Identifier
											<span
												{...stylex.props(
													styles.sortIcon,
													sortDirection === 'ascending' && styles.sortIconAscending
												)}
											>
												<FormsIcon name="UserDetails-imgArrowDown" size={12} />
											</span>
										</button>
									</th>
									<th {...stylex.props(styles.typeCell)}>Type</th>
									<th {...stylex.props(styles.sourceCell)}>Source</th>
								</tr>
							</thead>
							<tbody>
								{accounts.map((account) => (
									<tr key={account.id} {...stylex.props(styles.tableRow, styles.accountRow)}>
										<td {...stylex.props(styles.selectCell)}>
											<SelectionBox
												checked={selectedIds.includes(account.id)}
												label={`Select ${account.identifier}`}
												onChange={(checked) =>
													setSelectedIds(
														checked
															? [...selectedIds, account.id]
															: selectedIds.filter((id) => id !== account.id)
													)
												}
											/>
										</td>
										<td {...stylex.props(styles.primaryCell)}>
											<button
												type="button"
												{...stylex.props(styles.iconButton)}
												aria-label={`Set ${account.identifier} as primary`}
												aria-pressed={Boolean(account.primary)}
												onClick={() =>
													update({
														...profile,
														accounts: profile.accounts.map((item) => ({
															...item,
															primary: item.id === account.id
														}))
													})
												}
											>
												<FormsIcon
													name={
														account.primary ? 'UserDetails-imgStarfilled' : 'UserDetails-imgIcon'
													}
												/>
											</button>
										</td>
										<td
											{...stylex.props(
												ui.truncate,
												styles.identifierCell,
												account.primary && styles.primary
											)}
										>
											{account.identifier}
											{account.primary ? (
												<span {...stylex.props(styles.primaryMeta)}>Primary</span>
											) : null}
										</td>
										<td
											{...stylex.props(
												ui.truncate,
												styles.typeCell,
												account.primary && styles.primary
											)}
										>
											{account.type}
										</td>
										<td
											{...stylex.props(
												ui.truncate,
												styles.sourceCell,
												account.primary && styles.primary
											)}
										>
											{account.source}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</section>
	);
}
