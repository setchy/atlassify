import { render } from '@testing-library/react';
import { type ReactElement, type ReactNode, useMemo } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';

import { AppContext, type AppContextState } from '../context/AppContext';
import { useAccountsStore, useFiltersStore, useSettingsStore } from '../stores';
import type {
  AccountsStore,
  FiltersStore,
  SettingsStore,
} from '../stores/types';

export { navigateMock } from './vitest.setup';

const EMPTY_APP_CONTEXT: TestAppContext = {};

interface RenderOptions extends Partial<AppContextState> {
  initialEntries?: string[];
  accounts?: Partial<AccountsStore>;
  settings?: Partial<SettingsStore>;
  filters?: Partial<FiltersStore>;
}

/**
 * Test context
 */
type TestAppContext = Partial<AppContextState>;

/**
 * Props for the AppContextProvider wrapper
 */
interface AppContextProviderProps {
  readonly children: ReactNode;
  readonly value?: TestAppContext;
  readonly initialEntries?: string[];
}

/**
 * Wrapper component that provides AppContext with sensible defaults for testing.
 */
function AppContextProvider({
  children,
  value = EMPTY_APP_CONTEXT,
  initialEntries,
}: AppContextProviderProps) {
  const defaultValue: TestAppContext = useMemo(() => {
    return {
      notifications: [],
      globalError: null,
      isOnline: true,
      isLoading: false,
      isFetching: false,
      isErrorOrPaused: false,
      ...value,
    } as TestAppContext;
  }, [value]);

  return (
    <MemoryRouter initialEntries={initialEntries}>
      <AppContext.Provider value={defaultValue as AppContextState}>
        {children}
      </AppContext.Provider>
    </MemoryRouter>
  );
}

/**
 * Custom render that wraps components with all providers needed for testing:
 * QueryClient, MemoryRouter, AppContext, and Zustand stores.
 *
 * Usage:
 *   renderWithProviders(<MyComponent />, { notifications, accounts, settings, filters, ... })
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    initialEntries,
    accounts,
    settings,
    filters,
    ...context
  }: RenderOptions = {},
) {
  if (accounts) {
    useAccountsStore.setState(accounts);
  }
  if (settings) {
    useSettingsStore.setState(settings);
  }
  if (filters) {
    useFiltersStore.setState(filters);
  }

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        refetchInterval: false,
        networkMode: 'online',
      },
    },
  });

  return render(ui, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <AppContextProvider initialEntries={initialEntries} value={context}>
          {children}
        </AppContextProvider>
      </QueryClientProvider>
    ),
  });
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
