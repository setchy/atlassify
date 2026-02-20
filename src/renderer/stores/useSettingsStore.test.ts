import { act, renderHook } from '@testing-library/react';

import { Theme } from '../../shared/theme';

import type { Percentage } from '../types';
import { OpenPreference } from './types';

import { DEFAULT_SETTINGS_STATE } from './defaults';
import useSettingsStore from './useSettingsStore';

describe('useSettingsStore', () => {
  test('should start with default settings', () => {
    const { result } = renderHook(() => useSettingsStore());

    expect(result.current).toMatchObject(DEFAULT_SETTINGS_STATE);
  });

  describe('Appearance Settings', () => {
    test('should update theme', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.updateSetting('theme', Theme.DARK);
      });

      expect(result.current.theme).toBe(Theme.DARK);
    });

    test('should update zoom percentage', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.updateSetting('zoomPercentage', 150 as Percentage);
      });

      expect(result.current.zoomPercentage).toBe(150);
    });
  });

  describe('Notification Settings', () => {
    test('should update markAsReadOnOpen', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.updateSetting('markAsReadOnOpen', false);
      });

      expect(result.current.markAsReadOnOpen).toBe(false);
    });

    test('should update fetchOnlyUnreadNotifications', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.updateSetting('fetchOnlyUnreadNotifications', false);
      });

      expect(result.current.fetchOnlyUnreadNotifications).toBe(false);
    });

    test('should update groupNotificationsByProduct', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.updateSetting('groupNotificationsByProduct', true);
      });

      expect(result.current.groupNotificationsByProduct).toBe(true);
    });

    test('should update groupNotificationsByTitle', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.updateSetting('groupNotificationsByTitle', false);
      });

      expect(result.current.groupNotificationsByTitle).toBe(false);
    });
  });

  describe('Tray Settings', () => {
    test('should update showNotificationsCountInTray', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.updateSetting('showNotificationsCountInTray', false);
      });

      expect(result.current.showNotificationsCountInTray).toBe(false);
    });

    test('should update useUnreadActiveIcon', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.updateSetting('useUnreadActiveIcon', false);
      });

      expect(result.current.useUnreadActiveIcon).toBe(false);
    });

    test('should update useAlternateIdleIcon', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.updateSetting('useAlternateIdleIcon', true);
      });

      expect(result.current.useAlternateIdleIcon).toBe(true);
    });
  });

  describe('System Settings', () => {
    test('should update openLinks preference', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.updateSetting('openLinks', OpenPreference.BACKGROUND);
      });

      expect(result.current.openLinks).toBe(OpenPreference.BACKGROUND);
    });

    test('should update keyboardShortcutEnabled', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.updateSetting('keyboardShortcutEnabled', false);
      });

      expect(result.current.keyboardShortcutEnabled).toBe(false);
    });

    test('should update showSystemNotifications', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.updateSetting('showSystemNotifications', false);
      });

      expect(result.current.showSystemNotifications).toBe(false);
    });

    test('should update playSoundNewNotifications', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.updateSetting('playSoundNewNotifications', false);
      });

      expect(result.current.playSoundNewNotifications).toBe(false);
    });

    test('should update notificationVolume', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.updateSetting('notificationVolume', 50 as Percentage);
      });

      expect(result.current.notificationVolume).toBe(50);
    });

    test('should update openAtStartup', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.updateSetting('openAtStartup', false);
      });

      expect(result.current.openAtStartup).toBe(false);
    });
  });

  describe('Multiple Settings Updates', () => {
    test('should update multiple settings independently', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.updateSetting('theme', Theme.DARK);
        result.current.updateSetting('markAsReadOnOpen', false);
        result.current.updateSetting('openLinks', OpenPreference.BACKGROUND);
      });

      expect(result.current.theme).toBe(Theme.DARK);
      expect(result.current.markAsReadOnOpen).toBe(false);
      expect(result.current.openLinks).toBe(OpenPreference.BACKGROUND);
    });
  });

  describe('Reset', () => {
    test('should reset all settings to default', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.updateSetting('theme', Theme.DARK);
        result.current.updateSetting('markAsReadOnOpen', false);
        result.current.updateSetting('zoomPercentage', 150 as Percentage);
        result.current.updateSetting('openLinks', OpenPreference.BACKGROUND);
        result.current.reset();
      });

      expect(result.current).toMatchObject(DEFAULT_SETTINGS_STATE);
    });
  });
});
