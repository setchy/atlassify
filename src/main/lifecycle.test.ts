import type { Menubar } from 'menubar';

import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('electron', () => ({
  app: {
    requestSingleInstanceLock: vi.fn(() => true),
    on: vi.fn(),
    quit: vi.fn(),
  },
  nativeTheme: {
    on: vi.fn(),
  },
}));

vi.mock('./events', () => ({
  sendRendererEvent: vi.fn(),
}));

vi.mock('../shared/constants', () => ({
  APPLICATION: {
    ID: 'com.electron.atlassify',
    NAME: 'Atlassify',
  },
}));

vi.mock('../shared/events', () => ({
  EVENTS: {
    UPDATE_THEME: 'atlassify:update-theme',
  },
}));

vi.mock('../shared/logger', () => ({
  logWarn: vi.fn(),
}));

vi.mock('../shared/theme', () => ({
  Theme: {
    DARK: 'dark',
    LIGHT: 'light',
  },
}));

vi.mock('./config', () => ({
  WindowConfig: {
    width: 500,
    height: 400,
  },
}));

describe('main/lifecycle.ts', () => {
  let menubar: Menubar;

  beforeEach(() => {
    vi.clearAllMocks();

    menubar = {
      on: vi.fn(),
      showWindow: vi.fn(),
      app: { setAppUserModelId: vi.fn() },
      tray: {
        setToolTip: vi.fn(),
        setIgnoreDoubleClickEvents: vi.fn(),
        getBounds: vi
          .fn()
          .mockReturnValue({ x: 100, y: 100, width: 22, height: 22 }),
      },
      window: {
        setSize: vi.fn(),
        center: vi.fn(),
        webContents: {
          on: vi.fn(),
        },
      },
      positioner: {
        move: vi.fn(),
      },
    } as unknown as Menubar;
  });

  it('initializeAppLifecycle registers menubar ready handler', async () => {
    const { initializeAppLifecycle } = await import('./lifecycle');
    initializeAppLifecycle(menubar);

    expect(menubar.on).toHaveBeenCalledWith('ready', expect.any(Function));
  });

  it('configureWindowEvents returns early if no window', async () => {
    const { configureWindowEvents } = await import('./lifecycle');
    const mbNoWindow = { ...menubar, window: null };
    expect(() => configureWindowEvents(mbNoWindow as Menubar)).not.toThrow();
  });
});
