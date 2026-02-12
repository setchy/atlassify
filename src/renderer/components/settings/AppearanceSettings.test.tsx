import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { vi } from 'vitest';

import { renderWithAppContext } from '../../__helpers__/test-utils';
import {
  mockAtlassianCloudAccount,
  mockAtlassianCloudAccountTwo,
} from '../../__mocks__/account-mocks';

import useAccountsStore from '../../stores/useAccountsStore';
import useSettingsStore from '../../stores/useSettingsStore';

import * as zoom from '../../utils/zoom';
import { AppearanceSettings } from './AppearanceSettings';

describe('renderer/components/settings/AppearanceSettings.tsx', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should change the theme radio group', async () => {
    const updateSettingSpy = vi.spyOn(
      useSettingsStore.getState(),
      'updateSetting',
    );

    await act(async () => {
      renderWithAppContext(<AppearanceSettings />);
    });

    await userEvent.click(screen.getByTestId('theme-dark--radio-label'));

    expect(updateSettingSpy).toHaveBeenCalledTimes(1);
    expect(updateSettingSpy).toHaveBeenCalledWith('theme', 'DARK');
  });

  it('should update the zoom values when using the zoom buttons', async () => {
    const zoomOutSpy = vi
      .spyOn(zoom, 'decreaseZoom')
      .mockImplementation(vi.fn());
    const zoomInSpy = vi
      .spyOn(zoom, 'increaseZoom')
      .mockImplementation(vi.fn());
    const zoomResetSpy = vi
      .spyOn(zoom, 'resetZoomLevel')
      .mockImplementation(vi.fn());

    await act(async () => {
      renderWithAppContext(<AppearanceSettings />);
    });

    // Zoom Out
    await userEvent.click(screen.getByTestId('settings-zoom-out'));
    expect(zoomOutSpy).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByTestId('settings-zoom-out'));
    expect(zoomOutSpy).toHaveBeenCalledTimes(2);

    // Zoom In
    await userEvent.click(screen.getByTestId('settings-zoom-in'));
    expect(zoomInSpy).toHaveBeenCalledTimes(1);

    // Zoom Reset
    await userEvent.click(screen.getByTestId('settings-zoom-reset'));
    expect(zoomResetSpy).toHaveBeenCalledTimes(1);
  });

  it('should toggle the account header setting', async () => {
    const updateSettingSpy = vi.spyOn(
      useSettingsStore.getState(),
      'updateSetting',
    );

    await act(async () => {
      renderWithAppContext(<AppearanceSettings />);
    });

    await userEvent.click(screen.getByLabelText('Show account header'));

    expect(updateSettingSpy).toHaveBeenCalledTimes(1);
    expect(updateSettingSpy).toHaveBeenCalledWith('showAccountHeader', false);
  });

  it('should hide the account header setting when there are multiple accounts', async () => {
    const updateSettingSpy = vi.spyOn(
      useSettingsStore.getState(),
      'updateSetting',
    );

    useAccountsStore
      .getState()
      .setAccounts([mockAtlassianCloudAccount, mockAtlassianCloudAccountTwo]);

    await act(async () => {
      renderWithAppContext(<AppearanceSettings />);
    });

    expect(screen.queryByLabelText('Show account header')).toBeNull();

    expect(updateSettingSpy).toHaveBeenCalledTimes(0);
    expect(useAccountsStore.getState().hasMultipleAccounts()).toBe(true);
  });
});
