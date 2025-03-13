import { TextDecoder, TextEncoder } from 'node:util';

/**
 * Prevent the following errors with jest:
 * - ReferenceError: TextEncoder is not defined
 * - ReferenceError: TextDecoder is not defined
 */
if (!global.TextEncoder || !global.TextDecoder) {
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

window.atlassify = {
  app: {
    version: () => Promise.resolve('v0.0.1'),
    hide: jest.fn(),
    quit: jest.fn(),
    show: jest.fn(),
  },
  twemojiDirectory: () => Promise.resolve('/mock/images/assets'),
  openExternalLink: jest.fn(),
  decryptValue: () => Promise.resolve('decrypted'),
  encryptValue: () => Promise.resolve('encrypted'),
  platform: {
    isLinux: () => false,
    isMacOS: () => true,
    isWindows: () => false,
  },
  zoom: {
    getLevel: jest.fn(),
    setLevel: jest.fn(),
  },
  tray: {
    updateIcon: jest.fn(),
    updateTitle: jest.fn(),
    useAlternateIdleIcon: jest.fn(),
  },
  notificationSoundPath: jest.fn(),
  onResetApp: jest.fn(),
  onSystemThemeUpdate: jest.fn(),
  setAutoLaunch: jest.fn(),
  setKeyboardShortcut: jest.fn(),
  raiseNativeNotification: jest.fn(),
};
