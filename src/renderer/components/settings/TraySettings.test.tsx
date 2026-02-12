import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { vi } from 'vitest';

import { renderWithAppContext } from '../../__helpers__/test-utils';

import useSettingsStore from '../../stores/useSettingsStore';

import { TraySettings } from './TraySettings';

describe('renderer/components/settings/TraySettings.tsx', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should toggle the showNotificationsCountInTray checkbox', async () => {
    const updateSettingSpy = vi.spyOn(
      useSettingsStore.getState(),
      'updateSetting',
    );

    await act(async () => {
      renderWithAppContext(<TraySettings />);
    });

    await userEvent.click(
      screen.getByLabelText('Show notifications count in tray'),
    );

    expect(updateSettingSpy).toHaveBeenCalledTimes(1);
    expect(updateSettingSpy).toHaveBeenCalledWith(
      'showNotificationsCountInTray',
      false,
    );
  });

  it('should toggle the useUnreadActiveIcon checkbox', async () => {
    const updateSettingSpy = vi.spyOn(
      useSettingsStore.getState(),
      'updateSetting',
    );

    await act(async () => {
      renderWithAppContext(<TraySettings />);
    });

    await userEvent.click(
      screen.getByLabelText('Highlight unread notifications'),
    );

    expect(updateSettingSpy).toHaveBeenCalledTimes(1);
    expect(updateSettingSpy).toHaveBeenCalledWith('useUnreadActiveIcon', false);
  });

  it('should toggle the useAlternateIdleIcon checkbox', async () => {
    const updateSettingSpy = vi.spyOn(
      useSettingsStore.getState(),
      'updateSetting',
    );

    await act(async () => {
      renderWithAppContext(<TraySettings />);
    });

    await userEvent.click(screen.getByLabelText('Use alternate idle icon'));

    expect(updateSettingSpy).toHaveBeenCalledTimes(1);
    expect(updateSettingSpy).toHaveBeenCalledWith('useAlternateIdleIcon', true);
  });
});
