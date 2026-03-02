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
      idleIconVariant: 'default' as const,
      unreadIconVariant: 'idle' as const,
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

    it('returns active icon when there are notifications and unreadIconVariant is active', () => {
      expect(
        selectTrayIcon({
          ...base,
          notificationsCount: 3,
          unreadIconVariant: 'active',
        }),
      ).toBe(TrayIcons.active);
    });

    it('returns idle icon when there are notifications but unreadIconVariant is idle', () => {
      expect(
        selectTrayIcon({
          ...base,
          notificationsCount: 3,
          unreadIconVariant: 'idle',
        }),
      ).toBe(TrayIcons.idle);
    });

    it('returns idleAlternate icon when there are notifications, unreadIconVariant is idle, and idleIconVariant is alternative', () => {
      expect(
        selectTrayIcon({
          ...base,
          notificationsCount: 3,
          unreadIconVariant: 'idle',
          idleIconVariant: 'alternative',
        }),
      ).toBe(TrayIcons.idleAlternate);
    });

    it('returns idle icon when there are no notifications', () => {
      expect(selectTrayIcon({ ...base, notificationsCount: 0 })).toBe(
        TrayIcons.idle,
      );
    });

    it('returns idleAlternate icon when there are no notifications and idleIconVariant is alternative', () => {
      expect(
        selectTrayIcon({
          ...base,
          notificationsCount: 0,
          idleIconVariant: 'alternative',
        }),
      ).toBe(TrayIcons.idleAlternate);
    });
  });
});
