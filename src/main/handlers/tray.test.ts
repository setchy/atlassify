import type { Menubar } from 'menubar';

import { EVENTS } from '../../shared/events';

import { TrayIcons } from '../icons';
import { registerTrayHandlers, selectTrayIcon } from './tray';

const onMock = vi.fn();

vi.mock('electron', () => ({
  ipcMain: {
    on: (...args: unknown[]) => onMock(...args),
  },
}));

describe('main/handlers/tray.ts', () => {
  let menubar: Menubar;

  beforeEach(() => {
    vi.clearAllMocks();
    onMock.mockClear();

    menubar = {
      tray: {
        isDestroyed: vi.fn().mockReturnValue(false),
        setImage: vi.fn(),
        setTitle: vi.fn(),
      },
    } as unknown as Menubar;
  });

  describe('registerTrayHandlers', () => {
    it('registers handlers without throwing', () => {
      expect(() => registerTrayHandlers(menubar)).not.toThrow();
    });

    it('registers expected IPC event handlers', () => {
      registerTrayHandlers(menubar);

      const registeredEvents = onMock.mock.calls.map(
        (call: [string]) => call[0],
      );

      expect(registeredEvents).toContain(EVENTS.UPDATE_ICON_COLOR);
      expect(registeredEvents).toContain(EVENTS.UPDATE_ICON_TITLE);
    });
  });

  describe('selectTrayIcon', () => {
    const base = {
      notificationsCount: 0,
      appState: 'online' as const,
      idleIconType: 'default' as const,
      unreadIconStyle: 'idle' as const,
    };

    it('returns offline icon when appState is offline', () => {
      expect(selectTrayIcon({ ...base, appState: 'offline' })).toBe(
        TrayIcons.offline,
      );
    });

    it('returns error icon when appState is error', () => {
      expect(selectTrayIcon({ ...base, appState: 'error' })).toBe(
        TrayIcons.error,
      );
    });

    it('returns active icon when there are notifications and unreadIconStyle is active', () => {
      expect(
        selectTrayIcon({
          ...base,
          notificationsCount: 3,
          unreadIconStyle: 'active',
        }),
      ).toBe(TrayIcons.active);
    });

    it('returns idle icon when there are notifications but unreadIconStyle is idle', () => {
      expect(
        selectTrayIcon({
          ...base,
          notificationsCount: 3,
          unreadIconStyle: 'idle',
        }),
      ).toBe(TrayIcons.idle);
    });

    it('returns idleAlternate icon when there are notifications, unreadIconStyle is idle, and idleIconType is alternative', () => {
      expect(
        selectTrayIcon({
          ...base,
          notificationsCount: 3,
          unreadIconStyle: 'idle',
          idleIconType: 'alternative',
        }),
      ).toBe(TrayIcons.idleAlternate);
    });

    it('returns idle icon when there are no notifications', () => {
      expect(selectTrayIcon({ ...base, notificationsCount: 0 })).toBe(
        TrayIcons.idle,
      );
    });

    it('returns idleAlternate icon when there are no notifications and idleIconType is alternative', () => {
      expect(
        selectTrayIcon({
          ...base,
          notificationsCount: 0,
          idleIconType: 'alternative',
        }),
      ).toBe(TrayIcons.idleAlternate);
    });
  });
});
