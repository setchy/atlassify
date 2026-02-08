import { render } from '@testing-library/react';
import { type ReactElement, type ReactNode, useMemo } from 'react';

import axios from 'axios';
import { vi } from 'vitest';

import { mockAuth, mockSettings } from '../__mocks__/state-mocks';

import { AppContext, type AppContextState } from '../context/App';

import type { SettingsState } from '../types';

import {
  defaultFiltersState,
  type FiltersState,
} from '../stores/useFiltersStore';

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
  globalThis.Math.random = vi.fn(() => 0.1);
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

/**
 * Mock the filter store state for testing.
 * This is a helper to simplify mocking useFiltersStore.getState() calls.
 *
 * Usage:
 *   mockFilterStoreState(useFiltersStore, { products: ['jira'] })
 *
 * @param useFiltersStore - The mocked useFiltersStore module
 * @param filters - Partial filter settings to override defaults
 */
export function mockFilterStoreState(
  useFiltersStore: any,
  filters: Partial<FiltersState> = {},
) {
  vi.mocked(useFiltersStore.getState).mockReturnValue({
    ...defaultFiltersState,
    ...filters,
    setFilters: vi.fn(),
    updateFilter: vi.fn(),
    clearFilters: vi.fn(),
  });
}
