import { fireEvent, render, screen } from '@testing-library/react';

import { mockNavigate } from '../../__mocks__/navigation';

import { AppContext } from '../../context/App';
import { Header } from './Header';

describe('renderer/components/primitives/Header.tsx', () => {
  const fetchNotifications = vi.fn();

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should render itself & its children', () => {
    const tree = render(<Header>Test Header</Header>);

    expect(tree).toMatchSnapshot();
  });

  it('should navigate back', () => {
    render(<Header>Test Header</Header>);

    fireEvent.click(screen.getByTestId('header-nav-back'));

    expect(mockNavigate).toHaveBeenNthCalledWith(1, -1);
  });

  it('should navigate back and fetch notifications', () => {
    render(
      <AppContext.Provider
        value={{
          fetchNotifications,
        }}
      >
        <Header fetchOnBack={true}>Test Header</Header>
      </AppContext.Provider>,
    );

    fireEvent.click(screen.getByTestId('header-nav-back'));

    expect(mockNavigate).toHaveBeenNthCalledWith(1, -1);
    expect(fetchNotifications).toHaveBeenCalledTimes(1);
  });
});
