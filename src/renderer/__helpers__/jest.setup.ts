import '@testing-library/jest-dom';

import { TextDecoder, TextEncoder } from 'node:util';

/**
 * Prevent the following errors with jest:
 * - ReferenceError: TextEncoder is not defined
 * - ReferenceError: TextDecoder is not defined
 */
if (!('TextEncoder' in globalThis)) {
  (globalThis as unknown as { TextEncoder: typeof TextEncoder }).TextEncoder =
    TextEncoder;
}
if (!('TextDecoder' in globalThis)) {
  (globalThis as unknown as { TextDecoder: typeof TextDecoder }).TextDecoder =
    TextDecoder;
}

// @ts-expect-error
window.Audio = class Audio {
  play() {}
};

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
