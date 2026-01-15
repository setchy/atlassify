import '@testing-library/jest-dom';

import { TextEncoder } from 'node:util';

// Stub Atlaskit feature flags so tests don't hit the Feature Gate client
jest.mock('@atlaskit/platform-feature-flags', () => {
  return {
    fg: jest.fn(() => false),
  };
});

/**
 * Configure axios to use the http adapter instead of XHR
 * This allows nock to intercept HTTP requests in tests
 */
import axios from 'axios';

axios.defaults.adapter = 'http';

/**
 * Atlassify context bridge API
 */
window.atlassify = {
  app: {
    version: jest.fn().mockResolvedValue('v0.0.1'),
    hide: jest.fn(),
    quit: jest.fn(),
    show: jest.fn(),
  },
  twemojiDirectory: jest.fn().mockResolvedValue('/mock/images/assets'),
  openExternalLink: jest.fn(),
  decryptValue: jest.fn().mockResolvedValue('decrypted'),
  encryptValue: jest.fn().mockResolvedValue('encrypted'),
  platform: {
    isLinux: jest.fn().mockReturnValue(false),
    isMacOS: jest.fn().mockReturnValue(true),
    isWindows: jest.fn().mockReturnValue(false),
  },
  zoom: {
    getLevel: jest.fn(),
    setLevel: jest.fn(),
  },
  tray: {
    updateColor: jest.fn(),
    updateTitle: jest.fn(),
    useAlternateIdleIcon: jest.fn(),
    useUnreadActiveIcon: jest.fn(),
  },
  notificationSoundPath: jest.fn(),
  onResetApp: jest.fn(),
  onSystemThemeUpdate: jest.fn(),
  setAutoLaunch: jest.fn(),
  setKeyboardShortcut: jest.fn(),
  raiseNativeNotification: jest.fn(),
};

// prevent ReferenceError: TextEncoder is not defined
window.TextEncoder = TextEncoder;

window.HTMLMediaElement.prototype.play = jest.fn();
