import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { vi } from 'vitest';

import { renderWithAppContext } from '../__helpers__/test-utils';
import { mockAtlassianCloudAccount } from '../__mocks__/account-mocks';

import useAccountsStore from '../stores/useAccountsStore';

import * as comms from '../utils/comms';
import { LandingRoute } from './Landing';

const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => navigateMock,
}));

describe('renderer/routes/Landing.tsx', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render itself & its children', () => {
    useAccountsStore.setState({ accounts: [] });
    const tree = renderWithAppContext(<LandingRoute />);

    expect(tree).toMatchSnapshot();
  });

  it('should redirect to notifications once logged in', () => {
    const showWindowSpy = vi.spyOn(comms, 'showWindow');
    useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });

    renderWithAppContext(<LandingRoute />);

    expect(showWindowSpy).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith('/', { replace: true });
  });

  it('should navigate to login with api token', async () => {
    useAccountsStore.setState({ accounts: [] });
    renderWithAppContext(<LandingRoute />);

    await userEvent.click(screen.getByTestId('login'));

    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith('/login');
  });
});
