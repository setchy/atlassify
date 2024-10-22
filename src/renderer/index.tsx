import { setGlobalTheme } from '@atlaskit/tokens';
import { createRoot } from 'react-dom/client';

import 'tailwindcss/tailwind.css';
import '@atlaskit/css-reset';

setGlobalTheme({
  light: 'light-future',
  dark: 'dark',
  colorMode: 'light',
});

import { App } from './App';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
