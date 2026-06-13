import type { Menubar } from 'electron-menubar';

import { EVENTS } from '../../shared/events';

import { registerSystemHandlers } from './system';

const onMock = vi.fn();

vi.mock('electron', () => ({
  ipcMain: {
    on: (...args: unknown[]) => onMock(...args),
  } satisfies Pick<Electron.IpcMain, 'on'>,
  app: {
    setLoginItemSettings: vi.fn(),
  } satisfies Pick<Electron.App, 'setLoginItemSettings'>,
  shell: {
    openExternal: vi.fn(),
  } satisfies Pick<Electron.Shell, 'openExternal'>,
  powerMonitor: {
    on: vi.fn(),
  } satisfies Pick<Electron.PowerMonitor, 'on'>,
}));

describe('main/handlers/system.ts', () => {
  let menubar: Menubar;
  let setGlobalShortcutMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    setGlobalShortcutMock = vi.fn().mockReturnValue(true);

    menubar = {
      showWindow: vi.fn(),
      hideWindow: vi.fn(),
      setGlobalShortcut: setGlobalShortcutMock,
      window: {
        isVisible: vi.fn().mockReturnValue(false),
      },
    } as unknown as Menubar;
  });

  describe('registerSystemHandlers', () => {
    it('registers handlers without throwing', () => {
      expect(() => registerSystemHandlers(menubar)).not.toThrow();
    });

    it('registers expected system IPC event handlers', () => {
      registerSystemHandlers(menubar);

      const registeredEvents = onMock.mock.calls.map(
        (call: [string]) => call[0],
      );

      expect(registeredEvents).toContain(EVENTS.OPEN_EXTERNAL);
      expect(registeredEvents).toContain(EVENTS.UPDATE_KEYBOARD_SHORTCUT);
      expect(registeredEvents).toContain(EVENTS.UPDATE_AUTO_LAUNCH);
    });
  });
});
