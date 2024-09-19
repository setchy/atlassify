import {
  mockAccountNotifications,
  mockSingleAccountNotifications,
} from '../../__mocks__/notifications-mocks';
import { mockAuth } from '../../__mocks__/state-mocks';
import { defaultSettings } from '../../context/App';
import type { SettingsState } from '../../types';
import { mockAtlassifyNotification } from '../api/__mocks__/response-mocks';
import * as comms from '../comms';
import * as links from '../links';
import * as notificationsHelpers from './native';

describe('utils/notifications/native.ts', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should raise a system notification (settings - on)', () => {
    const settings: SettingsState = {
      ...defaultSettings,
      playSoundNewNotifications: true,
      showSystemNotifications: true,
    };

    jest.spyOn(notificationsHelpers, 'raiseNativeNotification');
    jest.spyOn(notificationsHelpers, 'raiseSoundNotification');

    notificationsHelpers.triggerNativeNotifications(
      [],
      mockAccountNotifications,
      {
        auth: mockAuth,
        settings,
      },
    );

    expect(notificationsHelpers.raiseNativeNotification).toHaveBeenCalledTimes(
      1,
    );
    expect(notificationsHelpers.raiseSoundNotification).toHaveBeenCalledTimes(
      1,
    );
  });

  it('should not raise a system notification (settings - off)', () => {
    const settings = {
      ...defaultSettings,
      playSoundNewNotifications: false,
      showSystemNotifications: false,
    };

    jest.spyOn(notificationsHelpers, 'raiseNativeNotification');
    jest.spyOn(notificationsHelpers, 'raiseSoundNotification');

    notificationsHelpers.triggerNativeNotifications(
      [],
      mockAccountNotifications,
      {
        auth: mockAuth,
        settings,
      },
    );

    expect(notificationsHelpers.raiseNativeNotification).not.toHaveBeenCalled();
    expect(notificationsHelpers.raiseSoundNotification).not.toHaveBeenCalled();
  });

  it('should not raise a notification or play a sound (no new notifications)', () => {
    const settings = {
      ...defaultSettings,
      playSound: true,
      showNotifications: true,
    };

    jest.spyOn(notificationsHelpers, 'raiseNativeNotification');
    jest.spyOn(notificationsHelpers, 'raiseSoundNotification');

    notificationsHelpers.triggerNativeNotifications(
      mockSingleAccountNotifications,
      mockSingleAccountNotifications,
      { auth: mockAuth, settings },
    );

    expect(notificationsHelpers.raiseNativeNotification).not.toHaveBeenCalled();
    expect(notificationsHelpers.raiseSoundNotification).not.toHaveBeenCalled();
  });

  it('should not raise a notification (because of 0(zero) notifications)', () => {
    const settings = {
      ...defaultSettings,
      playSound: true,
      showNotifications: true,
    };

    jest.spyOn(notificationsHelpers, 'raiseNativeNotification');
    jest.spyOn(notificationsHelpers, 'raiseSoundNotification');

    notificationsHelpers.triggerNativeNotifications([], [], {
      auth: mockAuth,
      settings,
    });
    notificationsHelpers.triggerNativeNotifications([], [], {
      auth: mockAuth,
      settings,
    });

    expect(notificationsHelpers.raiseNativeNotification).not.toHaveBeenCalled();
    expect(notificationsHelpers.raiseSoundNotification).not.toHaveBeenCalled();
  });

  it('should click on a native notification (with 1 notification)', () => {
    const hideWindowMock = jest.spyOn(comms, 'hideWindow');
    jest.spyOn(links, 'openNotification');

    const nativeNotification: Notification =
      notificationsHelpers.raiseNativeNotification([
        mockAtlassifyNotification[0],
      ]);
    nativeNotification.onclick(null);

    expect(links.openNotification).toHaveBeenCalledTimes(1);
    expect(links.openNotification).toHaveBeenLastCalledWith(
      mockAtlassifyNotification[0],
    );
    expect(hideWindowMock).toHaveBeenCalledTimes(1);
  });

  it('should click on a native notification (with more than 1 notification)', () => {
    const showWindowMock = jest.spyOn(comms, 'showWindow');

    const nativeNotification = notificationsHelpers.raiseNativeNotification(
      mockAtlassifyNotification,
    );
    nativeNotification.onclick(null);

    expect(showWindowMock).toHaveBeenCalledTimes(1);
  });

  it('should play a sound', () => {
    jest.spyOn(window.Audio.prototype, 'play');
    notificationsHelpers.raiseSoundNotification();
    expect(window.Audio.prototype.play).toHaveBeenCalledTimes(1);
  });
});
