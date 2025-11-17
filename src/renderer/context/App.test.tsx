import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { useContext } from 'react';

import { mockSingleAtlassifyNotification } from '../__mocks__/notifications-mocks';
import { mockAuth, mockSettings } from '../__mocks__/state-mocks';
import { Constants } from '../constants';
import { useNotifications } from '../hooks/useNotifications';
import type { AuthState, SettingsState } from '../types';
import * as comms from '../utils/comms';
import * as notifications from '../utils/notifications/notifications';
import * as storage from '../utils/storage';
import { AppContext, AppProvider } from './App';
import { defaultSettings } from './defaults';

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

describe('renderer/context/App.tsx', () => {
  const saveStateSpy = jest
    .spyOn(storage, 'saveState')
    .mockImplementation(jest.fn());

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  describe('notification methods', () => {
    const getNotificationCountSpy = jest.spyOn(
      notifications,
      'getNotificationCount',
    );
    getNotificationCountSpy.mockReturnValue(1);

    const mockFetchNotifications = jest.fn();
    const mockMarkNotificationsRead = jest.fn();
    const mockMarkNotificationsUnread = jest.fn();

    const mockDefaultState = {
      auth: { accounts: [] },
      settings: mockSettings,
    };

    beforeEach(() => {
      (useNotifications as jest.Mock).mockReturnValue({
        fetchNotifications: mockFetchNotifications,
        markNotificationsRead: mockMarkNotificationsRead,
        markNotificationsUnread: mockMarkNotificationsUnread,
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('fetch notifications every minute', async () => {
      customRender(null);

      await waitFor(() =>
        expect(mockFetchNotifications).toHaveBeenCalledTimes(1),
      );

      act(() => {
        jest.advanceTimersByTime(Constants.FETCH_NOTIFICATIONS_INTERVAL_MS);
      });
      expect(mockFetchNotifications).toHaveBeenCalledTimes(2);

      act(() => {
        jest.advanceTimersByTime(Constants.FETCH_NOTIFICATIONS_INTERVAL_MS);
      });
      expect(mockFetchNotifications).toHaveBeenCalledTimes(3);

      act(() => {
        jest.advanceTimersByTime(Constants.FETCH_NOTIFICATIONS_INTERVAL_MS);
      });
      expect(mockFetchNotifications).toHaveBeenCalledTimes(4);
    });

    it('should call fetchNotifications', async () => {
      const TestComponent = () => {
        const { fetchNotifications } = useContext(AppContext);

        return (
          <button onClick={fetchNotifications} type="button">
            Test Case
          </button>
        );
      };

      const { getByText } = customRender(<TestComponent />);

      mockFetchNotifications.mockReset();

      fireEvent.click(getByText('Test Case'));

      expect(mockFetchNotifications).toHaveBeenCalledTimes(1);
    });

    it('should call markNotificationsRead', async () => {
      const TestComponent = () => {
        const { markNotificationsRead } = useContext(AppContext);

        return (
          <button
            onClick={() =>
              markNotificationsRead([mockSingleAtlassifyNotification])
            }
            type="button"
          >
            Test Case
          </button>
        );
      };

      const { getByText } = customRender(<TestComponent />);

      fireEvent.click(getByText('Test Case'));

      expect(mockMarkNotificationsRead).toHaveBeenCalledTimes(1);
      expect(mockMarkNotificationsRead).toHaveBeenCalledWith(mockDefaultState, [
        mockSingleAtlassifyNotification,
      ]);
    });

    it('should call markNotificationsUnread', async () => {
      const TestComponent = () => {
        const { markNotificationsUnread } = useContext(AppContext);

        return (
          <button
            onClick={() =>
              markNotificationsUnread([mockSingleAtlassifyNotification])
            }
            type="button"
          >
            Test Case
          </button>
        );
      };

      const { getByText } = customRender(<TestComponent />);

      fireEvent.click(getByText('Test Case'));

      expect(mockMarkNotificationsUnread).toHaveBeenCalledTimes(1);
      expect(mockMarkNotificationsUnread).toHaveBeenCalledWith(
        mockDefaultState,
        [mockSingleAtlassifyNotification],
      );
    });
  });

  describe('settings methods', () => {
    const mockFetchNotifications = jest.fn();

    beforeEach(() => {
      (useNotifications as jest.Mock).mockReturnValue({
        fetchNotifications: mockFetchNotifications,
      });
    });

    it('should call updateSetting and set playSoundNewNotifications', async () => {
      const TestComponent = () => {
        const { updateSetting } = useContext(AppContext);

        return (
          <button
            onClick={() => updateSetting('playSoundNewNotifications', true)}
            type="button"
          >
            Test Case
          </button>
        );
      };

      const { getByText } = customRender(<TestComponent />);

      act(() => {
        fireEvent.click(getByText('Test Case'));
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

    it('should call updateSetting and set openAtStartup', async () => {
      const setAutoLaunchSpy = jest.spyOn(comms, 'setAutoLaunch');

      const TestComponent = () => {
        const { updateSetting } = useContext(AppContext);

        return (
          <button
            onClick={() => updateSetting('openAtStartup', true)}
            type="button"
          >
            Test Case
          </button>
        );
      };

      const { getByText } = customRender(<TestComponent />);

      act(() => {
        fireEvent.click(getByText('Test Case'));
      });

      expect(setAutoLaunchSpy).toHaveBeenCalledWith(true);

      expect(saveStateSpy).toHaveBeenCalledWith({
        auth: {
          accounts: [],
        } as AuthState,
        settings: {
          ...defaultSettings,
          openAtStartup: true,
        } as SettingsState,
      });
    });

    it('should call updateSetting and set useUnreadActiveIcon', async () => {
      const setUseUnreadActiveIconSpy = jest.spyOn(
        comms,
        'setUseUnreadActiveIcon',
      );

      const TestComponent = () => {
        const { updateSetting } = useContext(AppContext);

        return (
          <button
            onClick={() => updateSetting('useUnreadActiveIcon', true)}
            type="button"
          >
            Test Case
          </button>
        );
      };

      const { getByText } = customRender(<TestComponent />);

      act(() => {
        fireEvent.click(getByText('Test Case'));
      });

      expect(setUseUnreadActiveIconSpy).toHaveBeenCalledWith(true);

      expect(saveStateSpy).toHaveBeenCalledWith({
        auth: {
          accounts: [],
        } as AuthState,
        settings: {
          ...defaultSettings,
          useUnreadActiveIcon: true,
        } as SettingsState,
      });
    });

    it('should call updateSetting and set useAlternateIdleIcon', async () => {
      const setUseAlternateIdleIconSpy = jest.spyOn(
        comms,
        'setUseAlternateIdleIcon',
      );

      const TestComponent = () => {
        const { updateSetting } = useContext(AppContext);

        return (
          <button
            onClick={() => updateSetting('useAlternateIdleIcon', true)}
            type="button"
          >
            Test Case
          </button>
        );
      };

      const { getByText } = customRender(<TestComponent />);

      act(() => {
        fireEvent.click(getByText('Test Case'));
      });

      expect(setUseAlternateIdleIconSpy).toHaveBeenCalledWith(true);

      expect(saveStateSpy).toHaveBeenCalledWith({
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
          <button onClick={() => resetSettings()} type="button">
            Test Case
          </button>
        );
      };

      const { getByText } = customRender(<TestComponent />);

      act(() => {
        fireEvent.click(getByText('Test Case'));
      });

      expect(saveStateSpy).toHaveBeenCalledWith({
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
            onClick={() => updateFilter('filterCategories', 'direct', true)}
            type="button"
          >
            Test Case
          </button>
        );
      };

      const { getByText } = customRender(<TestComponent />);

      act(() => {
        fireEvent.click(getByText('Test Case'));
      });

      expect(saveStateSpy).toHaveBeenCalledWith({
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
            onClick={() => updateFilter('filterCategories', 'direct', false)}
            type="button"
          >
            Test Case
          </button>
        );
      };

      const { getByText } = customRender(<TestComponent />);

      act(() => {
        fireEvent.click(getByText('Test Case'));
      });

      expect(saveStateSpy).toHaveBeenCalledWith({
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
          <button onClick={() => clearFilters()} type="button">
            Test Case
          </button>
        );
      };

      const { getByText } = customRender(<TestComponent />);

      act(() => {
        fireEvent.click(getByText('Test Case'));
      });

      expect(saveStateSpy).toHaveBeenCalledWith({
        auth: {
          accounts: [],
        } as AuthState,
        settings: {
          ...mockSettings,
          filterEngagementStates: defaultSettings.filterEngagementStates,
          filterCategories: defaultSettings.filterCategories,
          filterReadStates: defaultSettings.filterReadStates,
          filterProducts: defaultSettings.filterProducts,
        },
      });
    });
  });
});
