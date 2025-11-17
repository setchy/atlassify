import { act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAppContext } from '../../__helpers__/test-utils';
import { AppearanceSettings } from './AppearanceSettings';

describe('renderer/components/settings/AppearanceSettings.tsx', () => {
  const mockUpdateSetting = jest.fn();
  const zoomTimeout = () => new Promise((r) => setTimeout(r, 300));

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should change the theme radio group', async () => {
    await act(async () => {
      renderWithAppContext(<AppearanceSettings />, {
        updateSetting: mockUpdateSetting,
      });
    });

    await userEvent.click(screen.getByTestId('theme-dark--radio-label'));

    expect(mockUpdateSetting).toHaveBeenCalledTimes(1);
    expect(mockUpdateSetting).toHaveBeenCalledWith('theme', 'DARK');
  });

  it('should update the zoom value when using CMD + and CMD -', async () => {
    window.atlassify.zoom.getLevel = jest.fn().mockReturnValue(-1);

    await act(async () => {
      renderWithAppContext(<AppearanceSettings />, {
        updateSetting: mockUpdateSetting,
      });
    });

    fireEvent(window, new Event('resize'));
    await zoomTimeout();

    expect(mockUpdateSetting).toHaveBeenCalledTimes(1);
    expect(mockUpdateSetting).toHaveBeenCalledWith('zoomPercentage', 50);
  });

  it('should update the zoom values when using the zoom buttons', async () => {
    window.atlassify.zoom.getLevel = jest.fn().mockReturnValue(0);
    window.atlassify.zoom.setLevel = jest.fn().mockImplementation((level) => {
      window.atlassify.zoom.getLevel = jest.fn().mockReturnValue(level);
      fireEvent(window, new Event('resize'));
    });

    await act(async () => {
      renderWithAppContext(<AppearanceSettings />, {
        updateSetting: mockUpdateSetting,
      });
    });

    await act(async () => {
      await userEvent.click(screen.getByTestId('settings-zoom-out'));
      await zoomTimeout();
    });

    expect(mockUpdateSetting).toHaveBeenCalledTimes(1);
    expect(mockUpdateSetting).toHaveBeenNthCalledWith(1, 'zoomPercentage', 90);

    await act(async () => {
      await userEvent.click(screen.getByTestId('settings-zoom-out'));
      await zoomTimeout();

      expect(mockUpdateSetting).toHaveBeenCalledTimes(2);
      expect(mockUpdateSetting).toHaveBeenNthCalledWith(
        2,
        'zoomPercentage',
        80,
      );
    });

    await act(async () => {
      await userEvent.click(screen.getByTestId('settings-zoom-in'));
      await zoomTimeout();

      expect(mockUpdateSetting).toHaveBeenCalledTimes(3);
      expect(mockUpdateSetting).toHaveBeenNthCalledWith(
        3,
        'zoomPercentage',
        90,
      );
    });

    await act(async () => {
      await userEvent.click(screen.getByTestId('settings-zoom-reset'));
      await zoomTimeout();

      expect(mockUpdateSetting).toHaveBeenCalledTimes(4);
      expect(mockUpdateSetting).toHaveBeenNthCalledWith(
        4,
        'zoomPercentage',
        100,
      );
    });
  });
});
