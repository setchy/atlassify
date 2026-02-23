import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAppContext } from '../../__helpers__/test-utils';
import {
  mockAtlassianCloudAccount,
  mockAtlassianCloudAccountTwo,
} from '../../__mocks__/account-mocks';

import { useAccountsStore, useSettingsStore } from '../../stores';

import * as zoom from '../../utils/zoom';
import { AppearanceSettings } from './AppearanceSettings';

describe('renderer/components/settings/AppearanceSettings.tsx', () => {
  let toggleSettingSpy: ReturnType<typeof vi.spyOn>;
  let updateSettingSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    toggleSettingSpy = vi.spyOn(useSettingsStore.getState(), 'toggleSetting');
    updateSettingSpy = vi.spyOn(useSettingsStore.getState(), 'updateSetting');

    renderWithAppContext(<AppearanceSettings />);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should change the theme radio group', async () => {
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
    await userEvent.click(screen.getByLabelText('Show account header'));

    expect(toggleSettingSpy).toHaveBeenCalledTimes(1);
    expect(toggleSettingSpy).toHaveBeenCalledWith('showAccountHeader');
  });

  it('should hide the account header setting when there are multiple accounts', async () => {
    useAccountsStore.setState({
      accounts: [mockAtlassianCloudAccount, mockAtlassianCloudAccountTwo],
    });

    renderWithAppContext(<AppearanceSettings />);

    expect(screen.queryByLabelText('Show account header')).toBeNull();

    expect(toggleSettingSpy).toHaveBeenCalledTimes(0);
    expect(useAccountsStore.getState().hasMultipleAccounts()).toBe(true);
  });
});
