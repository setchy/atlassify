import '@testing-library/jest-dom/vitest';

import { mockAtlassianCloudAccount } from '../__mocks__/account-mocks';

import { useAccountsStore, useFiltersStore, useSettingsStore } from '../stores';

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
 * Reset stores
 */
beforeEach(() => {
  useAccountsStore.getState().reset();
  useSettingsStore.getState().reset();
  useFiltersStore.getState().reset();
  useAccountsStore.setState({
    accounts: [mockAtlassianCloudAccount],
    refreshAccount: vi.fn(async (account) => account),
  });
});

/**
 * Atlassify context bridge API
 */
window.atlassify = {
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
    useAlternateIdleIcon: vi.fn(),
    useUnreadActiveIcon: vi.fn(),
  },
  notificationSoundPath: vi.fn().mockResolvedValue('/mock/assets/sounds'),
  onResetApp: vi.fn(),
  onSystemThemeUpdate: vi.fn(),
  setAutoLaunch: vi.fn(),
  setKeyboardShortcut: vi.fn(),
  raiseNativeNotification: vi.fn(),
  aptabase: {
    trackEvent: vi.fn(),
  },
};
