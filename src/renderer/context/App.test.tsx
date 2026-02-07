import { act } from '@testing-library/react';

import { vi } from 'vitest';

import { renderWithAppContext } from '../__helpers__/test-utils';
import { mockAtlassianCloudAccount } from '../__mocks__/account-mocks';
import { mockSingleAtlassifyNotification } from '../__mocks__/notifications-mocks';
import { mockSettings } from '../__mocks__/state-mocks';

import { Constants } from '../constants';

import { useAppContext } from '../hooks/useAppContext';
import { useNotifications } from '../hooks/useNotifications';

import type { AuthState, SettingsState } from '../types';

import * as authUtils from '../utils/auth/utils';
import * as notifications from '../utils/notifications/notifications';
import * as storage from '../utils/storage';
import { type AppContextState, AppProvider } from './App';
import { defaultSettings } from './defaults';

vi.mock('../hooks/useNotifications');

// Helper to render the context
const renderWithContext = () => {
  let context!: AppContextState;

  const CaptureContext = () => {
    context = useAppContext();
    return null;
  };

  renderWithAppContext(
    <AppProvider>
      <CaptureContext />
    </AppProvider>,
  );

  return () => context;
};

describe('renderer/context/App.tsx', () => {
  const fetchNotificationsMock = vi.fn();
  const markNotificationsReadMock = vi.fn();
  const markNotificationsUnreadMock = vi.fn();
  const removeAccountNotificationsMock = vi.fn();

  const saveStateSpy = vi
    .spyOn(storage, 'saveState')
    .mockImplementation(vi.fn());

  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(useNotifications).mockReturnValue({
      fetchNotifications: fetchNotificationsMock,
      markNotificationsRead: markNotificationsReadMock,
      markNotificationsUnread: markNotificationsUnreadMock,
      removeAccountNotifications: removeAccountNotificationsMock,
    } as unknown as ReturnType<typeof useNotifications>);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.clearAllMocks();
  });

  describe('notification methods', () => {
    const getNotificationCountSpy = vi.spyOn(
      notifications,
      'getNotificationCount',
    );
    getNotificationCountSpy.mockReturnValue(1);

    const mockDefaultState = {
      auth: { accounts: [] },
      settings: mockSettings,
    };

    it('fetch notifications each interval', async () => {
      renderWithAppContext(<AppProvider>{null}</AppProvider>);

      // Initial fetch happens on mount - advance timers to ensure it runs
      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });

      expect(fetchNotificationsMock).toHaveBeenCalledTimes(1);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(
          Constants.FETCH_NOTIFICATIONS_INTERVAL_MS,
        );
      });
      expect(fetchNotificationsMock).toHaveBeenCalledTimes(2);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(
          Constants.FETCH_NOTIFICATIONS_INTERVAL_MS,
        );
      });
      expect(fetchNotificationsMock).toHaveBeenCalledTimes(3);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(
          Constants.FETCH_NOTIFICATIONS_INTERVAL_MS,
        );
      });
      expect(fetchNotificationsMock).toHaveBeenCalledTimes(4);
    });

    it('should call fetchNotifications', async () => {
      const getContext = renderWithContext();
      fetchNotificationsMock.mockReset();

      act(() => {
        getContext().fetchNotifications();
      });

      expect(fetchNotificationsMock).toHaveBeenCalledTimes(1);
    });

    it('should call markNotificationsRead', async () => {
      const getContext = renderWithContext();

      act(() => {
        getContext().markNotificationsRead([mockSingleAtlassifyNotification]);
      });

      expect(markNotificationsReadMock).toHaveBeenCalledTimes(1);
      expect(markNotificationsReadMock).toHaveBeenCalledWith(mockDefaultState, [
        mockSingleAtlassifyNotification,
      ]);
    });

    it('should call markNotificationsUnread', async () => {
      const getContext = renderWithContext();

      act(() => {
        getContext().markNotificationsUnread([mockSingleAtlassifyNotification]);
      });

      expect(markNotificationsUnreadMock).toHaveBeenCalledTimes(1);
      expect(markNotificationsUnreadMock).toHaveBeenCalledWith(
        mockDefaultState,
        [mockSingleAtlassifyNotification],
      );
    });
  });

  describe('settings methods', () => {
    it('should call updateSetting', async () => {
      const getContext = renderWithContext();

      act(() => {
        getContext().updateSetting('playSoundNewNotifications', true);
      });

      expect(saveStateSpy).toHaveBeenCalledWith({
        auth: {
          accounts: [],
        } as AuthState,
        settings: {
          ...defaultSettings,
          playSoundNewNotifications: true,
        } as SettingsState,
      });
    });

    it('should call resetSettings', async () => {
      const getContext = renderWithContext();

      act(() => {
        getContext().resetSettings();
      });

      expect(saveStateSpy).toHaveBeenCalledWith({
        auth: {
          accounts: [],
        } as AuthState,
        settings: defaultSettings,
      });
    });
  });

  describe('authentication methods', () => {
    const addAccountSpy = vi
      .spyOn(authUtils, 'addAccount')
      .mockResolvedValue({ accounts: [] } as AuthState);
    const removeAccountSpy = vi.spyOn(authUtils, 'removeAccount');

    it('login calls addAccount ', async () => {
      const getContext = renderWithContext();

      await act(async () => {
        getContext().login({
          username: mockAtlassianCloudAccount.username,
          token: mockAtlassianCloudAccount.token,
        });
      });

      expect(addAccountSpy).toHaveBeenCalledWith(
        expect.anything(),
        mockAtlassianCloudAccount.username,
        mockAtlassianCloudAccount.token,
      );
    });

    it('logout calls removeAccountNotifications and removeAccount ', async () => {
      const getContext = renderWithContext();

      await act(async () => {
        getContext().logoutFromAccount(mockAtlassianCloudAccount);
      });

      expect(removeAccountNotificationsMock).toHaveBeenCalledWith(
        mockAtlassianCloudAccount,
      );
      expect(removeAccountSpy).toHaveBeenCalledWith(
        expect.anything(),
        mockAtlassianCloudAccount,
      );
    });
  });
});
