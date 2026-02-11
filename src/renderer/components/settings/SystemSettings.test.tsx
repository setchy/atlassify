import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { vi } from 'vitest';

import { renderWithAppContext } from '../../__helpers__/test-utils';

import useSettingsStore from '../../stores/useSettingsStore';

import type { Percentage } from '../../types';

import { SystemSettings } from './SystemSettings';

describe('renderer/components/settings/SystemSettings.tsx', () => {
  afterEach(() => {
    vi.clearAllMocks();
    useSettingsStore.getState().reset();
  });

  it('should change the open links radio group', async () => {
    const updateSettingSpy = vi.spyOn(
      useSettingsStore.getState(),
      'updateSetting',
    );

    await act(async () => {
      renderWithAppContext(<SystemSettings />);
    });

    await userEvent.click(screen.getByLabelText('Background'));

    expect(updateSettingSpy).toHaveBeenCalledTimes(1);
    expect(updateSettingSpy).toHaveBeenCalledWith('openLinks', 'BACKGROUND');
  });

  it('should toggle the keyboardShortcutEnabled checkbox', async () => {
    const updateSettingSpy = vi.spyOn(
      useSettingsStore.getState(),
      'updateSetting',
    );

    await act(async () => {
      renderWithAppContext(<SystemSettings />);
    });

    await userEvent.click(screen.getByLabelText('Enable keyboard shortcut'));

    expect(updateSettingSpy).toHaveBeenCalledTimes(1);
    expect(updateSettingSpy).toHaveBeenCalledWith(
      'keyboardShortcutEnabled',
      false,
    );
  });

  it('should toggle the showSystemNotifications checkbox', async () => {
    const updateSettingSpy = vi.spyOn(
      useSettingsStore.getState(),
      'updateSetting',
    );

    await act(async () => {
      renderWithAppContext(<SystemSettings />);
    });

    await userEvent.click(screen.getByLabelText('Show system notifications'));

    expect(updateSettingSpy).toHaveBeenCalledTimes(1);
    expect(updateSettingSpy).toHaveBeenCalledWith(
      'showSystemNotifications',
      false,
    );
  });

  describe('playSoundNewNotifications', () => {
    it('should toggle the playSoundNewNotifications checkbox', async () => {
      const updateSettingSpy = vi.spyOn(
        useSettingsStore.getState(),
        'updateSetting',
      );

      renderWithAppContext(<SystemSettings />);

      await userEvent.click(
        screen.getByLabelText('Play sound for new notifications'),
      );

      expect(updateSettingSpy).toHaveBeenCalledTimes(1);
      expect(updateSettingSpy).toHaveBeenCalledWith(
        'playSoundNewNotifications',
        false,
      );
    });

    it('volume controls should not be shown if playSound checkbox is false', async () => {
      useSettingsStore.setState({ playSoundNewNotifications: false });

      renderWithAppContext(<SystemSettings />);

      expect(screen.getByTestId('settings-volume-group')).not.toBeVisible();
    });

    it('volume controls should be shown if playSound checkbox is true', async () => {
      useSettingsStore.setState({ playSoundNewNotifications: true });

      renderWithAppContext(<SystemSettings />);

      expect(screen.getByTestId('settings-volume-group')).toBeVisible();
    });

    it('should increase notification volume', async () => {
      const updateSettingSpy = vi.spyOn(
        useSettingsStore.getState(),
        'updateSetting',
      );

      renderWithAppContext(<SystemSettings />);

      await userEvent.click(screen.getByTestId('settings-volume-up'));

      expect(updateSettingSpy).toHaveBeenCalledTimes(1);
      expect(updateSettingSpy).toHaveBeenCalledWith('notificationVolume', 30);
    });

    it('should decrease notification volume', async () => {
      const updateSettingSpy = vi.spyOn(
        useSettingsStore.getState(),
        'updateSetting',
      );

      renderWithAppContext(<SystemSettings />);

      await userEvent.click(screen.getByTestId('settings-volume-down'));

      expect(updateSettingSpy).toHaveBeenCalledTimes(1);
      expect(updateSettingSpy).toHaveBeenCalledWith('notificationVolume', 10);
    });

    it('should reset notification volume', async () => {
      const updateSettingSpy = vi.spyOn(
        useSettingsStore.getState(),
        'updateSetting',
      );
      useSettingsStore.setState({ notificationVolume: 30 as Percentage });

      renderWithAppContext(<SystemSettings />);

      await userEvent.click(screen.getByTestId('settings-volume-reset'));

      expect(updateSettingSpy).toHaveBeenCalledTimes(1);
      expect(updateSettingSpy).toHaveBeenCalledWith('notificationVolume', 20);
    });
  });

  it('should toggle the openAtStartup checkbox', async () => {
    const updateSettingSpy = vi.spyOn(
      useSettingsStore.getState(),
      'updateSetting',
    );

    await act(async () => {
      renderWithAppContext(<SystemSettings />);
    });

    await userEvent.click(screen.getByLabelText('Open at startup'));

    expect(updateSettingSpy).toHaveBeenCalledTimes(1);
    expect(updateSettingSpy).toHaveBeenCalledWith('openAtStartup', false);
  });
});
