import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { mockNavigate } from '../__mocks__/navigation';
import { mockAuth, mockSettings } from '../__mocks__/state';

import { AppContext } from '../context/App';
import { SettingsRoute } from './Settings';

describe('renderer/routes/Settings.tsx', () => {
  const fetchNotifications = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
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
});
