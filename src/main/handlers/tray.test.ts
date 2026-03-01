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
      isOnline: true,
      useUnreadActiveIcon: false,
      useAlternateIdleIcon: false,
    };

    it('returns offline icon when not online', () => {
      expect(selectTrayIcon({ ...base, isOnline: false })).toBe(
        TrayIcons.offline,
      );
    });

    it('returns error icon when notificationsCount is negative', () => {
      expect(selectTrayIcon({ ...base, notificationsCount: -1 })).toBe(
        TrayIcons.error,
      );
    });

    it('returns active icon when there are notifications and useUnreadActiveIcon is true', () => {
      expect(
        selectTrayIcon({
          ...base,
          notificationsCount: 3,
          useUnreadActiveIcon: true,
        }),
      ).toBe(TrayIcons.active);
    });

    it('returns idle icon when there are notifications but useUnreadActiveIcon is false', () => {
      expect(
        selectTrayIcon({
          ...base,
          notificationsCount: 3,
          useUnreadActiveIcon: false,
        }),
      ).toBe(TrayIcons.idle);
    });

    it('returns idleAlternate icon when there are notifications, useUnreadActiveIcon is false, and useAlternateIdleIcon is true', () => {
      expect(
        selectTrayIcon({
          ...base,
          notificationsCount: 3,
          useUnreadActiveIcon: false,
          useAlternateIdleIcon: true,
        }),
      ).toBe(TrayIcons.idleAlternate);
    });

    it('returns idle icon when there are no notifications', () => {
      expect(selectTrayIcon({ ...base, notificationsCount: 0 })).toBe(
        TrayIcons.idle,
      );
    });

    it('returns idleAlternate icon when there are no notifications and useAlternateIdleIcon is true', () => {
      expect(
        selectTrayIcon({
          ...base,
          notificationsCount: 0,
          useAlternateIdleIcon: true,
        }),
      ).toBe(TrayIcons.idleAlternate);
    });
  });
});
