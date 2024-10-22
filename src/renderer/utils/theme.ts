import { getGlobalTheme, setGlobalTheme } from '@atlaskit/tokens';
import { Theme } from '../types';

export function getTheme(): Theme {
  switch (getGlobalTheme().colorMode) {
    case 'dark':
      return Theme.DARK;
    default:
      return Theme.LIGHT;
  }
}

export function setLightMode() {
  document.querySelector('html').classList.remove('dark');
  setGlobalTheme({ colorMode: 'light' });
}

export function setDarkMode() {
  document.querySelector('html').classList.add('dark');
  setGlobalTheme({ colorMode: 'dark' });
}

export function setTheme(mode?: Theme) {
  switch (mode) {
    case Theme.LIGHT:
      setLightMode();
      break;

    case Theme.DARK:
      setDarkMode();
      break;

    default:
      if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
        setDarkMode();
      } else {
        setLightMode();
      }
  }
}
