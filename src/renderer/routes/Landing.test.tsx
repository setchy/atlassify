import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAppContext } from '../__helpers__/test-utils';

import * as useLoggedNavigate from '../hooks/useLoggedNavigate';

import * as comms from '../utils/comms';
import { LandingRoute } from './Landing';

const navigateMock = jest.fn();
jest
  .spyOn(useLoggedNavigate, 'useLoggedNavigate')
  .mockReturnValue(navigateMock);

describe('renderer/routes/Landing.tsx', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render itself & its children', () => {
    const tree = renderWithAppContext(<LandingRoute />, { isLoggedIn: false });

    expect(tree).toMatchSnapshot();
  });

  it('should redirect to notifications once logged in', () => {
    const showWindowSpy = jest.spyOn(comms, 'showWindow');

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
