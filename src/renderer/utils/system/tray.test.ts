import { useRuntimeStore, useSettingsStore } from '../../stores';

import * as comms from './comms';
import { setTrayIconColorAndTitle } from './tray';

describe('renderer/utils/system/tray.ts', () => {
  const updateTrayColorSpy = vi.spyOn(comms, 'updateTrayColor');
  const updateTrayTitleSpy = vi.spyOn(comms, 'updateTrayTitle');

  beforeEach(() => {
    useRuntimeStore.setState({
      notificationCount: 0,
      hasMoreAccountNotifications: false,
      isError: false,
      isOnline: true,
    });
    useSettingsStore.setState({
      showNotificationsCountInTray: true,
      useUnreadActiveIcon: true,
      useAlternateIdleIcon: false,
    });
  });

  describe('setTrayIconColorAndTitle', () => {
    it('should update tray color and title when showNotificationsCountInTray is true and has notifications', () => {
      useRuntimeStore.setState({ notificationCount: 5 });

      setTrayIconColorAndTitle();

      expect(updateTrayColorSpy).toHaveBeenCalledTimes(1);
      expect(updateTrayColorSpy).toHaveBeenCalledWith(
        5,
        'online',
        'default',
        'active',
      );
      expect(updateTrayTitleSpy).toHaveBeenCalledTimes(1);
      expect(updateTrayTitleSpy).toHaveBeenCalledWith('5');
    });

    it('should update tray color and title when showNotificationsCountInTray is true and has more notifications', () => {
      useRuntimeStore.setState({
        notificationCount: 5,
        hasMoreAccountNotifications: true,
      });

      setTrayIconColorAndTitle();

      expect(updateTrayColorSpy).toHaveBeenCalledTimes(1);
      expect(updateTrayColorSpy).toHaveBeenCalledWith(
        5,
        'online',
        'default',
        'active',
      );
      expect(updateTrayTitleSpy).toHaveBeenCalledTimes(1);
      expect(updateTrayTitleSpy).toHaveBeenCalledWith('5+');
    });

    it('should update tray color and empty title when showNotificationsCountInTray is false and has notifications', () => {
      useSettingsStore.setState({ showNotificationsCountInTray: false });
      useRuntimeStore.setState({ notificationCount: 5 });

      setTrayIconColorAndTitle();

      expect(updateTrayColorSpy).toHaveBeenCalledTimes(1);
      expect(updateTrayColorSpy).toHaveBeenCalledWith(
        5,
        'online',
        'default',
        'active',
      );
      expect(updateTrayTitleSpy).toHaveBeenCalledTimes(1);
      expect(updateTrayTitleSpy).toHaveBeenCalledWith('');
    });

    it('should update tray color and empty title when offline and has notifications', () => {
      useRuntimeStore.setState({ notificationCount: 5, isOnline: false });

      setTrayIconColorAndTitle();

      expect(updateTrayColorSpy).toHaveBeenCalledTimes(1);
      expect(updateTrayColorSpy).toHaveBeenCalledWith(
        5,
        'offline',
        'default',
        'active',
      );
      expect(updateTrayTitleSpy).toHaveBeenCalledTimes(1);
      expect(updateTrayTitleSpy).toHaveBeenCalledWith('');
    });

    it('should update tray with empty title when no notifications', () => {
      setTrayIconColorAndTitle();

      expect(updateTrayColorSpy).toHaveBeenCalledTimes(1);
      expect(updateTrayColorSpy).toHaveBeenCalledWith(
        0,
        'online',
        'default',
        'active',
      );
      expect(updateTrayTitleSpy).toHaveBeenCalledTimes(1);
      expect(updateTrayTitleSpy).toHaveBeenCalledWith('');
    });

    it('should use icon settings from store when updating tray color', () => {
      useSettingsStore.setState({
        useUnreadActiveIcon: false,
        useAlternateIdleIcon: true,
      });
      useRuntimeStore.setState({ notificationCount: 5 });

      setTrayIconColorAndTitle();

      expect(updateTrayColorSpy).toHaveBeenCalledWith(
        5,
        'online',
        'alternative',
        'idle',
      );
    });

    it('should pass appState error when isError is true', () => {
      useRuntimeStore.setState({ isError: true });

      setTrayIconColorAndTitle();

      expect(updateTrayColorSpy).toHaveBeenCalledWith(
        0,
        'error',
        'default',
        'active',
      );
      expect(updateTrayTitleSpy).toHaveBeenCalledWith('');
    });

    it('should pass appState offline (not error) when both isError and isOnline are false', () => {
      useRuntimeStore.setState({ isError: true, isOnline: false });

      setTrayIconColorAndTitle();

      expect(updateTrayColorSpy).toHaveBeenCalledWith(
        0,
        'offline',
        'default',
        'active',
      );
      expect(updateTrayTitleSpy).toHaveBeenCalledWith('');
    });
  });
});
