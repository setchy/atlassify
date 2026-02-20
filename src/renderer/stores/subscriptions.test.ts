import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Theme } from '../../shared/theme';

import type { Account, Percentage } from '../types';

import { queryClient } from '../utils/api/client';
import * as comms from '../utils/comms';
import * as theme from '../utils/theme';
import * as zoom from '../utils/zoom';
import { useAccountsStore, useFiltersStore, useSettingsStore } from './';
import { initializeStoreSubscriptions } from './subscriptions';

// Mock window.atlassify
const mockZoom = {
  setLevel: vi.fn(),
  getLevel: vi.fn().mockReturnValue(0),
};

vi.stubGlobal('window', {
  atlassify: {
    zoom: mockZoom,
  },
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
});

// Mock external functions
vi.mock('../utils/theme', () => ({
  setTheme: vi.fn(),
}));

vi.mock('../utils/comms', () => ({
  setAutoLaunch: vi.fn(),
  setKeyboardShortcut: vi.fn(),
  setUseAlternateIdleIcon: vi.fn(),
  setUseUnreadActiveIcon: vi.fn(),
}));

vi.mock('../utils/zoom', () => ({
  zoomPercentageToLevel: vi.fn((percentage) => percentage / 10),
  zoomLevelToPercentage: vi.fn((level) => level * 10),
}));

vi.mock('../utils/api/client', () => ({
  queryClient: {
    invalidateQueries: vi.fn(),
  },
}));

