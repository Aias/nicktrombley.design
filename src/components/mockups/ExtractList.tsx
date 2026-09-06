import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { ui } from '../../styles/primitives';
import { colors, radius, space } from '../../styles/tokens.stylex';
import { FormsIcon } from './FormsIcon';

export type Extract = {
	id: string;
	title: string;
	author: string;
	description: string;
	rating?: number;
	image?: string;
	url?: string;
};

type ExtractListProps = {
	items?: Extract[];
	onSelect?: (item: Extract) => void;
};

const defaultExtracts: Extract[] = [
	{
		id: 'knowledge',
		title: 'The Organization of Knowledge in Libraries',
		author: 'Henry Evelyn Bliss',
		description:
			'The supposition that for a changing world this ever-developing problem of the organization of knowledge requires continuing study.'
	},
	{
		id: 'untitled',
		title: 'Untitled (1960)',
		author: 'Agnes Martin',
		description: 'Drawing. Pen and ink and graphite on paper.',
		rating: 1,
		image: '/mockup-icons/forms/ExtractList-imgImage.png'
	},
	{
		id: 'tp7',
		title: 'The Teenage Engineering TP-7',
		author: 'Jason Fried',
		description:
			'It’s such a tactile delight. The clicks and friction and spinning disk and toggles and switches.'
	},
	{
		id: 'records',
		title: 'Records Management',
		author: 'Mina M. Johnson',
		description: 'A collegiate course in filing systems and procedures.',
		rating: 3,
		image: '/mockup-icons/forms/ExtractList-imgImage1.png'
	},
	{
		id: 'bureaucracy',
		title: 'Bureaucracy’s Playthings',
		author: 'Shannon Mattern',
		description:
			'Then it struck me: the flair of filing was still here in Records Management, but in another form.',
		image: '/mockup-icons/forms/ExtractList-imgImage2.png'
	},
	{
		id: 'lorax',
		title: 'The Lorax',
		author: 'Dr. Seuss',
		description:
			'Unless someone like you cares a whole awful lot, nothing is going to get better – it’s not.',
		image: '/mockup-icons/forms/ExtractList-imgImage3.png'
	},
	{
		id: 'cargo',
		title: 'Cargo Cult Science',
		author: 'Richard P. Feynman',
		description: 'A commencement address.'
	}
];

const styles = stylex.create({
	root: { overflowY: 'auto' },
	list: { width: '100%', listStyle: 'none', padding: 0 },
	listItem: { borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: colors.divider },
	item: {
		display: 'flex',
		width: '100%',
		minHeight: '3.6875rem',
		alignItems: 'center',
		gap: space[16],
		paddingBlock: space[8],
		paddingInline: space[12],
		borderWidth: 0,
		backgroundColor: { 'default': 'transparent', ':hover': colors.tint },
		color: colors.primary,
		textAlign: 'left',
		cursor: 'pointer'
	},
	copy: { display: 'flex', flex: '1', minWidth: 0, flexDirection: 'column', gap: space[2] },
	heading: {
		display: 'flex',
		minWidth: 0,
		alignItems: 'center',
		gap: space[8],
		whiteSpace: 'nowrap'
	},
	rating: { display: 'flex', flexShrink: 0, gap: space[2] },
	title: { flexShrink: 0, maxWidth: '100%' },
	author: { minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' },
	imageFrame: {
		position: 'relative',
		width: space[64],
		height: '2.625rem',
		flexShrink: 0,
		overflow: 'hidden',
		borderRadius: radius.small,
		opacity: 0.5
	},
	image: { width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1)' },
	detail: {
		display: 'flex',
		minHeight: '100%',
		flexDirection: 'column',
		gap: space[12],
		padding: space[12]
	},
	detailHeading: { display: 'flex', minWidth: 0, flexDirection: 'column', gap: space[2] },
	detailImage: {
		width: '100%',
		minHeight: 0,
		flex: '1',
		objectFit: 'contain',
		filter: 'grayscale(1)',
		borderRadius: radius.small
	},
	detailDescription: { overflowY: 'auto' },
	detailActions: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: space[8]
	},
	link: { color: colors.accent, fontSize: '0.6875rem', lineHeight: '1rem' }
});

export function ExtractList({ items = defaultExtracts, onSelect }: ExtractListProps) {
	const [selectedId, setSelectedId] = useState<string>();
	const selected = items.find((item) => item.id === selectedId);

	if (selected) {
		return (
			<section {...stylex.props(ui.mockup, ui.panel, styles.root)} aria-label="Extract details">
				<article {...stylex.props(styles.detail)}>
					<div {...stylex.props(styles.detailActions)}>
						<button
							type="button"
							{...stylex.props(ui.button)}
							onClick={() => setSelectedId(undefined)}
						>
							Back to extracts
						</button>
						{selected.url ? (
							<a {...stylex.props(styles.link)} href={selected.url}>
								Read source
							</a>
						) : null}
					</div>
					<div {...stylex.props(styles.detailHeading)}>
						<h2 {...stylex.props(ui.title, ui.truncate)}>{selected.title}</h2>
						<p {...stylex.props(ui.secondary, ui.truncate)}>{selected.author}</p>
					</div>
					{selected.image ? (
						<img {...stylex.props(styles.detailImage)} src={selected.image} alt={selected.title} />
					) : null}
					<p {...stylex.props(styles.detailDescription)}>{selected.description}</p>
				</article>
			</section>
		);
	}

	return (
		<section {...stylex.props(ui.mockup, ui.panel, styles.root)} aria-label="Extracts">
			<ul {...stylex.props(styles.list)}>
				{items.map((item) => (
					<li key={item.id} {...stylex.props(styles.listItem)}>
						<button
							type="button"
							{...stylex.props(styles.item)}
							onClick={() => {
								setSelectedId(item.id);
								onSelect?.(item);
							}}
						>
							<span {...stylex.props(styles.copy)}>
								<span {...stylex.props(styles.heading)}>
									{item.rating ? (
										<span {...stylex.props(styles.rating)} aria-label={`${item.rating} stars`}>
											{Array.from({ length: item.rating }, (_, index) => (
												<FormsIcon key={`${item.id}-${index}`} name="ExtractList-imgStarfilled" />
											))}
										</span>
									) : null}
									<span {...stylex.props(ui.title, ui.truncate, styles.title)}>{item.title}</span>
									<span {...stylex.props(styles.author)}>{item.author}</span>
								</span>
								<span {...stylex.props(ui.caption, ui.secondary, ui.truncate)}>
									{item.description}
								</span>
							</span>
							{item.image ? (
								<span {...stylex.props(styles.imageFrame)}>
									<img {...stylex.props(styles.image)} src={item.image} alt="" />
								</span>
							) : null}
						</button>
					</li>
				))}
			</ul>
		</section>
	);
}
