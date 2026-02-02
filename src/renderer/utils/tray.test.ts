import { vi } from 'vitest';

import { mockSettings } from '../__mocks__/state-mocks';

import type { SettingsState } from '../types';

import * as comms from './comms';
import { setTrayIconColorAndTitle } from './tray';

describe('renderer/utils/tray.ts', () => {
  const updateTrayColorSpy = vi.spyOn(comms, 'updateTrayColor');
  const updateTrayTitleSpy = vi.spyOn(comms, 'updateTrayTitle');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('setTrayIconColorAndTitle', () => {
    it('should update tray color and title when showNotificationsCountInTray is true and has notifications', () => {
      const settings: SettingsState = {
        ...mockSettings,
        showNotificationsCountInTray: true,
      };

      setTrayIconColorAndTitle(5, false, settings);

      expect(updateTrayColorSpy).toHaveBeenCalledTimes(1);
      expect(updateTrayColorSpy).toHaveBeenCalledWith(5);
      expect(updateTrayTitleSpy).toHaveBeenCalledTimes(1);
      expect(updateTrayTitleSpy).toHaveBeenCalledWith('5');
    });

    it('should update tray color and title when showNotificationsCountInTray is true and has more notifications', () => {
      const settings: SettingsState = {
        ...mockSettings,
        showNotificationsCountInTray: true,
      };

      setTrayIconColorAndTitle(5, true, settings);

      expect(updateTrayColorSpy).toHaveBeenCalledTimes(1);
      expect(updateTrayColorSpy).toHaveBeenCalledWith(5);
      expect(updateTrayTitleSpy).toHaveBeenCalledTimes(1);
      expect(updateTrayTitleSpy).toHaveBeenCalledWith('5+');
    });

    it('should update tray color and empty title when showNotificationsCountInTray is false and has notifications', () => {
      const settings: SettingsState = {
        ...mockSettings,
        showNotificationsCountInTray: false,
      };

      setTrayIconColorAndTitle(5, false, settings);

      expect(updateTrayColorSpy).toHaveBeenCalledTimes(1);
      expect(updateTrayColorSpy).toHaveBeenCalledWith(5);
      expect(updateTrayTitleSpy).toHaveBeenCalledTimes(1);
      expect(updateTrayTitleSpy).toHaveBeenCalledWith('');
    });

    it('should update tray with empty title when no notifications', () => {
      const settings: SettingsState = {
        ...mockSettings,
        showNotificationsCountInTray: true,
      };

      setTrayIconColorAndTitle(0, false, settings);

      expect(updateTrayColorSpy).toHaveBeenCalledTimes(1);
      expect(updateTrayColorSpy).toHaveBeenCalledWith(0);
      expect(updateTrayTitleSpy).toHaveBeenCalledTimes(1);
      expect(updateTrayTitleSpy).toHaveBeenCalledWith('');
    });
  });
});
