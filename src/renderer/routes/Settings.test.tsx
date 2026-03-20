import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { navigateMock, renderWithAppContext } from '../__helpers__/test-utils';

import { SettingsRoute } from './Settings';

describe('renderer/routes/Settings.tsx', () => {
  it('should render itself & its children', async () => {
    await act(async () => {
      renderWithAppContext(<SettingsRoute />, {
        initialEntries: ['/settings'],
      });
    });

    expect(screen.getByTestId('settings')).toMatchSnapshot();
    expect(screen.getByTestId('settings')).toBeInTheDocument();
    expect(screen.getByText('Appearance')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Tray')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByTestId('settings-reset-defaults')).toBeInTheDocument();
  });

  it('should go back by pressing the icon', async () => {
    await act(async () => {
      renderWithAppContext(<SettingsRoute />, {
        initialEntries: ['/settings'],
      });
    });

    await userEvent.click(screen.getByTestId('header-nav-back'));

    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith(-1);
  });
});
