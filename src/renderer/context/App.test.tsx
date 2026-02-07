import { act } from '@testing-library/react';

import { vi } from 'vitest';

import { renderWithAppContext } from '../__helpers__/test-utils';
import { mockAtlassianCloudAccount } from '../__mocks__/account-mocks';
import { mockSettings } from '../__mocks__/state-mocks';

import { useAppContext } from '../hooks/useAppContext';

import type { AuthState, SettingsState } from '../types';

import { useNotificationsStore } from '../stores/notifications';
import * as authUtils from '../utils/auth/utils';
import * as storage from '../utils/storage';
import { AppProvider } from './App';
import type { AppContextState } from './App.context';
import { defaultSettings } from './defaults';

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
  const saveStateSpy = vi
    .spyOn(storage, 'saveState')
    .mockImplementation(vi.fn());

  beforeEach(() => {
    vi.useFakeTimers();
    // Reset Zustand store state before each test
    useNotificationsStore.setState({
      allNotifications: [],
      fetchStatus: 'success',
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.clearAllMocks();
  });

  // Notification methods are now tested in the Zustand store tests

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

  describe('filter methods', () => {
    it('should update filter - checked', async () => {
      const getContext = renderWithContext();

      act(() => {
        getContext().updateFilter('filterCategories', 'direct', true);
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
      const getContext = renderWithContext();

      act(() => {
        getContext().updateFilter('filterCategories', 'direct', false);
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
      const getContext = renderWithContext();

      act(() => {
        getContext().clearFilters();
      });

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
      const removeAccountNotificationsMock = vi.spyOn(
        useNotificationsStore.getState(),
        'removeAccountNotifications',
      );

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
