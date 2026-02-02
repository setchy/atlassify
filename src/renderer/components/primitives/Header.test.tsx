import { vi } from 'vitest';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAppContext } from '../../__helpers__/test-utils';

import { Header } from './Header';

const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => ({
  ...await vi.importActual('react-router-dom'),
  useNavigate: () => navigateMock,
}));

describe('renderer/components/primitives/Header.tsx', () => {
  const fetchNotificationsMock = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render itself & its children', () => {
    const tree = renderWithAppContext(<Header>Test Header</Header>);

    expect(tree).toMatchSnapshot();
  });

  it('should navigate back', async () => {
    renderWithAppContext(<Header>Test Header</Header>);

    await userEvent.click(screen.getByTestId('header-nav-back'));

    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith(-1);
  });

  it('should navigate back and fetch notifications', async () => {
    renderWithAppContext(<Header fetchOnBack={true}>Test Header</Header>, {
      fetchNotifications: fetchNotificationsMock,
    });

    await userEvent.click(screen.getByTestId('header-nav-back'));

    expect(fetchNotificationsMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith(-1);
  });
});
