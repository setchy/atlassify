import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { vi } from 'vitest';

import { renderWithAppContext } from '../__helpers__/test-utils';

import { SettingsRoute } from './Settings';

const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => navigateMock,
}));

describe('renderer/routes/Settings.tsx', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render itself & its children', async () => {
    await act(async () => {
      renderWithAppContext(
        <MemoryRouter initialEntries={['/settings']}>
          <SettingsRoute />
        </MemoryRouter>,
      );
    });

    expect(screen.getByTestId('settings')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Appearance')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Tray')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'System' })).toBeInTheDocument();
    expect(screen.getByLabelText('Show account header')).toBeInTheDocument();
    expect(screen.getByTestId('settings-reset-defaults')).toBeInTheDocument();
  });

  it('should go back by pressing the icon', async () => {
    await act(async () => {
      renderWithAppContext(
        <MemoryRouter initialEntries={['/settings']}>
          <SettingsRoute />
        </MemoryRouter>,
      );
    });

    await userEvent.click(screen.getByTestId('header-nav-back'));

    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith(-1);
  });
});
