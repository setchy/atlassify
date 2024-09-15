import { createRoot } from 'react-dom/client';

import 'nprogress/nprogress.css';
import 'tailwindcss/tailwind.css';
import '@atlaskit/css-reset';

import { App } from './app';

const container = document.getElementById('atlasify');
const root = createRoot(container);
root.render(<App />);
