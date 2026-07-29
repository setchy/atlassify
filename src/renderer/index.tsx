import { setGlobalTheme } from '@atlaskit/tokens/set-global-theme';

import { createRoot } from 'react-dom/client';

import '@atlaskit/css-reset';
import './i18n';

setGlobalTheme({
  colorMode: 'light',
  light: 'light',
  dark: 'dark',
  typography: 'typography',
});

import { App } from './App';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<App />);
