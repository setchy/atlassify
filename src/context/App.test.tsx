import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { useContext } from 'react';
import { mockAuth, mockSettings } from '../__mocks__/state-mocks';
import { useNotifications } from '../hooks/useNotifications';
import type { AuthState, SettingsState } from '../types';
import { mockSingleNotification } from '../utils/api/__mocks__/response-mocks';
import * as apiRequests from '../utils/api/request';
import * as comms from '../utils/comms';
import { Constants } from '../utils/constants';
import * as notifications from '../utils/notifications';
import * as storage from '../utils/storage';
import { AppContext, AppProvider, defaultSettings } from './App';

jest.mock('../hooks/useNotifications');

const customRender = (
  ui,
  auth: AuthState = mockAuth,
  settings: SettingsState = mockSettings,
) => {
  return render(
    <AppContext.Provider value={{ auth, settings }}>
      <AppProvider>{ui}</AppProvider>
    </AppContext.Provider>,
  );
};

describe('context/App.tsx', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  describe('notification methods', () => {
    const getNotificationCountMock = jest.spyOn(
      notifications,
      'getNotificationCount',
    );
    getNotificationCountMock.mockReturnValue(1);

    const fetchNotificationsMock = jest.fn();
    const markNotificationReadMock = jest.fn();
    const markNotificationDoneMock = jest.fn();
    const unsubscribeNotificationMock = jest.fn();
    const markProductNotificationsReadMock = jest.fn();
    const markProductNotificationsUnreadMock = jest.fn();

    const mockDefaultState = {
      auth: { accounts: [], enterpriseAccounts: [], token: null, user: null },
      settings: mockSettings,
    };

    beforeEach(() => {
      (useNotifications as jest.Mock).mockReturnValue({
        fetchNotifications: fetchNotificationsMock,
        markNotificationRead: markNotificationReadMock,
        markNotificationDone: markNotificationDoneMock,
        unsubscribeNotification: unsubscribeNotificationMock,
        markProductNotificationsRead: markProductNotificationsReadMock,
        markProductNotificationsUnread: markProductNotificationsUnreadMock,
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('fetch notifications every minute', async () => {
      customRender(null);

      // Wait for the useEffects, for settings.participating and accounts, to run.
      // Those aren't what we're testing
      await waitFor(() =>
        expect(fetchNotificationsMock).toHaveBeenCalledTimes(1),
      );

      act(() => {
        jest.advanceTimersByTime(Constants.FETCH_NOTIFICATIONS_INTERVAL);
        return;
      });
      expect(fetchNotificationsMock).toHaveBeenCalledTimes(2);

      act(() => {
        jest.advanceTimersByTime(Constants.FETCH_NOTIFICATIONS_INTERVAL);
        return;
      });
      expect(fetchNotificationsMock).toHaveBeenCalledTimes(3);

      act(() => {
        jest.advanceTimersByTime(Constants.FETCH_NOTIFICATIONS_INTERVAL);
        return;
      });
      expect(fetchNotificationsMock).toHaveBeenCalledTimes(4);
    });

    it('should call fetchNotifications', async () => {
      const TestComponent = () => {
        const { fetchNotifications } = useContext(AppContext);

        return (
          <button type="button" onClick={fetchNotifications}>
            Test Case
          </button>
        );
      };

      const { getByText } = customRender(<TestComponent />);

      fetchNotificationsMock.mockReset();

      fireEvent.click(getByText('Test Case'));

      expect(fetchNotificationsMock).toHaveBeenCalledTimes(1);
    });

    it('should call markNotificationRead', async () => {
      const TestComponent = () => {
        const { markNotificationRead } = useContext(AppContext);

        return (
          <button
            type="button"
            onClick={() => markNotificationRead(mockSingleNotification)}
          >
            Test Case
          </button>
        );
      };

      const { getByText } = customRender(<TestComponent />);

      fireEvent.click(getByText('Test Case'));

      expect(markNotificationReadMock).toHaveBeenCalledTimes(1);
      expect(markNotificationReadMock).toHaveBeenCalledWith(
        mockDefaultState,
        mockSingleNotification,
      );
    });

    it('should call markProductNotificationsRead', async () => {
      const TestComponent = () => {
        const { markProductNotificationsRead } = useContext(AppContext);

        return (
          <button
            type="button"
            onClick={() => markProductNotificationsRead(mockSingleNotification)}
          >
            Test Case
          </button>
        );
      };

      const { getByText } = customRender(<TestComponent />);

      fireEvent.click(getByText('Test Case'));

      expect(markProductNotificationsReadMock).toHaveBeenCalledTimes(1);
      expect(markProductNotificationsReadMock).toHaveBeenCalledWith(
        mockDefaultState,
        mockSingleNotification,
      );
    });

    it('should call markProductNotificationsUnread', async () => {
      const TestComponent = () => {
        const { markProductNotificationsUnread } = useContext(AppContext);

        return (
          <button
            type="button"
            onClick={() =>
              markProductNotificationsUnread(mockSingleNotification)
            }
          >
            Test Case
          </button>
        );
      };

      const { getByText } = customRender(<TestComponent />);

      fireEvent.click(getByText('Test Case'));

      expect(markProductNotificationsUnreadMock).toHaveBeenCalledTimes(1);
      expect(markProductNotificationsUnreadMock).toHaveBeenCalledWith(
        mockDefaultState,
        mockSingleNotification,
      );
    });
  });

  describe('authentication methods', () => {
    const apiRequestAuthMock = jest.spyOn(apiRequests, 'apiRequestAuth');
    const fetchNotificationsMock = jest.fn();

    beforeEach(() => {
      (useNotifications as jest.Mock).mockReturnValue({
        fetchNotifications: fetchNotificationsMock,
      });
    });

    it('should call loginWithAPIToken', async () => {
      apiRequestAuthMock.mockResolvedValueOnce(null);

      // const TestComponent = () => {
      //   const { loginWithPersonalAccessToken } = useContext(AppContext);

      //   return (
      //     <button
      //       type="button"
      //       onClick={() =>
      //         loginWithPersonalAccessToken({
      //           hostname: 'github.com' as Hostname,
      //           token: '123-456' as Token,
      //         })
      //       }
      //     >
      //       Test Case
      //     </button>
      //   );
      // };

      // const { getByText } = customRender(<TestComponent />);

      // fireEvent.click(getByText('Test Case'));

      // await waitFor(() =>
      //   expect(fetchNotificationsMock).toHaveBeenCalledTimes(1),
      // );

      // expect(apiRequestAuthMock).toHaveBeenCalledTimes(2);
      // expect(apiRequestAuthMock).toHaveBeenCalledWith(
      //   'https://api.github.com/notifications',
      //   'HEAD',
      //   '123-456',
      // );
      // expect(apiRequestAuthMock).toHaveBeenCalledWith(
      //   'https://api.github.com/user',
      //   'GET',
      //   '123-456',
      // );
    });
  });

  describe('settings methods', () => {
    const fetchNotificationsMock = jest.fn();

    beforeEach(() => {
      (useNotifications as jest.Mock).mockReturnValue({
        fetchNotifications: fetchNotificationsMock,
      });
    });

    it('should call updateSetting', async () => {
      const saveStateMock = jest
        .spyOn(storage, 'saveState')
        .mockImplementation(jest.fn());

      const TestComponent = () => {
        const { updateSetting } = useContext(AppContext);

        return (
          <button
            type="button"
            onClick={() => updateSetting('playSound', true)}
          >
            Test Case
          </button>
        );
      };

      const { getByText } = customRender(<TestComponent />);

      act(() => {
        fireEvent.click(getByText('Test Case'));
      });

      expect(saveStateMock).toHaveBeenCalledWith({
        auth: {
          accounts: [],
          enterpriseAccounts: [],
          token: null,
          user: null,
        } as AuthState,
        settings: {
          ...defaultSettings,
          playSound: true,
        } as SettingsState,
      });
    });

    it('should call updateSetting and set auto launch(openAtStartup)', async () => {
      const setAutoLaunchMock = jest.spyOn(comms, 'setAutoLaunch');
      const saveStateMock = jest
        .spyOn(storage, 'saveState')
        .mockImplementation(jest.fn());

      const TestComponent = () => {
        const { updateSetting } = useContext(AppContext);

        return (
          <button
            type="button"
            onClick={() => updateSetting('openAtStartup', true)}
          >
            Test Case
          </button>
        );
      };

      const { getByText } = customRender(<TestComponent />);

      act(() => {
        fireEvent.click(getByText('Test Case'));
      });

      expect(setAutoLaunchMock).toHaveBeenCalledWith(true);

      expect(saveStateMock).toHaveBeenCalledWith({
        auth: {
          accounts: [],
          enterpriseAccounts: [],
          token: null,
          user: null,
        } as AuthState,
        settings: {
          ...defaultSettings,
          openAtStartup: true,
        } as SettingsState,
      });
    });

    it('should clear filters back to default', async () => {
      const saveStateMock = jest
        .spyOn(storage, 'saveState')
        .mockImplementation(jest.fn());

      const TestComponent = () => {
        const { clearFilters } = useContext(AppContext);

        return (
          <button type="button" onClick={() => clearFilters()}>
            Test Case
          </button>
        );
      };

      const { getByText } = customRender(<TestComponent />);

      act(() => {
        fireEvent.click(getByText('Test Case'));
      });

      expect(saveStateMock).toHaveBeenCalledWith({
        auth: {
          accounts: [],
          enterpriseAccounts: [],
          token: null,
          user: null,
        } as AuthState,
        settings: {
          ...mockSettings,
          filterCategories: defaultSettings.filterCategories,
          filterReadStates: defaultSettings.filterReadStates,
          filterProducts: defaultSettings.filterProducts,
        },
      });
    });

    it('should call resetSettings', async () => {
      const saveStateMock = jest
        .spyOn(storage, 'saveState')
        .mockImplementation(jest.fn());

      const TestComponent = () => {
        const { resetSettings } = useContext(AppContext);

        return (
          <button type="button" onClick={() => resetSettings()}>
            Test Case
          </button>
        );
      };

      const { getByText } = customRender(<TestComponent />);

      act(() => {
        fireEvent.click(getByText('Test Case'));
      });

      expect(saveStateMock).toHaveBeenCalledWith({
        auth: {
          accounts: [],
          enterpriseAccounts: [],
          token: null,
          user: null,
        } as AuthState,
        settings: defaultSettings,
      });
    });
  });
});
