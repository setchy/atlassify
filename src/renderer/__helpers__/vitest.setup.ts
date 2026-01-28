import { vi } from 'vitest';
import '@testing-library/jest-dom';
import { TextEncoder } from 'node:util';

// Polyfill for window.matchMedia for Vitest (jsdom)
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = () => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

// Completely strip out Atlaskit feature flag modules (never used, prevents all code execution)
vi.mock('@atlaskit/feature-gate-js-client', () => ({}));
// Stub Atlaskit feature flags so tests don't hit the Feature Gate client (Jest-style)
vi.mock('@atlaskit/platform-feature-flags', () => ({
  fg: () => false,
}));
vi.mock('@atlaskit/ds-lib/dist/cjs/utils/use-id', () => ({
  useIdSeed: () => () => 'mock-id',
  useUniqueId: () => 'mock-id',
}));
// Minimal Jest-style mock for @atlaskit/tokens
vi.mock('@atlaskit/tokens', () => ({
  setGlobalTheme: () => {},
  token: () => '',
  useThemeObserver: () => ({}),
}));

window.atlassify = {
  app: {
    version: vi.fn().mockResolvedValue('v0.0.1'),
    hide: vi.fn(),
    quit: vi.fn(),
    show: vi.fn(),
  },
  twemojiDirectory: vi.fn().mockResolvedValue('/mock/images/assets'),
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
  notificationSoundPath: vi.fn(),
  onResetApp: vi.fn(),
  onSystemThemeUpdate: vi.fn(),
  setAutoLaunch: vi.fn(),
  setKeyboardShortcut: vi.fn(),
  raiseNativeNotification: vi.fn(),
  aptabase: {
    trackEvent: vi.fn(),
  },
};

// Suppress Aptabase fetch errors by mocking fetch
if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
  if (!window._originalFetch) {
    window._originalFetch = window.fetch;
    window.fetch = (...args) => {
      if (typeof args[0] === 'string' && args[0].includes('aptabase')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({}),
        });
      }
      return window._originalFetch(...args);
    };
  }
}

window.TextEncoder = TextEncoder;
window.HTMLMediaElement.prototype.play = vi.fn();
