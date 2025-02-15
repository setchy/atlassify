import {
  mockAccountNotifications,
  mockAtlassifyNotifications,
  mockSingleAccountNotifications,
  mockSingleAtlassifyNotification,
} from '../../__mocks__/notifications';
import { mockAuth } from '../../__mocks__/state';
import { defaultSettings } from '../../context/App';
import type { SettingsState } from '../../types';
import * as comms from '../comms';
import * as links from '../links';
import * as native from './native';

describe('renderer/utils/notifications/native.ts', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('triggerNativeNotifications', () => {
    it.skip('should raise a native notification (settings - on)', () => {
      const settings: SettingsState = {
        ...defaultSettings,
        playSoundNewNotifications: true,
        showSystemNotifications: true,
      };

      vi.spyOn(native, 'raiseNativeNotification');
      vi.spyOn(native, 'raiseSoundNotification');

      native.triggerNativeNotifications([], mockAccountNotifications, {
        auth: mockAuth,
        settings,
      });

      expect(native.raiseNativeNotification).toHaveBeenCalledTimes(1);
      expect(native.raiseSoundNotification).toHaveBeenCalledTimes(1);
    });

    it('should not raise a native notification (settings - off)', () => {
      const settings = {
        ...defaultSettings,
        playSoundNewNotifications: false,
        showSystemNotifications: false,
      };

      vi.spyOn(native, 'raiseNativeNotification');
      vi.spyOn(native, 'raiseSoundNotification');

      native.triggerNativeNotifications([], mockAccountNotifications, {
        auth: mockAuth,
        settings,
      });

      expect(native.raiseNativeNotification).not.toHaveBeenCalled();
      expect(native.raiseSoundNotification).not.toHaveBeenCalled();
    });

    it('should not raise a native notification or play a sound (no new notifications)', () => {
      const settings = {
        ...defaultSettings,
        playSound: true,
        showNotifications: true,
      };

      vi.spyOn(native, 'raiseNativeNotification');
      vi.spyOn(native, 'raiseSoundNotification');

      native.triggerNativeNotifications(
        mockSingleAccountNotifications,
        mockSingleAccountNotifications,
        { auth: mockAuth, settings },
      );

      expect(native.raiseNativeNotification).not.toHaveBeenCalled();
      expect(native.raiseSoundNotification).not.toHaveBeenCalled();
    });
  });

  it('should not raise a native notification (because of 0(zero) notifications)', () => {
    const settings = {
      ...defaultSettings,
      playSound: true,
      showNotifications: true,
    };

    vi.spyOn(native, 'raiseNativeNotification');
    vi.spyOn(native, 'raiseSoundNotification');

    native.triggerNativeNotifications([], [], {
      auth: mockAuth,
      settings,
    });
    native.triggerNativeNotifications([], [], {
      auth: mockAuth,
      settings,
    });

    expect(native.raiseNativeNotification).not.toHaveBeenCalled();
    expect(native.raiseSoundNotification).not.toHaveBeenCalled();
  });

  describe('raiseNativeNotification', () => {
    it('should click on a native notification (with 1 notification)', () => {
      const hideWindowMock = vi.spyOn(comms, 'hideWindow');
      vi.spyOn(links, 'openNotification');

      const nativeNotification: Notification = native.raiseNativeNotification([
        mockSingleAtlassifyNotification,
      ]);
      nativeNotification.onclick(null);

      expect(links.openNotification).toHaveBeenCalledTimes(1);
      expect(links.openNotification).toHaveBeenLastCalledWith(
        mockSingleAtlassifyNotification,
      );
      expect(hideWindowMock).toHaveBeenCalledTimes(1);
    });

    it('should click on a native notification (with more than 1 notification)', () => {
      const showWindowMock = vi.spyOn(comms, 'showWindow');

      const nativeNotification = native.raiseNativeNotification(
        mockAtlassifyNotifications,
      );
      nativeNotification.onclick(null);

      expect(showWindowMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('raiseSoundNotification', () => {
    it('should play a sound', () => {
      vi.spyOn(window.Audio.prototype, 'play');
      native.raiseSoundNotification();
      expect(window.Audio.prototype.play).toHaveBeenCalledTimes(1);
    });
  });
});
