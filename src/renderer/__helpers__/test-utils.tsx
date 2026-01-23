import { render } from '@testing-library/react';
import { type ReactElement, type ReactNode, useMemo } from 'react';

import axios from 'axios';

import { mockAuth, mockSettings } from '../__mocks__/state-mocks';

import { AppContext, type AppContextState } from '../context/App';

import type { SettingsState } from '../types';

/**
 * Test context that allows partial settings
 */
type TestAppContext = Omit<Partial<AppContextState>, 'settings'> & {
  settings?: Partial<SettingsState>;
};

/**
 * Props for the AppContextProvider wrapper
 */
interface AppContextProviderProps {
  readonly children: ReactNode;
  readonly value?: TestAppContext;
}

/**
 * Wrapper component that provides AppContext with sensible defaults for testing.
 */
function AppContextProvider({ children, value = {} }: AppContextProviderProps) {
  const defaultValue: Partial<AppContextState> = useMemo(() => {
    return {
      auth: mockAuth,
      settings: mockSettings,
      isLoggedIn: true,

      notifications: [],

      status: 'success',
      globalError: null,

      ...value,
    } as Partial<AppContextState>;
  }, [value]);

  return (
    <AppContext.Provider value={defaultValue}>{children}</AppContext.Provider>
  );
}

/**
 * Custom render that wraps components with AppContextProvider by default.
 *
 * Usage:
 *   renderWithAppContext(<MyComponent />, { auth, settings, ... })
 */
export function renderWithAppContext(
  ui: ReactElement,
  context: TestAppContext = {},
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <AppContextProvider value={context}>{children}</AppContextProvider>
    ),
  });
}

/**
 * Ensure stable snapshots for our randomized emoji use-cases
 */
export function ensureStableEmojis() {
  globalThis.Math.random = jest.fn(() => 0.1);
}

/**
 * Configure axios to use the http adapter instead of XHR.
 * This allows nock to intercept HTTP requests in tests
 *
 * See: https://github.com/nock/nock?tab=readme-ov-file#axios
 */
export function configureAxiosHttpAdapterForNock() {
  axios.defaults.adapter = 'http';
}
