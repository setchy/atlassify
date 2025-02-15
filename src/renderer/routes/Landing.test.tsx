import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { mockNavigate } from '../__mocks__/navigation';

import { AppContext } from '../context/App';
import * as comms from '../utils/comms';
import { LandingRoute } from './Landing';

describe('renderer/routes/Landing.tsx', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render itself & its children', () => {
    const tree = render(
      <MemoryRouter>
        <LandingRoute />
      </MemoryRouter>,
    );

    expect(tree).toMatchSnapshot();
  });

  it('should redirect to notifications once logged in', () => {
    const showWindowMock = vi.spyOn(comms, 'showWindow');

    const { rerender } = render(
      <AppContext.Provider value={{ isLoggedIn: false }}>
        <MemoryRouter>
          <LandingRoute />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    rerender(
      <AppContext.Provider value={{ isLoggedIn: true }}>
        <MemoryRouter>
          <LandingRoute />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(showWindowMock).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenNthCalledWith(1, '/', { replace: true });
  });

  it('should navigate to login with api token', () => {
    render(
      <MemoryRouter>
        <LandingRoute />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByTestId('login'));

    expect(mockNavigate).toHaveBeenNthCalledWith(1, '/login');
  });
});
