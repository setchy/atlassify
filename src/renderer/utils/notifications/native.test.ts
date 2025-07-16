import {
  mockAccountNotifications,
  mockSingleAccountNotifications,
} from '../../__mocks__/notifications-mocks';
import { mockAuth } from '../../__mocks__/state-mocks';
import { defaultSettings } from '../../context/App';
import type { SettingsState } from '../../types';
import { formatProperCase } from '../helpers';
import * as native from './native';

const raiseSoundNotificationMock = jest.spyOn(native, 'raiseSoundNotification');

describe('renderer/utils/notifications/native.ts', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('triggerNativeNotifications', () => {
    it('should raise a native notification and play sound for a single new notification - with title', () => {
      const settings: SettingsState = {
        ...defaultSettings,
        playSoundNewNotifications: true,
        showSystemNotifications: true,
      };

      native.triggerNativeNotifications([], mockSingleAccountNotifications, {
        auth: mockAuth,
        settings,
      });

      expect(window.atlassify.raiseNativeNotification).toHaveBeenCalledTimes(1);
      expect(window.atlassify.raiseNativeNotification).toHaveBeenCalledWith(
        expect.stringContaining(mockSingleAccountNotifications[0].notifications[0].message),
        expect.stringContaining(mockSingleAccountNotifications[0].notifications[0].message),
        mockSingleAccountNotifications[0].notifications[0].url,
      );

      expect(raiseSoundNotificationMock).toHaveBeenCalledTimes(1);
      expect(raiseSoundNotificationMock).toHaveBeenCalledWith(0.2);
    });

    it('should raise a native notification and play sound for a single new notification - without title', () => {
      const settings: SettingsState = {
        ...defaultSettings,
        playSoundNewNotifications: true,
        showSystemNotifications: true,
      };
      
      mockSingleAccountNotifications[0].notifications[0].entity.title = null
      mockSingleAccountNotifications[0].notifications[0].product.name = 'team central (atlas)'

      native.triggerNativeNotifications([], mockSingleAccountNotifications, {
        auth: mockAuth,
        settings,
      });

      expect(window.atlassify.raiseNativeNotification).toHaveBeenCalledTimes(1);
       expect(window.atlassify.raiseNativeNotification).toHaveBeenCalledWith(
        expect.stringContaining(mockSingleAccountNotifications[0].notifications[0].message),
        expect.stringContaining(formatProperCase(mockSingleAccountNotifications[0].notifications[0].product.name)),
        mockSingleAccountNotifications[0].notifications[0].url,
      );

      expect(raiseSoundNotificationMock).toHaveBeenCalledTimes(1);
      expect(raiseSoundNotificationMock).toHaveBeenCalledWith(0.2);
    });

    it('should raise a native notification and play sound for multiple new notifications', () => {
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
      expect(window.atlassify.raiseNativeNotification).toHaveBeenCalledWith(
        'Atlassify',
        'You have 2 notifications',
        null,
      );

      expect(raiseSoundNotificationMock).toHaveBeenCalledTimes(1);
      expect(raiseSoundNotificationMock).toHaveBeenCalledWith(0.2);
    });

    it('should not raise a native notification or play a sound when there are no new notifications', () => {
      const settings: SettingsState = {
        ...defaultSettings,
        playSoundNewNotifications: true,
        showSystemNotifications: true,
      };

      native.triggerNativeNotifications(
        mockSingleAccountNotifications,
        mockSingleAccountNotifications,
        { auth: mockAuth, settings },
      );

      expect(window.atlassify.raiseNativeNotification).not.toHaveBeenCalled();
      expect(raiseSoundNotificationMock).not.toHaveBeenCalled();
    });

    it('should not raise a native notification or play a sound when there are zero notifications', () => {
      const settings: SettingsState = {
        ...defaultSettings,
        playSoundNewNotifications: true,
        showSystemNotifications: true,
      };

      native.triggerNativeNotifications([], [], {
        auth: mockAuth,
        settings,
      });

      expect(window.atlassify.raiseNativeNotification).not.toHaveBeenCalled();
      expect(raiseSoundNotificationMock).not.toHaveBeenCalled();
    });

    it('should not raise a native notification when setting disabled', () => {
      const settings: SettingsState = {
        ...defaultSettings,
        showSystemNotifications: false,
      };

      native.triggerNativeNotifications([], mockAccountNotifications, {
        auth: mockAuth,
        settings,
      });

      expect(window.atlassify.raiseNativeNotification).not.toHaveBeenCalled();
    });
  });
});
