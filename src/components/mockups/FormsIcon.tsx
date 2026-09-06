import * as stylex from '@stylexjs/stylex';
import { colors } from '../../styles/tokens.stylex';
import { MockupIcon } from './MockupIcon';

type FormsIconProps = {
	name: string;
	size?: 10 | 12 | 14 | 16 | 20;
	contrast?: boolean;
};

const styles = stylex.create({
	icon: { display: 'block', flexShrink: 0 },
	size10: { width: '0.625rem', height: '0.625rem' },
	size12: { width: '0.75rem', height: '0.75rem' },
	size14: { width: '0.875rem', height: '0.875rem' },
	size16: { width: '1rem', height: '1rem' },
	size20: { width: '1.25rem', height: '1.25rem' },
	contrast: { color: colors.mainContrast }
});

export function FormsIcon({ name, size = 14, contrast = false }: FormsIconProps) {
	return (
		<MockupIcon
			src={`/mockup-icons/forms/${name}.svg`}
			iconStyle={[
				styles.icon,
				size === 10 && styles.size10,
				size === 12 && styles.size12,
				size === 14 && styles.size14,
				size === 16 && styles.size16,
				size === 20 && styles.size20,
				contrast && styles.contrast
			]}
		/>
	);
}
