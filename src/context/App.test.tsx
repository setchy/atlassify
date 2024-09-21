import { act, fireEvent, render, waitFor } from '@testing-library/react';
import type { AxiosPromise, AxiosResponse } from 'axios';
import { useContext } from 'react';
import { mockSingleAtlassifyNotification } from '../__mocks__/notifications-mocks';
import { mockAuth, mockSettings } from '../__mocks__/state-mocks';
import { useNotifications } from '../hooks/useNotifications';
import type { AuthState, SettingsState, Token, Username } from '../types';
import * as apiRequests from '../utils/api/request';
import * as comms from '../utils/comms';
import { Constants } from '../utils/constants';
import * as notifications from '../utils/notifications/notifications';
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
    const markNotificationsReadMock = jest.fn();
    const markNotificationsUnreadMock = jest.fn();

    const mockDefaultState = {
      auth: { accounts: [] },
      settings: mockSettings,
    };

    beforeEach(() => {
      (useNotifications as jest.Mock).mockReturnValue({
        fetchNotifications: fetchNotificationsMock,
        markNotificationsRead: markNotificationsReadMock,
        markNotificationsUnread: markNotificationsUnreadMock,
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
      });
      expect(fetchNotificationsMock).toHaveBeenCalledTimes(2);

      act(() => {
        jest.advanceTimersByTime(Constants.FETCH_NOTIFICATIONS_INTERVAL);
      });
      expect(fetchNotificationsMock).toHaveBeenCalledTimes(3);

      act(() => {
        jest.advanceTimersByTime(Constants.FETCH_NOTIFICATIONS_INTERVAL);
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

    it('should call markNotificationsRead', async () => {
      const TestComponent = () => {
        const { markNotificationsRead } = useContext(AppContext);

        return (
          <button
            type="button"
            onClick={() =>
              markNotificationsRead([mockSingleAtlassifyNotification])
            }
          >
            Test Case
          </button>
        );
      };

      const { getByText } = customRender(<TestComponent />);

      fireEvent.click(getByText('Test Case'));

      expect(markNotificationsReadMock).toHaveBeenCalledTimes(1);
      expect(markNotificationsReadMock).toHaveBeenCalledWith(mockDefaultState, [
        mockSingleAtlassifyNotification,
      ]);
    });

    it('should call markNotificationsUnread', async () => {
      const TestComponent = () => {
        const { markNotificationsUnread } = useContext(AppContext);

        return (
          <button
            type="button"
            onClick={() =>
              markNotificationsUnread([mockSingleAtlassifyNotification])
            }
          >
            Test Case
          </button>
        );
      };

      const { getByText } = customRender(<TestComponent />);

      fireEvent.click(getByText('Test Case'));

      expect(markNotificationsUnreadMock).toHaveBeenCalledTimes(1);
      expect(markNotificationsUnreadMock).toHaveBeenCalledWith(
        mockDefaultState,
        [mockSingleAtlassifyNotification],
      );
    });
  });

  describe('authentication methods', () => {
    const apiRequestMock = jest.spyOn(apiRequests, 'performPostRequest');
    const fetchNotificationsMock = jest.fn();

    beforeEach(() => {
      (useNotifications as jest.Mock).mockReturnValue({
        fetchNotifications: fetchNotificationsMock,
      });
    });

    it('should call loginWithAPIToken', async () => {
      const requestPromise = new Promise((resolve) =>
        resolve({
          data: {
            data: {
              me: {
                user: {
                  accountId: '123',
                  name: 'Atlassify',
                  picture: 'https://atlassify.io',
                },
              },
            },
          },
        } as AxiosResponse),
      ) as AxiosPromise;

      apiRequestMock.mockResolvedValueOnce(requestPromise);
      jest.spyOn(storage, 'saveState').mockImplementation(jest.fn());

      const TestComponent = () => {
        const { loginWithAPIToken } = useContext(AppContext);

        return (
          <button
            type="button"
            onClick={() =>
              loginWithAPIToken({
                username: 'atlassify' as Username,
                token: '123-456' as Token,
              })
            }
          >
            Test Case
          </button>
        );
      };

      const { getByText } = customRender(<TestComponent />);

      act(() => {
        fireEvent.click(getByText('Test Case'));
      });

      expect(apiRequestMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('settings methods', () => {
    const fetchNotificationsMock = jest.fn();

    beforeEach(() => {
      (useNotifications as jest.Mock).mockReturnValue({
        fetchNotifications: fetchNotificationsMock,
      });
    });

    it('should call updateSetting and set playSoundNewNotifications', async () => {
      const saveStateMock = jest
        .spyOn(storage, 'saveState')
        .mockImplementation(jest.fn());

      const TestComponent = () => {
        const { updateSetting } = useContext(AppContext);

        return (
          <button
            type="button"
            onClick={() => updateSetting('playSoundNewNotifications', true)}
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
        } as AuthState,
        settings: {
          ...defaultSettings,
          playSoundNewNotifications: true,
        } as SettingsState,
      });
    });

    it('should call updateSetting and set openAtStartup', async () => {
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
        } as AuthState,
        settings: defaultSettings,
      });
    });
  });
});
