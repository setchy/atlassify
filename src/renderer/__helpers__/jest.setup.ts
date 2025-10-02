import '@testing-library/jest-dom';

import { TextEncoder } from 'node:util';

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
    updateIcon: jest.fn(),
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

// @ts-expect-error: prevent ReferenceError: TextEncoder is not defined
global.TextEncoder = TextEncoder;

window.HTMLMediaElement.prototype.play = jest.fn();
