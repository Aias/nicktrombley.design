import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import '@fontsource-variable/inter';
import './styles/reset.css';
import './styles/stylex.css';
import { Portfolio } from './Portfolio';

const root = document.getElementById('root');
if (!root) throw new Error('Portfolio root element is missing');
const app = (
	<StrictMode>
		<Portfolio />
	</StrictMode>
);
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
