import { useState, type FormEvent } from 'react';
import * as stylex from '@stylexjs/stylex';
import { ui } from '../../styles/primitives';
import { colors, space } from '../../styles/tokens.stylex';
import { FormsIcon } from './FormsIcon';

type Comparison = { predictor: string; outcome: string };

type BigButtonProps = {
	title?: string;
	description?: string;
	buttonLabel?: string;
	onStart?: (comparison: Comparison) => void;
};

const styles = stylex.create({
	root: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		gap: '0.625rem',
		paddingBlock: space[20],
		paddingInline: space[24],
		textAlign: 'center'
	},
	editing: { justifyContent: 'flex-start', paddingBlock: space[8], overflowY: 'auto' },
	copy: {
		display: 'flex',
		width: '100%',
		minWidth: 0,
		flexDirection: 'column',
		alignItems: 'center',
		gap: space[4]
	},
	text: { width: '100%' },
	start: {
		height: space[32],
		paddingInline: space[12],
		gap: space[8],
		backgroundColor: { 'default': colors.component, ':hover': colors.tone }
	},
	form: { display: 'grid', width: '100%', gap: space[8] },
	fields: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: space[8] },
	actions: { display: 'flex', justifyContent: 'center', gap: space[8] },
	submit: { backgroundColor: { 'default': colors.component, ':hover': colors.tone } }
});

export function BigButton({
	title = 'Association Analysis',
	description = 'Determine the effect of a predictor on an outcome.',
	buttonLabel = 'Start New Comparison',
	onStart
}: BigButtonProps) {
	const [editing, setEditing] = useState(false);
	const [predictor, setPredictor] = useState('');
	const [outcome, setOutcome] = useState('');
	const [comparison, setComparison] = useState<Comparison>();

	function submitComparison(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const nextComparison = { predictor, outcome };
		setComparison(nextComparison);
		setEditing(false);
		onStart?.(nextComparison);
	}

	return (
		<section {...stylex.props(ui.mockup, ui.panel, styles.root, editing && styles.editing)}>
			{editing ? (
				<form {...stylex.props(styles.form)} onSubmit={submitComparison}>
					<div {...stylex.props(styles.copy)}>
						<h2 {...stylex.props(ui.heading, ui.truncate, styles.text)}>{title}</h2>
						<p {...stylex.props(ui.secondary, ui.truncate, styles.text)}>{description}</p>
					</div>
					<div {...stylex.props(styles.fields)}>
						<input
							{...stylex.props(ui.input)}
							aria-label="Predictor"
							placeholder="Predictor"
							required
							value={predictor}
							onChange={(event) => setPredictor(event.target.value)}
						/>
						<input
							{...stylex.props(ui.input)}
							aria-label="Outcome"
							placeholder="Outcome"
							required
							value={outcome}
							onChange={(event) => setOutcome(event.target.value)}
						/>
					</div>
					<div {...stylex.props(styles.actions)}>
						<button type="button" {...stylex.props(ui.button)} onClick={() => setEditing(false)}>
							Cancel
						</button>
						<button type="submit" {...stylex.props(ui.button, styles.submit)}>
							Create Comparison
						</button>
					</div>
				</form>
			) : (
				<>
					<div {...stylex.props(styles.copy)}>
						<h2 {...stylex.props(ui.heading, ui.truncate, styles.text)}>{title}</h2>
						<p {...stylex.props(ui.secondary, ui.truncate, styles.text)}>
							{comparison ? `${comparison.predictor} → ${comparison.outcome}` : description}
						</p>
					</div>
					<button
						type="button"
						{...stylex.props(ui.button, styles.start)}
						onClick={() => setEditing(true)}
					>
						<FormsIcon name="BigButton-imgLeftIcon" size={16} />
						{buttonLabel}
					</button>
				</>
			)}
		</section>
	);
}
