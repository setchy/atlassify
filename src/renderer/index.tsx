import { setGlobalTheme } from '@atlaskit/tokens';
import { createRoot } from 'react-dom/client';

import 'tailwindcss/tailwind.css';
import '@atlaskit/css-reset';

setGlobalTheme({
  colorMode: 'light',
  light: 'light-brand-refresh',
  dark: 'dark-brand-refresh',
  typography: 'typography-modernized',
});

import { App } from './App';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
