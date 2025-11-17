import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AppContext } from '../../context/App';
import { Header } from './Header';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('renderer/components/primitives/Header.tsx', () => {
  const mockFetchNotifications = jest.fn();

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render itself & its children', () => {
    const tree = render(<Header>Test Header</Header>);

    expect(tree).toMatchSnapshot();
  });

  it('should navigate back', async () => {
    render(<Header>Test Header</Header>);

    await userEvent.click(screen.getByTestId('header-nav-back'));

    expect(mockNavigate).toHaveBeenNthCalledWith(1, -1);
  });

  it('should navigate back and fetch notifications', async () => {
    render(
      <AppContext.Provider
        value={{
          fetchNotifications: mockFetchNotifications,
        }}
      >
        <Header fetchOnBack={true}>Test Header</Header>
      </AppContext.Provider>,
    );

    await userEvent.click(screen.getByTestId('header-nav-back'));

    expect(mockNavigate).toHaveBeenNthCalledWith(1, -1);
    expect(mockFetchNotifications).toHaveBeenCalledTimes(1);
  });
});
