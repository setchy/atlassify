import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAppContext } from '../../__helpers__/test-utils';
import { mockSettings } from '../../__mocks__/state-mocks';
import type { Percentage } from '../../types';
import { SystemSettings } from './SystemSettings';

describe('renderer/components/settings/SystemSettings.tsx', () => {
  const mockUpdateSetting = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should change the open links radio group', async () => {
    await act(async () => {
      renderWithAppContext(<SystemSettings />, {
        updateSetting: mockUpdateSetting,
      });
    });

    await userEvent.click(screen.getByLabelText('Background'));

    expect(mockUpdateSetting).toHaveBeenCalledTimes(1);
    expect(mockUpdateSetting).toHaveBeenCalledWith('openLinks', 'BACKGROUND');
  });

  it('should toggle the keyboardShortcutEnabled checkbox', async () => {
    await act(async () => {
      renderWithAppContext(<SystemSettings />, {
        updateSetting: mockUpdateSetting,
      });
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
      renderWithAppContext(<SystemSettings />, {
        updateSetting: mockUpdateSetting,
      });
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
      renderWithAppContext(<SystemSettings />, {
        updateSetting: mockUpdateSetting,
      });

      await userEvent.click(
        screen.getByLabelText('Play sound for new notifications'),
      );

      expect(mockUpdateSetting).toHaveBeenCalledTimes(1);
      expect(mockUpdateSetting).toHaveBeenCalledWith(
        'playSoundNewNotifications',
        false,
      );
    });

    it('volume controls should not be shown if playSound checkbox is false', async () => {
      renderWithAppContext(<SystemSettings />, {
        updateSetting: mockUpdateSetting,
        settings: { ...mockSettings, playSoundNewNotifications: false },
      });

      expect(screen.getByTestId('settings-volume-group')).not.toBeVisible();
    });

    it('volume controls should be shown if playSound checkbox is true', async () => {
      renderWithAppContext(<SystemSettings />, {
        updateSetting: mockUpdateSetting,
        settings: { ...mockSettings, playSoundNewNotifications: true },
      });

      expect(screen.getByTestId('settings-volume-group')).toBeVisible();
    });

    it('should increase notification volume', async () => {
      renderWithAppContext(<SystemSettings />, {
        updateSetting: mockUpdateSetting,
      });

      await userEvent.click(screen.getByTestId('settings-volume-up'));

      expect(mockUpdateSetting).toHaveBeenCalledTimes(1);
      expect(mockUpdateSetting).toHaveBeenCalledWith('notificationVolume', 30);
    });

    it('should decrease notification volume', async () => {
      renderWithAppContext(<SystemSettings />, {
        updateSetting: mockUpdateSetting,
      });

      await userEvent.click(screen.getByTestId('settings-volume-down'));

      expect(mockUpdateSetting).toHaveBeenCalledTimes(1);
      expect(mockUpdateSetting).toHaveBeenCalledWith('notificationVolume', 10);
    });

    it('should reset notification volume', async () => {
      renderWithAppContext(<SystemSettings />, {
        settings: {
          notificationVolume: 30 as Percentage,
        },
        updateSetting: mockUpdateSetting,
      });

      await userEvent.click(screen.getByTestId('settings-volume-reset'));

      expect(mockUpdateSetting).toHaveBeenCalledTimes(1);
      expect(mockUpdateSetting).toHaveBeenCalledWith('notificationVolume', 20);
    });
  });

  it('should toggle the openAtStartup checkbox', async () => {
    await act(async () => {
      renderWithAppContext(<SystemSettings />, {
        updateSetting: mockUpdateSetting,
      });
    });

    await userEvent.click(screen.getByLabelText('Open at startup'));

    expect(mockUpdateSetting).toHaveBeenCalledTimes(1);
    expect(mockUpdateSetting).toHaveBeenCalledWith('openAtStartup', false);
  });
});
