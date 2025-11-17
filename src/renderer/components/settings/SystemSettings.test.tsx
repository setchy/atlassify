import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { mockAuth, mockSettings } from '../../__mocks__/state-mocks';
import { AppContext } from '../../context/App';
import type { Percentage } from '../../types';
import { SystemSettings } from './SystemSettings';

describe('renderer/components/settings/SystemSettings.tsx', () => {
  const mockUpdateSetting = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should change the open links radio group', async () => {
    await act(async () => {
      render(
        <AppContext.Provider
          value={{
            auth: mockAuth,
            settings: mockSettings,
            updateSetting: mockUpdateSetting,
          }}
        >
          <SystemSettings />
        </AppContext.Provider>,
      );
    });

    await userEvent.click(screen.getByLabelText('Background'));

    expect(mockUpdateSetting).toHaveBeenCalledTimes(1);
    expect(mockUpdateSetting).toHaveBeenCalledWith('openLinks', 'BACKGROUND');
  });

  it('should toggle the keyboardShortcutEnabled checkbox', async () => {
    await act(async () => {
      render(
        <AppContext.Provider
          value={{
            auth: mockAuth,
            settings: mockSettings,
            updateSetting: mockUpdateSetting,
          }}
        >
          <SystemSettings />
        </AppContext.Provider>,
      );
    });

    await userEvent.click(screen.getByLabelText('Enable keyboard shortcut'));

    expect(mockUpdateSetting).toHaveBeenCalledTimes(1);
    expect(mockUpdateSetting).toHaveBeenCalledWith(
      'keyboardShortcutEnabled',
      false,
    );
  });

  it('should toggle the showSystemNotifications checkbox', async () => {
    await act(async () => {
      render(
        <AppContext.Provider
          value={{
            auth: mockAuth,
            settings: mockSettings,
            updateSetting: mockUpdateSetting,
          }}
        >
          <SystemSettings />
        </AppContext.Provider>,
      );
    });

    await userEvent.click(screen.getByLabelText('Show system notifications'));

    expect(mockUpdateSetting).toHaveBeenCalledTimes(1);
    expect(mockUpdateSetting).toHaveBeenCalledWith(
      'showSystemNotifications',
      false,
    );
  });

  describe('playSoundNewNotifications', () => {
    it('should toggle the playSoundNewNotifications checkbox', async () => {
      const { rerender } = render(
        <AppContext.Provider
          value={{
            auth: mockAuth,
            settings: mockSettings,
            updateSetting: mockUpdateSetting,
          }}
        >
          <SystemSettings />
        </AppContext.Provider>,
      );

      await userEvent.click(
        screen.getByLabelText('Play sound for new notifications'),
      );

      expect(mockUpdateSetting).toHaveBeenCalledTimes(1);
      expect(mockUpdateSetting).toHaveBeenCalledWith(
        'playSoundNewNotifications',
        false,
      );

      // Simulate update to context with playSound = false
      rerender(
        <AppContext.Provider
          value={{
            auth: mockAuth,
            settings: { ...mockSettings, playSoundNewNotifications: false },
            updateSetting: mockUpdateSetting,
          }}
        >
          <SystemSettings />
        </AppContext.Provider>,
      );

      expect(screen.getByTestId('settings-volume-group')).not.toBeVisible();
    });

    it('should increase notification volume', async () => {
      render(
        <AppContext.Provider
          value={{
            auth: mockAuth,
            settings: mockSettings,
            updateSetting: mockUpdateSetting,
          }}
        >
          <SystemSettings />
        </AppContext.Provider>,
      );

      await userEvent.click(screen.getByTestId('settings-volume-up'));

      expect(mockUpdateSetting).toHaveBeenCalledTimes(1);
      expect(mockUpdateSetting).toHaveBeenCalledWith('notificationVolume', 30);
    });

    it('should decrease notification volume', async () => {
      render(
        <AppContext.Provider
          value={{
            auth: mockAuth,
            settings: mockSettings,
            updateSetting: mockUpdateSetting,
          }}
        >
          <SystemSettings />
        </AppContext.Provider>,
      );

      await userEvent.click(screen.getByTestId('settings-volume-down'));

      expect(mockUpdateSetting).toHaveBeenCalledTimes(1);
      expect(mockUpdateSetting).toHaveBeenCalledWith('notificationVolume', 10);
    });

    it('should reset notification volume', async () => {
      render(
        <AppContext.Provider
          value={{
            auth: mockAuth,
            settings: {
              ...mockSettings,
              notificationVolume: 30 as Percentage,
            },
            updateSetting: mockUpdateSetting,
          }}
        >
          <SystemSettings />
        </AppContext.Provider>,
      );

      await userEvent.click(screen.getByTestId('settings-volume-reset'));

      expect(mockUpdateSetting).toHaveBeenCalledTimes(1);
      expect(mockUpdateSetting).toHaveBeenCalledWith('notificationVolume', 20);
    });
  });

  it('should toggle the openAtStartup checkbox', async () => {
    await act(async () => {
      render(
        <AppContext.Provider
          value={{
            auth: mockAuth,
            settings: mockSettings,
            updateSetting: mockUpdateSetting,
          }}
        >
          <SystemSettings />
        </AppContext.Provider>,
      );
    });

    await userEvent.click(screen.getByLabelText('Open at startup'));

    expect(mockUpdateSetting).toHaveBeenCalledTimes(1);
    expect(mockUpdateSetting).toHaveBeenCalledWith('openAtStartup', false);
  });
});
