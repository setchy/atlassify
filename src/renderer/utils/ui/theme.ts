import { getGlobalTheme, setGlobalTheme } from '@atlaskit/tokens';

import { Theme } from '../../../shared/theme';

/**
 * Returns the current application theme by reading the Atlaskit global color mode.
 *
 * @returns The active `Theme` (`Theme.DARK` or `Theme.LIGHT`).
 */
export function getTheme(): Theme {
  return getGlobalTheme().colorMode === 'dark' ? Theme.DARK : Theme.LIGHT;
}

/**
 * Returns `true` if the application is currently in light mode.
 *
 * @returns `true` if the active theme is `Theme.LIGHT`, `false` otherwise.
 */
export function isLightMode(): boolean {
  return getTheme() === Theme.LIGHT;
}

/**
 * Sets the application theme. If no mode is provided, the OS-level `prefers-color-scheme` media
 * query is used to determine the appropriate theme.
 *
 * @param mode - The `Theme` to apply. Omit to auto-detect from system preference.
 */
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
