import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAppContext } from '../../__helpers__/test-utils';

import { useSettingsStore } from '../../stores';

import type { Percentage } from '../../types';

import { SystemSettings } from './SystemSettings';

describe('renderer/components/settings/SystemSettings.tsx', () => {
  let toggleSettingSpy: ReturnType<typeof vi.spyOn>;
  let updateSettingSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    toggleSettingSpy = vi.spyOn(useSettingsStore.getState(), 'toggleSetting');
    updateSettingSpy = vi.spyOn(useSettingsStore.getState(), 'updateSetting');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should change the open links radio group', async () => {
    renderWithAppContext(<SystemSettings />);

    await userEvent.click(screen.getByLabelText('Background'));

    expect(updateSettingSpy).toHaveBeenCalledTimes(1);
    expect(updateSettingSpy).toHaveBeenCalledWith('openLinks', 'BACKGROUND');
  });

  it('should toggle the keyboardShortcutEnabled checkbox', async () => {
    renderWithAppContext(<SystemSettings />);

    await userEvent.click(screen.getByLabelText('Enable keyboard shortcut'));

    expect(toggleSettingSpy).toHaveBeenCalledTimes(1);
    expect(toggleSettingSpy).toHaveBeenCalledWith('keyboardShortcutEnabled');
  });

  it('should toggle the showSystemNotifications checkbox', async () => {
    renderWithAppContext(<SystemSettings />);

    await userEvent.click(screen.getByLabelText('Show system notifications'));

    expect(toggleSettingSpy).toHaveBeenCalledTimes(1);
    expect(toggleSettingSpy).toHaveBeenCalledWith('showSystemNotifications');
  });

  describe('playSoundNewNotifications', () => {
    it('should toggle the playSoundNewNotifications checkbox', async () => {
      renderWithAppContext(<SystemSettings />);

      await userEvent.click(
        screen.getByLabelText('Play sound for new notifications'),
      );

      expect(toggleSettingSpy).toHaveBeenCalledTimes(1);
      expect(toggleSettingSpy).toHaveBeenCalledWith(
        'playSoundNewNotifications',
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
      renderWithAppContext(<SystemSettings />);

      await userEvent.click(screen.getByTestId('settings-volume-up'));

      expect(updateSettingSpy).toHaveBeenCalledTimes(1);
      expect(updateSettingSpy).toHaveBeenCalledWith('notificationVolume', 30);
    });

    it('should decrease notification volume', async () => {
      renderWithAppContext(<SystemSettings />);

      await userEvent.click(screen.getByTestId('settings-volume-down'));

      expect(updateSettingSpy).toHaveBeenCalledTimes(1);
      expect(updateSettingSpy).toHaveBeenCalledWith('notificationVolume', 10);
    });

    it('should reset notification volume', async () => {
      useSettingsStore.setState({ notificationVolume: 30 as Percentage });

      renderWithAppContext(<SystemSettings />);

      await userEvent.click(screen.getByTestId('settings-volume-reset'));

      expect(updateSettingSpy).toHaveBeenCalledTimes(1);
      expect(updateSettingSpy).toHaveBeenCalledWith('notificationVolume', 20);
    });
  });

  it('should toggle the openAtStartup checkbox', async () => {
    renderWithAppContext(<SystemSettings />);

    await userEvent.click(screen.getByLabelText('Open at startup'));

    expect(toggleSettingSpy).toHaveBeenCalledTimes(1);
    expect(toggleSettingSpy).toHaveBeenCalledWith('openAtStartup');
  });
});
