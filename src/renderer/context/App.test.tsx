import { act } from '@testing-library/react';

import { vi } from 'vitest';

import { renderWithAppContext } from '../__helpers__/test-utils';
import { mockAtlassianCloudAccount } from '../__mocks__/account-mocks';
import { mockSingleAtlassifyNotification } from '../__mocks__/notifications-mocks';
import { mockSettings } from '../__mocks__/state-mocks';

import { useAppContext } from '../hooks/useAppContext';
import { useNotifications } from '../hooks/useNotifications';
import useAccountsStore from '../stores/useAccountsStore';
import useSettingsStore from '../stores/useSettingsStore';

import * as notifications from '../utils/notifications/notifications';
import { type AppContextState, AppProvider } from './App';

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
  const refetchNotificationsMock = vi.fn();
  const markNotificationsReadMock = vi.fn();
  const markNotificationsUnreadMock = vi.fn();

  beforeEach(() => {
    // Initialize stores with default values
    useAccountsStore.setState({ accounts: [] });
    useSettingsStore.setState(mockSettings);

    vi.useFakeTimers();
    vi.mocked(useNotifications).mockReturnValue({
      status: 'success',
      globalError: null,
      notifications: [],
      notificationCount: 0,
      hasNotifications: false,
      hasMoreAccountNotifications: false,
      refetchNotifications: refetchNotificationsMock,
      markNotificationsRead: markNotificationsReadMock,
      markNotificationsUnread: markNotificationsUnreadMock,
    } as ReturnType<typeof useNotifications>);
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

    it('should call fetchNotifications', async () => {
      const getContext = renderWithContext();
      refetchNotificationsMock.mockReset();

      await act(async () => {
        await getContext().fetchNotifications();
      });

      expect(refetchNotificationsMock).toHaveBeenCalledTimes(1);
    });

    it('should call markNotificationsRead', async () => {
      const getContext = renderWithContext();

      act(() => {
        getContext().markNotificationsRead([mockSingleAtlassifyNotification]);
      });

      expect(markNotificationsReadMock).toHaveBeenCalledTimes(1);
      expect(markNotificationsReadMock).toHaveBeenCalledWith([
        mockSingleAtlassifyNotification,
      ]);
    });

    it('should call markNotificationsUnread', async () => {
      const getContext = renderWithContext();

      act(() => {
        getContext().markNotificationsUnread([mockSingleAtlassifyNotification]);
      });

      expect(markNotificationsUnreadMock).toHaveBeenCalledTimes(1);
      expect(markNotificationsUnreadMock).toHaveBeenCalledWith([
        mockSingleAtlassifyNotification,
      ]);
    });
  });

  describe('authentication methods', () => {
    it('login calls createAccount', async () => {
      const createAccountSpy = vi.spyOn(
        useAccountsStore.getState(),
        'createAccount',
      );
      const getContext = renderWithContext();

      await act(async () => {
        await getContext().login({
          username: mockAtlassianCloudAccount.username,
          token: mockAtlassianCloudAccount.token,
        });
      });

      expect(createAccountSpy).toHaveBeenCalledWith(
        mockAtlassianCloudAccount.username,
        mockAtlassianCloudAccount.token,
      );
    });

    it('logout calls removeAccount', async () => {
      // Set up with an account
      useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });
      const removeAccountSpy = vi.spyOn(
        useAccountsStore.getState(),
        'removeAccount',
      );
      const getContext = renderWithContext();

      await act(async () => {
        await getContext().logoutFromAccount(mockAtlassianCloudAccount);
      });

      expect(removeAccountSpy).toHaveBeenCalledWith(mockAtlassianCloudAccount);
    });
  });
});
