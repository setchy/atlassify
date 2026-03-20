import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { navigateMock, renderWithProviders } from '../__helpers__/test-utils';

import * as comms from '../utils/system/comms';
import { LandingRoute } from './Landing';

describe('renderer/routes/Landing.tsx', () => {
  it('should render itself & its children', () => {
    const tree = renderWithProviders(<LandingRoute />, {
      accounts: { accounts: [] },
    });

    expect(tree.container).toMatchSnapshot();
  });

  it('should redirect to notifications once logged in', () => {
    const showWindowSpy = vi.spyOn(comms, 'showWindow');

    renderWithProviders(<LandingRoute />);

    expect(showWindowSpy).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith('/', { replace: true });
  });

  it('should navigate to login with api token', async () => {
    renderWithProviders(<LandingRoute />, {
      accounts: { accounts: [] },
    });

    await userEvent.click(screen.getByTestId('login'));

    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith('/login');
  });
});
