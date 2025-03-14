import {
  mockAccountNotifications,
  mockSingleAccountNotifications,
} from '../../__mocks__/notifications-mocks';
import { mockAuth } from '../../__mocks__/state-mocks';
import { defaultSettings } from '../../context/App';
import type { SettingsState } from '../../types';
// import * as comms from '../comms';
// import * as links from '../links';
import * as native from './native';

describe('renderer/utils/notifications/native.ts', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('triggerNativeNotifications', () => {
    it('should raise a native notification (settings - on)', () => {
      const settings: SettingsState = {
        ...defaultSettings,
        playSoundNewNotifications: true,
        showSystemNotifications: true,
      };

      jest.spyOn(native, 'raiseNativeNotification');
      jest.spyOn(window.atlassify, 'notificationSoundPath');

      native.triggerNativeNotifications([], mockAccountNotifications, {
        auth: mockAuth,
        settings,
      });

      expect(native.raiseNativeNotification).toHaveBeenCalledTimes(1);
      expect(window.atlassify.notificationSoundPath).toHaveBeenCalledTimes(1);
    });

    it('should not raise a native notification (settings - off)', () => {
      const settings = {
        ...defaultSettings,
        playSoundNewNotifications: false,
        showSystemNotifications: false,
      };

      jest.spyOn(native, 'raiseNativeNotification');
      jest.spyOn(window.atlassify, 'notificationSoundPath');

      native.triggerNativeNotifications([], mockAccountNotifications, {
        auth: mockAuth,
        settings,
      });

      expect(native.raiseNativeNotification).not.toHaveBeenCalled();
      expect(window.atlassify.notificationSoundPath).not.toHaveBeenCalled();
    });

    it('should not raise a native notification or play a sound (no new notifications)', () => {
      const settings = {
        ...defaultSettings,
        playSound: true,
        showNotifications: true,
      };

      jest.spyOn(native, 'raiseNativeNotification');
      jest.spyOn(window.atlassify, 'notificationSoundPath');

      native.triggerNativeNotifications(
        mockSingleAccountNotifications,
        mockSingleAccountNotifications,
        { auth: mockAuth, settings },
      );

      expect(native.raiseNativeNotification).not.toHaveBeenCalled();
      expect(window.atlassify.notificationSoundPath).not.toHaveBeenCalled();
    });
  });

  it('should not raise a native notification (because of 0(zero) notifications)', () => {
    const settings = {
      ...defaultSettings,
      playSound: true,
      showNotifications: true,
    };

    jest.spyOn(native, 'raiseNativeNotification');
    jest.spyOn(window.atlassify, 'notificationSoundPath');

    native.triggerNativeNotifications([], [], {
      auth: mockAuth,
      settings,
    });
    native.triggerNativeNotifications([], [], {
      auth: mockAuth,
      settings,
    });

    expect(native.raiseNativeNotification).not.toHaveBeenCalled();
    expect(window.atlassify.notificationSoundPath).not.toHaveBeenCalled();
  });

  // describe('raiseNativeNotification', () => {
  //   it('should click on a native notification (with 1 notification)', () => {
  //     const hideWindowMock = jest.spyOn(comms, 'hideWindow');
  //     jest.spyOn(links, 'openNotification');

  //     const nativeNotification: Notification = native.raiseNativeNotification([
  //       mockSingleAtlassifyNotification,
  //     ]);
  //     nativeNotification.onclick(null);

  //     expect(links.openNotification).toHaveBeenCalledTimes(1);
  //     expect(links.openNotification).toHaveBeenLastCalledWith(
  //       mockSingleAtlassifyNotification,
  //     );
  //     expect(hideWindowMock).toHaveBeenCalledTimes(1);
  //   });

  //   it('should click on a native notification (with more than 1 notification)', () => {
  //     const showWindowMock = jest.spyOn(comms, 'showWindow');

  //     const nativeNotification = native.raiseNativeNotification(
  //       mockAtlassifyNotifications,
  //     );
  //     nativeNotification.onclick(null);

  //     expect(showWindowMock).toHaveBeenCalledTimes(1);
  //   });
  // });
});
