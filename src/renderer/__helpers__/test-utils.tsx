import { render } from '@testing-library/react';
import { type ReactElement, type ReactNode, useMemo } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';

import { AppContext, type AppContextState } from '../context/App';

const EMPTY_APP_CONTEXT: Partial<AppContextState> = {};

/**
 * Test context (settings removed as it's no longer in context)
 */
type TestAppContext = Partial<AppContextState>;

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
function AppContextProvider({
  children,
  value = EMPTY_APP_CONTEXT,
}: AppContextProviderProps) {
  const defaultValue: Partial<AppContextState> = useMemo(() => {
    return {
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
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        refetchInterval: false,
      },
    },
  });

  return render(ui, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <AppContextProvider value={context}>{children}</AppContextProvider>
      </QueryClientProvider>
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
