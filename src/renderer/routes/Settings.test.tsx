import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { renderWithAppContext } from '../__helpers__/test-utils';

import * as useLoggedNavigate from '../hooks/useLoggedNavigate';

import { SettingsRoute } from './Settings';

const navigateMock = jest.fn();
jest
  .spyOn(useLoggedNavigate, 'useLoggedNavigate')
  .mockReturnValue(navigateMock);

describe('renderer/routes/Settings.tsx', () => {
  const fetchNotificationsMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render itself & its children', async () => {
    await act(async () => {
      renderWithAppContext(
        <MemoryRouter initialEntries={['/settings']}>
          <SettingsRoute />
        </MemoryRouter>,
      );
    });

    expect(screen.getByTestId('settings')).toMatchSnapshot();
  });

  it('should go back by pressing the icon', async () => {
    await act(async () => {
      renderWithAppContext(
        <MemoryRouter initialEntries={['/settings']}>
          <SettingsRoute />
        </MemoryRouter>,
        {
          fetchNotifications: fetchNotificationsMock,
        },
      );
    });

    await userEvent.click(screen.getByTestId('header-nav-back'));

    expect(fetchNotificationsMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith(-1);
  });
});
