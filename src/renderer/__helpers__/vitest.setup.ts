import { TextEncoder } from 'node:util';

import * as matchers from '@testing-library/dom/matchers';

import { expect, vi } from 'vitest';

// Extend Vitest's expect with Testing Library matchers
expect.extend(matchers);

// Stub Atlaskit feature flags so tests don't hit the Feature Gate client
vi.mock('@atlaskit/platform-feature-flags', () => {
  return {
    fg: vi.fn(() => false),
  };
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

// prevent ReferenceError: TextEncoder is not defined
window.TextEncoder = TextEncoder;

window.HTMLMediaElement.prototype.play = vi.fn();
