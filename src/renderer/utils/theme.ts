import { getGlobalTheme, setGlobalTheme } from '@atlaskit/tokens';

import { Theme } from '../../shared/theme';

export function getTheme(): Theme {
  return getGlobalTheme().colorMode === 'dark' ? Theme.DARK : Theme.LIGHT;
}

export function isLightMode(): boolean {
  return getTheme() === Theme.LIGHT;
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

function setLightMode() {
  document.querySelector('html').classList.remove('dark');
  setGlobalTheme({ colorMode: 'light' });
}

function setDarkMode() {
  document.querySelector('html').classList.add('dark');
  setGlobalTheme({ colorMode: 'dark' });
}
