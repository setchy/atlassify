import { render } from '@testing-library/react';
import { type ReactElement, type ReactNode, useMemo } from 'react';

import axios from 'axios';
import { vi } from 'vitest';

import { mockAuth, mockSettings } from '../__mocks__/state-mocks';

import { AppContext, type AppContextState } from '../context/App.context';

import type { AtlassifyError, SettingsState } from '../types';

import {
  type NotificationActions,
  type NotificationsState,
  useNotificationsStore,
} from '../stores/notifications';

/**
 * Store-related test props that should initialize Zustand instead of context
 */
type TestStoreProps = Partial<NotificationsState> & {
  globalError?: AtlassifyError;
} & Partial<NotificationActions>;

/**
 * Test context that allows partial settings
 */
type TestAppContext = Omit<Partial<AppContextState>, 'settings'> & {
  settings?: Partial<SettingsState>;
} & TestStoreProps;

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
  // Initialize Zustand store with store-related props
  const {
    allNotifications,
    fetchStatus: status,
    fetchNotifications,
    markNotificationsRead,
    markNotificationsUnread,
    removeAccountNotifications,
    ...contextValue
  } = value;

  // Set store state if provided
  if (allNotifications !== undefined || status !== undefined) {
    useNotificationsStore.setState({
      allNotifications: allNotifications || [],
      fetchStatus: status || 'success',
    });
  }

  // Mock store actions if provided
  if (
    fetchNotifications ||
    markNotificationsRead ||
    markNotificationsUnread ||
    removeAccountNotifications
  ) {
    const store = useNotificationsStore.getState();
    if (fetchNotifications) {
      store.fetchNotifications = fetchNotifications as any;
    }
    if (markNotificationsRead) {
      store.markNotificationsRead = markNotificationsRead as any;
    }
    if (markNotificationsUnread) {
      store.markNotificationsUnread = markNotificationsUnread as any;
    }
    if (removeAccountNotifications) {
      store.removeAccountNotifications = removeAccountNotifications as any;
    }
  }

  const defaultValue: Partial<AppContextState> = useMemo(() => {
    return {
      auth: mockAuth,
      settings: mockSettings,
      isLoggedIn: true,

      ...contextValue,
    } as Partial<AppContextState>;
  }, []);

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
