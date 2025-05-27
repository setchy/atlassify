import {
  mockAccountNotifications,
  mockSingleAccountNotifications,
} from '../../__mocks__/notifications-mocks';
import { mockAuth } from '../../__mocks__/state-mocks';
import { defaultSettings } from '../../context/App';
import type { SettingsState } from '../../types';
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

      native.triggerNativeNotifications([], mockAccountNotifications, {
        auth: mockAuth,
        settings,
      });
      expect(window.atlassify.raiseNativeNotification).toHaveBeenCalledTimes(1);
      expect(window.atlassify.notificationSoundPath).toHaveBeenCalledTimes(1);
    });

    it('should not raise a native notification (settings - off)', () => {
      const settings = {
        ...defaultSettings,
        playSoundNewNotifications: false,
        showSystemNotifications: false,
      };

      native.triggerNativeNotifications([], mockAccountNotifications, {
        auth: mockAuth,
        settings,
      });
      expect(window.atlassify.raiseNativeNotification).not.toHaveBeenCalled();
      expect(window.atlassify.notificationSoundPath).not.toHaveBeenCalled();
    });

    it('should not raise a native notification or play a sound (no new notifications)', () => {
      const settings = {
        ...defaultSettings,
        playSound: true,
        showNotifications: true,
      };

      native.triggerNativeNotifications(
        mockSingleAccountNotifications,
        mockSingleAccountNotifications,
        { auth: mockAuth, settings },
      );
      expect(window.atlassify.raiseNativeNotification).not.toHaveBeenCalled();
      expect(window.atlassify.notificationSoundPath).not.toHaveBeenCalled();
    });
  });

  it('should not raise a native notification (because of 0(zero) notifications)', () => {
    const settings = {
      ...defaultSettings,
      playSound: true,
      showNotifications: true,
    };

    native.triggerNativeNotifications([], [], {
      auth: mockAuth,
      settings,
    });
    expect(window.atlassify.raiseNativeNotification).not.toHaveBeenCalled();
    expect(window.atlassify.notificationSoundPath).not.toHaveBeenCalled();
  });

  describe('raiseSoundNotification', () => {
    it('should play notification sound with correct volume', () => {
      const settings: SettingsState = {
        ...defaultSettings,
        playSoundNewNotifications: true,
        showSystemNotifications: false,
        notificationVolume: 80,
      };

      const raiseSoundNotificationMock = jest.spyOn(
        native,
        'raiseSoundNotification',
      );
      jest.spyOn(native, 'raiseNativeNotification');

      native.triggerNativeNotifications([], mockAccountNotifications, {
        auth: mockAuth,
        settings,
      });

      expect(raiseSoundNotificationMock).toHaveBeenCalledWith(0.8);
      expect(native.raiseNativeNotification).not.toHaveBeenCalled();
    });
  });
});
