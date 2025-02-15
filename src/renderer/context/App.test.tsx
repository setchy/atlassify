import { act, fireEvent, render, waitFor } from '@testing-library/react';
import type { AxiosPromise, AxiosResponse } from 'axios';
import { useContext } from 'react';

import { mockSingleAtlassifyNotification } from '../__mocks__/notifications';
import { mockAuth, mockSettings } from '../__mocks__/state';
import { useNotifications } from '../hooks/useNotifications';
import type { AuthState, SettingsState, Token, Username } from '../types';
import * as apiRequests from '../utils/api/request';
import * as comms from '../utils/comms';
import { Constants } from '../utils/constants';
import * as notifications from '../utils/notifications/notifications';
import * as storage from '../utils/storage';
import { AppContext, AppProvider, defaultSettings } from './App';

vi.mock('../hooks/useNotifications');

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

describe('renderer/context/App.tsx', () => {
  const saveStateMock = vi
    .spyOn(storage, 'saveState')
    .mockImplementation(vi.fn());

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.clearAllMocks();
  });

  describe('notification methods', () => {
    const getNotificationCountMock = vi.spyOn(
      notifications,
      'getNotificationCount',
    );
    getNotificationCountMock.mockReturnValue(1);

    const fetchNotificationsMock = vi.fn();
    const markNotificationsReadMock = vi.fn();
    const markNotificationsUnreadMock = vi.fn();

    const mockDefaultState = {
      auth: { accounts: [] },
      settings: mockSettings,
    };

    beforeEach(() => {
      (useNotifications as vi.Mock).mockReturnValue({
        fetchNotifications: fetchNotificationsMock,
        markNotificationsRead: markNotificationsReadMock,
        markNotificationsUnread: markNotificationsUnreadMock,
      });
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it.skip('fetch notifications every minute', async () => {
      vi.useFakeTimers();

      customRender(null);

      await waitFor(() =>
        expect(fetchNotificationsMock).toHaveBeenCalledTimes(1),
      );

      act(() => {
        vi.advanceTimersByTime(Constants.FETCH_NOTIFICATIONS_INTERVAL);
      });
      expect(fetchNotificationsMock).toHaveBeenCalledTimes(2);

      act(() => {
        vi.advanceTimersByTime(Constants.FETCH_NOTIFICATIONS_INTERVAL);
      });
      expect(fetchNotificationsMock).toHaveBeenCalledTimes(3);

      act(() => {
        vi.advanceTimersByTime(Constants.FETCH_NOTIFICATIONS_INTERVAL);
      });
      expect(fetchNotificationsMock).toHaveBeenCalledTimes(4);

      vi.useRealTimers();
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
    const apiRequestMock = vi.spyOn(apiRequests, 'performPostRequest');
    const fetchNotificationsMock = vi.fn();

    beforeEach(() => {
      (useNotifications as vi.Mock).mockReturnValue({
        fetchNotifications: fetchNotificationsMock,
      });
    });

    it('should call login', async () => {
      const requestPromise = new Promise((resolve) =>
        resolve({
          data: {
            data: {
              me: {
                user: {
                  accountId: '123',
                  name: 'Atlassify',
                  picture: 'https://avatar.atlassify.io',
                },
              },
            },
          },
        } as AxiosResponse),
      ) as AxiosPromise;

      apiRequestMock.mockResolvedValueOnce(requestPromise);

      const TestComponent = () => {
        const { login } = useContext(AppContext);

        return (
          <button
            type="button"
            onClick={() =>
              login({
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

      // expect(apiRequestMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('settings methods', () => {
    const fetchNotificationsMock = vi.fn();

    beforeEach(() => {
      (useNotifications as vi.Mock).mockReturnValue({
        fetchNotifications: fetchNotificationsMock,
      });
    });

    it('should call updateSetting and set playSoundNewNotifications', async () => {
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
      const setAutoLaunchMock = vi.spyOn(comms, 'setAutoLaunch');

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

    it('should call updateSetting and set useAlternateIdleIcon', async () => {
      const setAlternateIdleIconMock = vi.spyOn(comms, 'setAlternateIdleIcon');

      const TestComponent = () => {
        const { updateSetting } = useContext(AppContext);

        return (
          <button
            type="button"
            onClick={() => updateSetting('useAlternateIdleIcon', true)}
          >
            Test Case
          </button>
        );
      };

      const { getByText } = customRender(<TestComponent />);

      act(() => {
        fireEvent.click(getByText('Test Case'));
      });

      expect(setAlternateIdleIconMock).toHaveBeenCalledWith(true);

      expect(saveStateMock).toHaveBeenCalledWith({
        auth: {
          accounts: [],
        } as AuthState,
        settings: {
          ...defaultSettings,
          useAlternateIdleIcon: true,
        } as SettingsState,
      });
    });

    it('should call resetSettings', async () => {
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

  describe('filter methods', () => {
    it('should update filter - checked', async () => {
      const TestComponent = () => {
        const { updateFilter } = useContext(AppContext);

        return (
          <button
            type="button"
            onClick={() => updateFilter('filterCategories', 'direct', true)}
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
          ...mockSettings,
          filterCategories: ['direct'],
        },
      });
    });

    it('should update filter - unchecked', async () => {
      const TestComponent = () => {
        const { updateFilter } = useContext(AppContext);

        return (
          <button
            type="button"
            onClick={() => updateFilter('filterCategories', 'direct', false)}
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
          ...mockSettings,
          filterCategories: [],
        },
      });
    });

    it('should clear filters back to default', async () => {
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
          filterTimeSensitive: defaultSettings.filterTimeSensitive,
          filterCategories: defaultSettings.filterCategories,
          filterReadStates: defaultSettings.filterReadStates,
          filterProducts: defaultSettings.filterProducts,
        },
      });
    });
  });
});
