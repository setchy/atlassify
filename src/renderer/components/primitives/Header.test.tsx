import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  navigateMock,
  renderWithProviders,
} from '../../__helpers__/test-utils';

import { Header } from './Header';

describe('renderer/components/primitives/Header.tsx', () => {
  const fetchNotificationsMock = vi.fn();

  it('should render itself & its children', () => {
    const tree = renderWithProviders(<Header>Test Header</Header>);

    expect(tree.container).toMatchSnapshot();
  });

  it('should render a subheading when provided', () => {
    const tree = renderWithProviders(
      <Header subheading="Test Subheading">Test Header</Header>,
    );

    expect(screen.getByText('Test Header')).toBeInTheDocument();
    expect(screen.getByText('Test Subheading')).toBeInTheDocument();
    expect(tree.container).toMatchSnapshot();
  });

  it('should not render a subheading when not provided', () => {
    renderWithProviders(<Header>Test Header</Header>);

    expect(screen.getByText('Test Header')).toBeInTheDocument();
    expect(screen.queryByText('Test Subheading')).not.toBeInTheDocument();
  });

  it('should navigate back', async () => {
    renderWithProviders(<Header>Test Header</Header>);

    await userEvent.click(screen.getByTestId('header-nav-back'));

    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith(-1);
  });

  it('should navigate back and fetch notifications', async () => {
    renderWithProviders(<Header fetchOnBack={true}>Test Header</Header>, {
      fetchNotifications: fetchNotificationsMock,
    });

    await userEvent.click(screen.getByTestId('header-nav-back'));

    expect(fetchNotificationsMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith(-1);
  });
});
