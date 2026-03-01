import type { Menubar } from 'menubar';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { initializeAppLifecycle } from './startup';

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

vi.mock('../events', () => ({
  sendRendererEvent: vi.fn(),
}));

vi.mock('../../shared/logger', () => ({
  logWarn: vi.fn(),
}));

describe('main/lifecycle/startup.ts', () => {
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
      },
    } as unknown as Menubar;
  });

  it('initializeAppLifecycle registers menubar ready handler', () => {
    initializeAppLifecycle(menubar);

    expect(menubar.on).toHaveBeenCalledWith('ready', expect.any(Function));
  });
});
