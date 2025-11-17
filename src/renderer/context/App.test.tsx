import { act, fireEvent, waitFor } from '@testing-library/react';
import { useContext } from 'react';

import { renderWithAppContext } from '../__helpers__/test-utils';
import { mockSingleAtlassifyNotification } from '../__mocks__/notifications-mocks';
import { mockSettings } from '../__mocks__/state-mocks';
import { Constants } from '../constants';
import { useNotifications } from '../hooks/useNotifications';
import type { AuthState, SettingsState } from '../types';
import * as notifications from '../utils/notifications/notifications';
import * as storage from '../utils/storage';
import { AppContext, type AppContextState, AppProvider } from './App';
import { defaultSettings } from './defaults';

jest.mock('../hooks/useNotifications');

// Helper to render a button that calls a context method when clicked
const renderContextButton = (
  contextMethodName: keyof AppContextState,
  ...args: unknown[]
) => {
  const TestComponent = () => {
    const context = useContext(AppContext);
    const method = context[contextMethodName];
    return (
      <button
        data-testid="context-method-button"
        onClick={() => {
          if (typeof method === 'function') {
            (method as (...args: unknown[]) => void)(...args);
          }
        }}
        type="button"
      >
        {String(contextMethodName)}
      </button>
    );
  };

  const result = renderWithAppContext(
    <AppProvider>
      <TestComponent />
    </AppProvider>,
  );

  const button = result.getByTestId('context-method-button');
  return { ...result, button };
};

describe('renderer/context/App.tsx', () => {
  const mockFetchNotifications = jest.fn();
  const mockMarkNotificationsRead = jest.fn();
  const mockMarkNotificationsUnread = jest.fn();

  const saveStateSpy = jest
    .spyOn(storage, 'saveState')
    .mockImplementation(jest.fn());

  beforeEach(() => {
    jest.useFakeTimers();
    (useNotifications as jest.Mock).mockReturnValue({
      fetchNotifications: mockFetchNotifications,
      markNotificationsRead: mockMarkNotificationsRead,
      markNotificationsUnread: mockMarkNotificationsUnread,
    });
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

    const mockDefaultState = {
      auth: { accounts: [] },
      settings: mockSettings,
    };

    it('fetch notifications each interval', async () => {
      renderWithAppContext(null);

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
      const { button } = renderContextButton('fetchNotifications');

      mockFetchNotifications.mockReset();

      fireEvent.click(button);

      expect(mockFetchNotifications).toHaveBeenCalledTimes(1);
    });

    it('should call markNotificationsRead', async () => {
      const { button } = renderContextButton('markNotificationsRead', [
        mockSingleAtlassifyNotification,
      ]);

      fireEvent.click(button);

      expect(mockMarkNotificationsRead).toHaveBeenCalledTimes(1);
      expect(mockMarkNotificationsRead).toHaveBeenCalledWith(mockDefaultState, [
        mockSingleAtlassifyNotification,
      ]);
    });

    it('should call markNotificationsUnread', async () => {
      const { button } = renderContextButton('markNotificationsUnread', [
        mockSingleAtlassifyNotification,
      ]);

      fireEvent.click(button);

      expect(mockMarkNotificationsUnread).toHaveBeenCalledTimes(1);
      expect(mockMarkNotificationsUnread).toHaveBeenCalledWith(
        mockDefaultState,
        [mockSingleAtlassifyNotification],
      );
    });
  });

  describe('settings methods', () => {
    it('should call updateSetting', async () => {
      const { button } = renderContextButton(
        'updateSetting',
        'playSoundNewNotifications',
        true,
      );

      fireEvent.click(button);

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
      const { button } = renderContextButton('resetSettings');

      fireEvent.click(button);

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
      const { button } = renderContextButton(
        'updateFilter',
        'filterCategories',
        'direct',
        true,
      );

      fireEvent.click(button);

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
      const { button } = renderContextButton(
        'updateFilter',
        'filterCategories',
        'direct',
        false,
      );

      fireEvent.click(button);

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
      const { button } = renderContextButton('clearFilters');

      fireEvent.click(button);

      expect(saveStateSpy).toHaveBeenCalledWith({
        auth: {
          accounts: [],
        } as AuthState,
        settings: {
          ...mockSettings,
          filterEngagementStates: defaultSettings.filterEngagementStates,
          filterCategories: defaultSettings.filterCategories,
          filterActors: defaultSettings.filterActors,
          filterReadStates: defaultSettings.filterReadStates,
          filterProducts: defaultSettings.filterProducts,
        },
      });
    });
  });
});
