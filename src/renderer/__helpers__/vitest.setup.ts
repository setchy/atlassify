import '@testing-library/jest-dom/vitest';

import { mockAtlassianCloudAccount } from '../__mocks__/account-mocks';

import {
  useAccountsStore,
  useFiltersStore,
  useNotificationActionFailuresStore,
  useSettingsStore,
} from '../stores';

/**
 * Shared navigate mock — import from test-utils in any test that needs to assert on navigation
 */
export const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => navigateMock,
}));

// Ensure stability in EmojiSplash component snapshots
vi.mock('../utils/core/random', () => ({
  randomElement: vi.fn((arr: unknown[]) => arr[0]),
}));

vi.mock('axios', async (importOriginal) => {
  const actual = await importOriginal<typeof import('axios')>();
  const realAxios = actual.default;
  const wrapped = vi.fn((...args: Parameters<typeof realAxios>) =>
    realAxios(...args),
  );

  Object.assign(wrapped, realAxios);

  return {
    __esModule: true,
    default: wrapped,
    AxiosError: actual.AxiosError,
  };
});

/**
 * @compiled/vite-plugin runs in dev mode under Vitest and POSTs its compiled
 * stylesheet to a dev-server-only endpoint. There is no Vite server in the test
 * environment, so the relative URL would otherwise resolve against the happy-dom
 * document URL (http://localhost:3000) and open a real connection that always
 * fails, flooding the output with connection errors. Answer it in-process
 * instead, returning the posted CSS exactly as the plugin's own fallback would.
 */
const COMPILED_CSS_SORT_ENDPOINT = '/@compiled/vite-plugin/sort-css';
const originalFetch = globalThis.fetch.bind(globalThis);

const getFetchUrl = (input: Parameters<typeof fetch>[0]): string => {
  if (typeof input === 'string') {
    return input;
  }
  if (input instanceof URL) {
    return input.href;
  }
  return input.url;
};

const isCompiledCssSortRequest = (url: string): boolean => {
  try {
    return new URL(url, 'http://localhost').pathname.endsWith(
      COMPILED_CSS_SORT_ENDPOINT,
    );
  } catch {
    return false;
  }
};

globalThis.fetch = (input, init) => {
  if (!isCompiledCssSortRequest(getFetchUrl(input))) {
    return originalFetch(input, init);
  }

  const parsed = typeof init?.body === 'string' ? JSON.parse(init.body) : [];
  const styles: string[] = Array.isArray(parsed) ? parsed : [];

  return Promise.resolve(
    new Response(styles.join('\n'), {
      status: 200,
      headers: { 'Content-Type': 'text/css' },
    }),
  );
};

/**
 * Reset stores
 */
beforeEach(() => {
  useAccountsStore.getState().reset();
  useSettingsStore.getState().reset();
  useFiltersStore.getState().reset();
  useNotificationActionFailuresStore.getState().reset();
  useAccountsStore.setState({
    accounts: [mockAtlassianCloudAccount],
    refreshAccount: vi.fn(async (account) => account),
  });
});

/**
 * Atlassify context bridge API
 */
window.atlassify = {
  onSystemWake: vi.fn(() => vi.fn()),
  app: {
    version: vi.fn().mockResolvedValue('v0.0.1'),
    hide: vi.fn(),
    quit: vi.fn(),
    show: vi.fn(),
  },
  twemojiDirectory: vi.fn().mockResolvedValue('/mock/assets/images'),
  openExternalLink: vi.fn(),
  decryptValue: vi.fn().mockResolvedValue('decrypted'),
  encryptValue: vi.fn().mockResolvedValue('encrypted'),
  platform: {
    isLinux: vi.fn().mockReturnValue(false),
    isMacOS: vi.fn().mockReturnValue(true),
    isWindows: vi.fn().mockReturnValue(false),
  },
  zoom: {
    getLevel: vi.fn(),
    setLevel: vi.fn(),
  },
  tray: {
    updateColor: vi.fn(),
    updateTitle: vi.fn(),
  },
  notificationSoundPath: vi.fn().mockResolvedValue('/mock/assets/sounds'),
  onResetApp: vi.fn(() => vi.fn()),
  onSystemThemeUpdate: vi.fn(() => vi.fn()),
  setAutoLaunch: vi.fn(),
  setKeepWindowOnBlur: vi.fn(),
  setKeyboardShortcut: vi.fn(),
  setUseX11Backend: vi.fn(),
  raiseNativeNotification: vi.fn(),
  aptabase: {
    trackEvent: vi.fn(),
  },
};
