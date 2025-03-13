import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { mockAuth, mockSettings } from '../../__mocks__/state-mocks';
import { AppContext } from '../../context/App';
import { AppearanceSettings } from './AppearanceSettings';

describe('renderer/components/settings/AppearanceSettings.tsx', () => {
  const updateSetting = jest.fn();
  const zoomTimeout = () => new Promise((r) => setTimeout(r, 300));

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should change the theme radio group', async () => {
    await act(async () => {
      render(
        <AppContext.Provider
          value={{
            auth: mockAuth,
            settings: mockSettings,
            updateSetting,
          }}
        >
          <MemoryRouter>
            <AppearanceSettings />
          </MemoryRouter>
        </AppContext.Provider>,
      );
    });

    fireEvent.click(screen.getByTestId('theme-dark--radio-label'));

    expect(updateSetting).toHaveBeenCalledTimes(1);
    expect(updateSetting).toHaveBeenCalledWith('theme', 'DARK');
  });

  it('should update the zoom value when using CMD + and CMD -', async () => {
    window.atlassify.zoom.getLevel = jest.fn().mockReturnValue(-1);

    await act(async () => {
      render(
        <AppContext.Provider
          value={{
            auth: mockAuth,
            settings: mockSettings,
            updateSetting,
          }}
        >
          <MemoryRouter>
            <AppearanceSettings />
          </MemoryRouter>
        </AppContext.Provider>,
      );
    });

    fireEvent(window, new Event('resize'));
    await zoomTimeout();

    expect(updateSetting).toHaveBeenCalledTimes(1);
    expect(updateSetting).toHaveBeenCalledWith('zoomPercentage', 50);
  });

  it('should update the zoom values when using the zoom buttons', async () => {
    window.atlassify.zoom.getLevel = jest.fn().mockReturnValue(0);
    window.atlassify.zoom.setLevel = jest.fn().mockImplementation((level) => {
      window.atlassify.zoom.getLevel = jest.fn().mockReturnValue(level);
      fireEvent(window, new Event('resize'));
    });

    await act(async () => {
      render(
        <AppContext.Provider
          value={{
            auth: mockAuth,
            settings: mockSettings,
            updateSetting,
          }}
        >
          <MemoryRouter>
            <AppearanceSettings />
          </MemoryRouter>
        </AppContext.Provider>,
      );
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('settings-zoom-out'));
      await zoomTimeout();
    });

    expect(updateSetting).toHaveBeenCalledTimes(1);
    expect(updateSetting).toHaveBeenCalledWith('zoomPercentage', 90);

    await act(async () => {
      fireEvent.click(screen.getByTestId('settings-zoom-out'));
      await zoomTimeout();

      expect(updateSetting).toHaveBeenCalledTimes(2);
      expect(updateSetting).toHaveBeenNthCalledWith(2, 'zoomPercentage', 80);
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('settings-zoom-in'));
      await zoomTimeout();

      expect(updateSetting).toHaveBeenCalledTimes(3);
      expect(updateSetting).toHaveBeenNthCalledWith(3, 'zoomPercentage', 90);
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('settings-zoom-reset'));
      await zoomTimeout();

      expect(updateSetting).toHaveBeenCalledTimes(4);
      expect(updateSetting).toHaveBeenNthCalledWith(4, 'zoomPercentage', 100);
    });
  });
});
