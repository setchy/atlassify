import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { vi } from 'vitest';

import { renderWithAppContext } from '../../__helpers__/test-utils';

import * as zoom from '../../utils/zoom';
import { AppearanceSettings } from './AppearanceSettings';

describe('renderer/components/settings/AppearanceSettings.tsx', () => {
  const updateSettingMock = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should change the theme radio group', async () => {
    await act(async () => {
      renderWithAppContext(<AppearanceSettings />, {
        updateSetting: updateSettingMock,
      });
    });

    await userEvent.click(screen.getByTestId('theme-dark--radio-label'));

    expect(updateSettingMock).toHaveBeenCalledTimes(1);
    expect(updateSettingMock).toHaveBeenCalledWith('theme', 'DARK');
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
      renderWithAppContext(<AppearanceSettings />, {
        updateSetting: updateSettingMock,
      });
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
});
