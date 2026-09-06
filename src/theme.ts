export type Theme = 'light' | 'dark' | 'system';

export function readTheme(): Theme {
	const stored = document.cookie
		.split('; ')
		.find((cookie) => cookie.startsWith('theme='))
		?.slice(6);
	return stored === 'light' || stored === 'dark' ? stored : 'system';
}

export function subscribeTheme(notify: () => void) {
	window.addEventListener('portfolio-theme', notify);
	return () => window.removeEventListener('portfolio-theme', notify);
}

export function serverTheme(): Theme {
	return 'system';
}

export function toggleTheme() {
	const current = readTheme();
	const dark =
		current === 'dark' ||
		(current === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
	document.cookie = `theme=${dark ? 'light' : 'dark'};path=/;max-age=31536000;SameSite=Lax`;
	window.dispatchEvent(new Event('portfolio-theme'));
}
