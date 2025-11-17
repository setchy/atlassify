import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AppContext } from '../context/App';
import * as comms from '../utils/comms';
import { LandingRoute } from './Landing';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('renderer/routes/Landing.tsx', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render itself & its children', () => {
    const tree = render(<LandingRoute />);

    expect(tree).toMatchSnapshot();
  });

  it('should redirect to notifications once logged in', () => {
    const mockShowWindow = jest.spyOn(comms, 'showWindow');

    const { rerender } = render(
      <AppContext.Provider value={{ isLoggedIn: false }}>
        <LandingRoute />
      </AppContext.Provider>,
    );

    rerender(
      <AppContext.Provider value={{ isLoggedIn: true }}>
        <LandingRoute />
      </AppContext.Provider>,
    );

    expect(mockShowWindow).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenNthCalledWith(1, '/', { replace: true });
  });

  it('should navigate to login with api token', async () => {
    render(<LandingRoute />);

    await userEvent.click(screen.getByTestId('login'));

    expect(mockNavigate).toHaveBeenNthCalledWith(1, '/login');
  });
});
