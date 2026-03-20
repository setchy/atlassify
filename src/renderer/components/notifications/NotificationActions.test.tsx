import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '../../__helpers__/test-utils';

import {
  NotificationActions,
  type NotificationActionsProps,
} from './NotificationActions';

describe('renderer/components/notifications/NotificationActions.tsx', () => {
  it('renders mark-as-read button when unread and not animating', () => {
    const props: NotificationActionsProps = {
      isUnread: true,
      isAnimatingExit: false,
      onMarkAsRead: vi.fn(),
      onMarkAsUnread: vi.fn(),
    };

    const tree = renderWithProviders(<NotificationActions {...props} />);

    expect(tree.container).toMatchSnapshot();
  });

  it('renders mark-as-unread button when read and not animating', () => {
    const props: NotificationActionsProps = {
      isUnread: false,
      isAnimatingExit: false,
      onMarkAsRead: vi.fn(),
      onMarkAsUnread: vi.fn(),
    };

    const tree = renderWithProviders(<NotificationActions {...props} />);

    expect(tree.container).toMatchSnapshot();
  });

  it('renders no action buttons when animating exit', () => {
    const props: NotificationActionsProps = {
      isUnread: true,
      isAnimatingExit: true,
      onMarkAsRead: vi.fn(),
      onMarkAsUnread: vi.fn(),
    };

    renderWithProviders(<NotificationActions {...props} />);

    expect(
      screen.queryByTestId('notification-mark-as-read'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('notification-mark-as-unread'),
    ).not.toBeInTheDocument();
  });

  it('calls onMarkAsRead when mark-as-read is clicked', async () => {
    const onMarkAsReadMock = vi.fn();

    const props: NotificationActionsProps = {
      isUnread: true,
      isAnimatingExit: false,
      onMarkAsRead: onMarkAsReadMock,
      onMarkAsUnread: vi.fn(),
    };

    renderWithProviders(<NotificationActions {...props} />);

    await userEvent.click(screen.getByTestId('notification-mark-as-read'));

    expect(onMarkAsReadMock).toHaveBeenCalledOnce();
  });

  it('calls onMarkAsUnread when mark-as-unread is clicked', async () => {
    const onMarkAsUnreadMock = vi.fn();

    const props: NotificationActionsProps = {
      isUnread: false,
      isAnimatingExit: false,
      onMarkAsRead: vi.fn(),
      onMarkAsUnread: onMarkAsUnreadMock,
    };

    renderWithProviders(<NotificationActions {...props} />);

    await userEvent.click(screen.getByTestId('notification-mark-as-unread'));

    expect(onMarkAsUnreadMock).toHaveBeenCalledOnce();
  });
});
