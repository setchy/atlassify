import { createRoot } from 'react-dom/client';

import 'tailwindcss/tailwind.css';
import '@atlaskit/css-reset';

import { App } from './App';

const container = document.getElementById('atlassify');
const root = createRoot(container);
root.render(<App />);
