import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
	icon: (name: string) => ({
		display: 'inline-block',
		width: '1.2cap',
		height: '1.2cap',
		flexShrink: 0,
		backgroundColor: 'currentColor',
		maskImage: `url(/site-icons/${name}.svg)`,
		maskSize: 'contain',
		maskRepeat: 'no-repeat',
		maskPosition: 'center'
	})
});

export function SiteIcon({
	name
}: {
	name: 'archive' | 'camera' | 'github' | 'linkedin' | 'sun' | 'moon';
}) {
	return <span aria-hidden="true" {...stylex.props(styles.icon(name))} />;
}
