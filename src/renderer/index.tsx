import { setGlobalTheme } from '@atlaskit/tokens';
import { createRoot } from 'react-dom/client';

import 'tailwindcss/tailwind.css';
import '@atlaskit/css-reset';

/**
 * TODO: support theme selection #92
 */
setGlobalTheme({
  light: 'light',
  dark: 'dark',
  colorMode: 'light',
});

import { App } from './App';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