describe('renderer/stores/subscriptions.ts', () => {
  let cleanup: (() => void) | null = null;

  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up subscriptions
    if (cleanup) {
      cleanup();
      cleanup = null;
    }
  });

  describe('initializeStoreSubscriptions', () => {
    it('should return a cleanup function', () => {
      cleanup = initializeStoreSubscriptions();

      expect(cleanup).toBeTypeOf('function');
    });

    it('should initialize zoom level on startup', () => {
      useSettingsStore.setState({
        zoomPercentage: 150 as Percentage,
      });

      cleanup = initializeStoreSubscriptions();

      expect(zoom.zoomPercentageToLevel).toHaveBeenCalledWith(150);
      expect(mockZoom.setLevel).toHaveBeenCalledWith(15); // 150 / 10
    });
  });

  describe('Settings Store Subscriptions', () => {
    beforeEach(() => {
      cleanup = initializeStoreSubscriptions();
      vi.clearAllMocks(); // Clear calls from initialization
    });

    it('should trigger setTheme when theme changes', () => {
      useSettingsStore.getState().updateSetting('theme', Theme.DARK);

      expect(theme.setTheme).toHaveBeenCalledWith(Theme.DARK);
    });

    it('should trigger setAutoLaunch when openAtStartup changes', () => {
      useSettingsStore.getState().updateSetting('openAtStartup', false);

      expect(comms.setAutoLaunch).toHaveBeenCalledWith(false);
    });

    it('should trigger setKeyboardShortcut when keyboardShortcutEnabled changes', () => {
      useSettingsStore
        .getState()
        .updateSetting('keyboardShortcutEnabled', false);

      expect(comms.setKeyboardShortcut).toHaveBeenCalledWith(false);
    });

    it('should trigger setUseUnreadActiveIcon when useUnreadActiveIcon changes', () => {
      useSettingsStore.getState().updateSetting('useUnreadActiveIcon', false);

      expect(comms.setUseUnreadActiveIcon).toHaveBeenCalledWith(false);
    });

    it('should trigger setUseAlternateIdleIcon when useAlternateIdleIcon changes', () => {
      useSettingsStore.getState().updateSetting('useAlternateIdleIcon', true);

      expect(comms.setUseAlternateIdleIcon).toHaveBeenCalledWith(true);
    });

    it('should update zoom level when zoomPercentage changes', () => {
      useSettingsStore
        .getState()
        .updateSetting('zoomPercentage', 200 as Percentage);

      expect(zoom.zoomPercentageToLevel).toHaveBeenCalledWith(200);
      expect(mockZoom.setLevel).toHaveBeenCalledWith(20); // 200 / 10
    });
  });

  describe('Filters Store Subscriptions', () => {
    beforeEach(() => {
      cleanup = initializeStoreSubscriptions();
      vi.clearAllMocks(); // Clear calls from initialization
      vi.mocked(queryClient.invalidateQueries).mockClear();
    });

    it('should invalidate queries when filters change', () => {
      useFiltersStore.getState().updateFilter('readStates', 'unread', true);

      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: expect.arrayContaining(['notifications']),
        refetchType: 'none',
      });
    });

    it('should invalidate queries with correct query key based on accounts and settings', () => {
      // Set up accounts and settings
      useAccountsStore.setState({
        accounts: [{ id: '1' } as Account, { id: '2' } as Account],
      });
      useSettingsStore.setState({
        fetchOnlyUnreadNotifications: true,
      });

      // Trigger filter change
      useFiltersStore.getState().updateFilter('categories', 'direct', true);

      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['notifications', 2, true, true],
        refetchType: 'none',
      });
    });
  });

  describe('Cleanup', () => {
    it('should unsubscribe all listeners when cleanup is called', () => {
      cleanup = initializeStoreSubscriptions();
      vi.clearAllMocks();

      // Call cleanup
      cleanup();
      cleanup = null;

      // Change settings - should NOT trigger any calls
      useSettingsStore.getState().updateSetting('theme', Theme.DARK);
      useSettingsStore.getState().updateSetting('openAtStartup', true);
      useFiltersStore.getState().updateFilter('readStates', 'unread', true);

      expect(theme.setTheme).not.toHaveBeenCalled();
      expect(comms.setAutoLaunch).not.toHaveBeenCalled();
      expect(queryClient.invalidateQueries).not.toHaveBeenCalled();
    });

    it('should remove resize event listener when cleanup is called', () => {
      cleanup = initializeStoreSubscriptions();

      cleanup();
      cleanup = null;

      expect(window.removeEventListener).toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
      );
    });
  });

  describe('Zoom Level Sync', () => {
    let resizeHandler: (() => void) | undefined;

    beforeEach(() => {
      // Capture resize handler during initialization
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      cleanup = initializeStoreSubscriptions();

      // Get the resize handler that was registered
      resizeHandler = addEventListenerSpy.mock.calls.find(
        (call) => call[0] === 'resize',
      )?.[1] as () => void;

      vi.clearAllMocks();
    });

    it('should sync zoom level from window resize to store', () => {
      vi.useFakeTimers();

      // Simulate window zoom change
      mockZoom.getLevel.mockReturnValue(15); // 150%

      expect(resizeHandler).toBeDefined();

      // Trigger resize
      resizeHandler();

      // Fast-forward debounce delay
      vi.advanceTimersByTime(200);

      expect(zoom.zoomLevelToPercentage).toHaveBeenCalledWith(15);
      expect(useSettingsStore.getState().zoomPercentage).toBe(150);

      vi.useRealTimers();
    });

    it('should not update store if zoom percentage has not changed', () => {
      vi.useFakeTimers();

      // Set current zoom to 100%
      useSettingsStore.setState({
        zoomPercentage: 100 as Percentage,
      });

      // Mock getLevel to return same value (100%)
      mockZoom.getLevel.mockReturnValue(10); // 100%

      const updateSettingSpy = vi.spyOn(
        useSettingsStore.getState(),
        'updateSetting',
      );

      // Trigger resize
      expect(resizeHandler).toBeDefined();
      if (!resizeHandler) {
        throw new Error('Resize handler not registered');
      }
      resizeHandler();
      vi.advanceTimersByTime(200);

      expect(updateSettingSpy).not.toHaveBeenCalled();

      vi.useRealTimers();
    });

    it('should debounce resize events', () => {
      vi.useFakeTimers();

      mockZoom.getLevel.mockReturnValue(12); // 120%

      // Trigger multiple resize events
      expect(resizeHandler).toBeDefined();
      if (!resizeHandler) {
        throw new Error('Resize handler not registered');
      }
      resizeHandler();
      resizeHandler();
      resizeHandler();

      // Should only call once after debounce
      vi.advanceTimersByTime(200);

      expect(zoom.zoomLevelToPercentage).toHaveBeenCalledTimes(1);

      vi.useRealTimers();
    });
  });
});
