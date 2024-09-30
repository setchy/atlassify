import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { mockAuth, mockSettings } from '../__mocks__/state-mocks';
import { AppContext } from '../context/App';
import { SettingsRoute } from './Settings';

global.ResizeObserver = require('resize-observer-polyfill');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('renderer/routes/Settings.tsx', () => {
  const fetchNotifications = jest.fn();
  const resetSettings = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render itself & its children', async () => {
    await act(async () => {
      render(
        <AppContext.Provider value={{ auth: mockAuth, settings: mockSettings }}>
          <MemoryRouter>
            <SettingsRoute />
          </MemoryRouter>
        </AppContext.Provider>,
      );
    });

    expect(screen.getByTestId('settings')).toMatchSnapshot();
  });

  it('should go back by pressing the icon', async () => {
    await act(async () => {
      render(
        <AppContext.Provider
          value={{
            auth: mockAuth,
            settings: mockSettings,
            fetchNotifications,
          }}
        >
          <MemoryRouter>
            <SettingsRoute />
          </MemoryRouter>
        </AppContext.Provider>,
      );
    });

    fireEvent.click(screen.getByTestId('header-nav-back'));

    expect(fetchNotifications).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenNthCalledWith(1, -1);
  });

  it('should reset default settings when `confirmed`', async () => {
    await act(async () => {
      render(
        <AppContext.Provider
          value={{
            auth: mockAuth,
            settings: mockSettings,
            resetSettings,
          }}
        >
          <MemoryRouter>
            <SettingsRoute />
          </MemoryRouter>
        </AppContext.Provider>,
      );
    });

    fireEvent.click(screen.getByTestId('settings-reset-defaults'));
    fireEvent.click(screen.getByTestId('settings-reset-confirm'));

    expect(resetSettings).toHaveBeenCalled();
  });

  it('should skip reset default settings when `cancelled`', async () => {
    await act(async () => {
      render(
        <AppContext.Provider
          value={{
            auth: mockAuth,
            settings: mockSettings,
            resetSettings,
          }}
        >
          <MemoryRouter>
            <SettingsRoute />
          </MemoryRouter>
        </AppContext.Provider>,
      );
    });

    fireEvent.click(screen.getByTestId('settings-reset-defaults'));
    fireEvent.click(screen.getByTestId('settings-reset-cancel'));

    expect(resetSettings).not.toHaveBeenCalled();
  });
});
