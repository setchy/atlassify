import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { vi } from 'vitest';

import { renderWithAppContext } from '../../__helpers__/test-utils';
import { mockSettings } from '../../__mocks__/state-mocks';

import type { Percentage } from '../../types';

import { SystemSettings } from './SystemSettings';

describe('renderer/components/settings/SystemSettings.tsx', () => {
  const updateSettingMock = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should change the open links radio group', async () => {
    await act(async () => {
      renderWithAppContext(<SystemSettings />, {
        updateSetting: updateSettingMock,
      });
    });

    await userEvent.click(screen.getByLabelText('Background'));

    expect(updateSettingMock).toHaveBeenCalledTimes(1);
    expect(updateSettingMock).toHaveBeenCalledWith('openLinks', 'BACKGROUND');
  });

  it('should toggle the keyboardShortcutEnabled checkbox', async () => {
    await act(async () => {
      renderWithAppContext(<SystemSettings />, {
        updateSetting: updateSettingMock,
      });
    });

    await userEvent.click(screen.getByLabelText('Enable keyboard shortcut'));

    expect(updateSettingMock).toHaveBeenCalledTimes(1);
    expect(updateSettingMock).toHaveBeenCalledWith(
      'keyboardShortcutEnabled',
      false,
    );
  });

  it('should toggle the showSystemNotifications checkbox', async () => {
    await act(async () => {
      renderWithAppContext(<SystemSettings />, {
        updateSetting: updateSettingMock,
      });
    });

    await userEvent.click(screen.getByLabelText('Show system notifications'));

    expect(updateSettingMock).toHaveBeenCalledTimes(1);
    expect(updateSettingMock).toHaveBeenCalledWith(
      'showSystemNotifications',
      false,
    );
  });

  describe('playSoundNewNotifications', () => {
    it('should toggle the playSoundNewNotifications checkbox', async () => {
      renderWithAppContext(<SystemSettings />, {
        updateSetting: updateSettingMock,
      });

      await userEvent.click(
        screen.getByLabelText('Play sound for new notifications'),
      );

      expect(updateSettingMock).toHaveBeenCalledTimes(1);
      expect(updateSettingMock).toHaveBeenCalledWith(
        'playSoundNewNotifications',
        false,
      );
    });

    it('volume controls should not be shown if playSound checkbox is false', async () => {
      renderWithAppContext(<SystemSettings />, {
        updateSetting: updateSettingMock,
        settings: { ...mockSettings, playSoundNewNotifications: false },
      });

      expect(screen.getByTestId('settings-volume-group')).not.toBeVisible();
    });

    it('volume controls should be shown if playSound checkbox is true', async () => {
      renderWithAppContext(<SystemSettings />, {
        updateSetting: updateSettingMock,
        settings: { ...mockSettings, playSoundNewNotifications: true },
      });

      expect(screen.getByTestId('settings-volume-group')).toBeVisible();
    });

    it('should increase notification volume', async () => {
      renderWithAppContext(<SystemSettings />, {
        updateSetting: updateSettingMock,
      });

      await userEvent.click(screen.getByTestId('settings-volume-up'));

      expect(updateSettingMock).toHaveBeenCalledTimes(1);
      expect(updateSettingMock).toHaveBeenCalledWith('notificationVolume', 30);
    });

    it('should decrease notification volume', async () => {
      renderWithAppContext(<SystemSettings />, {
        updateSetting: updateSettingMock,
      });

      await userEvent.click(screen.getByTestId('settings-volume-down'));

      expect(updateSettingMock).toHaveBeenCalledTimes(1);
      expect(updateSettingMock).toHaveBeenCalledWith('notificationVolume', 10);
    });

    it('should reset notification volume', async () => {
      renderWithAppContext(<SystemSettings />, {
        settings: {
          notificationVolume: 30 as Percentage,
        },
        updateSetting: updateSettingMock,
      });

      await userEvent.click(screen.getByTestId('settings-volume-reset'));

      expect(updateSettingMock).toHaveBeenCalledTimes(1);
      expect(updateSettingMock).toHaveBeenCalledWith('notificationVolume', 20);
    });
  });

  it('should toggle the openAtStartup checkbox', async () => {
    await act(async () => {
      renderWithAppContext(<SystemSettings />, {
        updateSetting: updateSettingMock,
      });
    });

    await userEvent.click(screen.getByLabelText('Open at startup'));

    expect(updateSettingMock).toHaveBeenCalledTimes(1);
    expect(updateSettingMock).toHaveBeenCalledWith('openAtStartup', false);
  });
});
