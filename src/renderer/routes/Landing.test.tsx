import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { vi } from 'vitest';

import { renderWithAppContext } from '../__helpers__/test-utils';

import * as comms from '../utils/comms';
import { LandingRoute } from './Landing';

const navigateMock = vi.fn();
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => navigateMock,
}));

describe('renderer/routes/Landing.tsx', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render itself & its children', () => {
    const tree = renderWithAppContext(<LandingRoute />, { isLoggedIn: false });

    expect(tree).toMatchSnapshot();
  });

  it('should redirect to notifications once logged in', () => {
    const showWindowSpy = vi.spyOn(comms, 'showWindow');

    renderWithAppContext(<LandingRoute />, {
      isLoggedIn: true,
    });

    expect(showWindowSpy).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith('/', { replace: true });
  });

  it('should navigate to login with api token', async () => {
    renderWithAppContext(<LandingRoute />, { isLoggedIn: false });

    await userEvent.click(screen.getByTestId('login'));

    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith('/login');
  });
});
