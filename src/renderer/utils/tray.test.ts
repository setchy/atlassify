import { useNotificationsStore, useSettingsStore } from '../stores';

import * as comms from './comms';
import { setTrayIconColorAndTitle } from './tray';

describe('renderer/utils/tray.ts', () => {
  const updateTrayColorSpy = vi.spyOn(comms, 'updateTrayColor');
  const updateTrayTitleSpy = vi.spyOn(comms, 'updateTrayTitle');

  beforeEach(() => {
    vi.clearAllMocks();
    useNotificationsStore.setState({
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
      useNotificationsStore.setState({ notificationCount: 5 });

      setTrayIconColorAndTitle();

      expect(updateTrayColorSpy).toHaveBeenCalledTimes(1);
      expect(updateTrayColorSpy).toHaveBeenCalledWith(5, true, true, false);
      expect(updateTrayTitleSpy).toHaveBeenCalledTimes(1);
      expect(updateTrayTitleSpy).toHaveBeenCalledWith('5');
    });

    it('should update tray color and title when showNotificationsCountInTray is true and has more notifications', () => {
      useNotificationsStore.setState({
        notificationCount: 5,
        hasMoreAccountNotifications: true,
      });

      setTrayIconColorAndTitle();

      expect(updateTrayColorSpy).toHaveBeenCalledTimes(1);
      expect(updateTrayColorSpy).toHaveBeenCalledWith(5, true, true, false);
      expect(updateTrayTitleSpy).toHaveBeenCalledTimes(1);
      expect(updateTrayTitleSpy).toHaveBeenCalledWith('5+');
    });

    it('should update tray color and empty title when showNotificationsCountInTray is false and has notifications', () => {
      useSettingsStore.setState({ showNotificationsCountInTray: false });
      useNotificationsStore.setState({ notificationCount: 5 });

      setTrayIconColorAndTitle();

      expect(updateTrayColorSpy).toHaveBeenCalledTimes(1);
      expect(updateTrayColorSpy).toHaveBeenCalledWith(5, true, true, false);
      expect(updateTrayTitleSpy).toHaveBeenCalledTimes(1);
      expect(updateTrayTitleSpy).toHaveBeenCalledWith('');
    });

    it('should update tray color and empty title when offline and has notifications', () => {
      useNotificationsStore.setState({ notificationCount: 5, isOnline: false });

      setTrayIconColorAndTitle();

      expect(updateTrayColorSpy).toHaveBeenCalledTimes(1);
      expect(updateTrayColorSpy).toHaveBeenCalledWith(5, false, true, false);
      expect(updateTrayTitleSpy).toHaveBeenCalledTimes(1);
      expect(updateTrayTitleSpy).toHaveBeenCalledWith('');
    });

    it('should update tray with empty title when no notifications', () => {
      setTrayIconColorAndTitle();

      expect(updateTrayColorSpy).toHaveBeenCalledTimes(1);
      expect(updateTrayColorSpy).toHaveBeenCalledWith(0, true, true, false);
      expect(updateTrayTitleSpy).toHaveBeenCalledTimes(1);
      expect(updateTrayTitleSpy).toHaveBeenCalledWith('');
    });

    it('should use icon settings from store when updating tray color', () => {
      useSettingsStore.setState({
        useUnreadActiveIcon: false,
        useAlternateIdleIcon: true,
      });
      useNotificationsStore.setState({ notificationCount: 5 });

      setTrayIconColorAndTitle();

      expect(updateTrayColorSpy).toHaveBeenCalledWith(5, true, false, true);
    });

    it('should pass -1 to updateTrayColor and empty title when isError is true', () => {
      useNotificationsStore.setState({ isError: true });

      setTrayIconColorAndTitle();

      expect(updateTrayColorSpy).toHaveBeenCalledWith(-1, true, true, false);
      expect(updateTrayTitleSpy).toHaveBeenCalledWith('');
    });
  });
});
