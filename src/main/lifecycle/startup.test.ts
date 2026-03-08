import type { Menubar } from 'menubar';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { initializeAppLifecycle } from './startup';

const requestSingleInstanceLockMock = vi.fn(() => true);
const appOnMock = vi.fn();
const appQuitMock = vi.fn();
const nativeThemeMock = vi.fn();

vi.mock('electron', () => ({
  app: {
    requestSingleInstanceLock: () => requestSingleInstanceLockMock(),
    on: (...a: unknown[]) => appOnMock(...a),
    quit: () => appQuitMock(),
  },
  nativeTheme: {
    on: () => nativeThemeMock(),
  },
}));

const sendRendererEventMock = vi.fn();
vi.mock('../events', () => ({
  sendRendererEvent: (...a: unknown[]) => sendRendererEventMock(...a),
}));

const logInfoMock = vi.fn();
const logWarnMock = vi.fn();
vi.mock('../../shared/logger', () => ({
  logInfo: (...a: unknown[]) => logInfoMock(...a),
  logWarn: (...a: unknown[]) => logWarnMock(...a),
}));

function createMb() {
  return {
    on: vi.fn(),
    showWindow: vi.fn(),
    app: { setAppUserModelId: vi.fn(), quit: vi.fn() },
    tray: {
      setToolTip: vi.fn(),
      setIgnoreDoubleClickEvents: vi.fn(),
      on: vi.fn(),
      popUpContextMenu: vi.fn(),
    },
  };
}

describe('main/lifecycle/startup.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initializeAppLifecycle', () => {
    it('registers menubar ready handler', () => {
      const mb = createMb();
      const contextMenu = {} as Electron.Menu;

      initializeAppLifecycle(mb as unknown as Menubar, contextMenu);

      expect(mb.on).toHaveBeenCalledWith('ready', expect.any(Function));
    });

    it('quits and warns when second instance detected', () => {
      requestSingleInstanceLockMock.mockReturnValueOnce(false);
      const mb = createMb();
      const contextMenu = {} as Electron.Menu;

      initializeAppLifecycle(mb as unknown as Menubar, contextMenu);

      expect(appQuitMock).toHaveBeenCalled();
      expect(logWarnMock).toHaveBeenCalled();
    });
  });
});
