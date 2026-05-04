import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '../../__helpers__/test-utils';
import { mockSingleAtlassifyNotification } from '../../__mocks__/notifications-mocks';

import {
  NotificationContent,
  type NotificationContentProps,
} from './NotificationContent';

describe('renderer/components/notifications/NotificationContent.tsx', () => {
  vi.spyOn(globalThis.Date, 'now').mockImplementation(() =>
    new Date('2024').valueOf(),
  );

  it('renders notification message, body and footer', () => {
    const props: NotificationContentProps = {
      notification: mockSingleAtlassifyNotification,
      bodyText: 'PR-123 Fix the bug',
      footerText: 'myorg/notifications-test',
      onClick: vi.fn(),
    };

    const tree = renderWithProviders(<NotificationContent {...props} />);

    expect(tree.container).toMatchSnapshot();
  });

  it('hides entity section when bodyText is empty', () => {
    const props: NotificationContentProps = {
      notification: mockSingleAtlassifyNotification,
      bodyText: '',
      footerText: 'myorg/notifications-test',
      onClick: vi.fn(),
    };

    const tree = renderWithProviders(<NotificationContent {...props} />);

    expect(tree.container).toMatchSnapshot();
  });

  it('renders entity iconUrl as avatar when present', () => {
    const props: NotificationContentProps = {
      notification: mockSingleAtlassifyNotification,
      bodyText: 'PR-123 Fix the bug',
      footerText: 'myorg/notifications-test',
      onClick: vi.fn(),
    };

    const tree = renderWithProviders(<NotificationContent {...props} />);

    expect(tree.container).toMatchSnapshot();
  });

  it('falls back to product logo when entity iconUrl is null', () => {
    const props: NotificationContentProps = {
      notification: {
        ...mockSingleAtlassifyNotification,
        entity: {
          ...mockSingleAtlassifyNotification.entity,
          iconUrl: null,
        },
      },
      bodyText: 'PR-123 Fix the bug',
      footerText: 'myorg/notifications-test',
      onClick: vi.fn(),
    };

    const tree = renderWithProviders(<NotificationContent {...props} />);

    expect(tree.container).toMatchSnapshot();
  });

  it('renders group info with named actors when group size > 1', () => {
    const notification = {
      ...mockSingleAtlassifyNotification,
      notificationGroup: {
        ...mockSingleAtlassifyNotification.notificationGroup,
        size: 3,
        additionalActors: [
          { displayName: 'User 1', avatarURL: null },
          { displayName: 'User 2', avatarURL: null },
        ],
      },
    };

    const props: NotificationContentProps = {
      notification,
      bodyText: 'PR-123 Fix the bug',
      footerText: 'myorg/notifications-test',
      onClick: vi.fn(),
    };

    const tree = renderWithProviders(<NotificationContent {...props} />);

    expect(tree.container).toMatchSnapshot();
  });

  it('renders group info with unnamed actors when group size > 1', () => {
    const notification = {
      ...mockSingleAtlassifyNotification,
      notificationGroup: {
        ...mockSingleAtlassifyNotification.notificationGroup,
        size: 3,
        additionalActors: [],
      },
    };

    const props: NotificationContentProps = {
      notification,
      bodyText: 'PR-123 Fix the bug',
      footerText: 'myorg/notifications-test',
      onClick: vi.fn(),
    };

    const tree = renderWithProviders(<NotificationContent {...props} />);

    expect(tree.container).toMatchSnapshot();
  });

  it('calls onClick when content is clicked', async () => {
    const onClickMock = vi.fn();

    const props: NotificationContentProps = {
      notification: mockSingleAtlassifyNotification,
      bodyText: 'PR-123 Fix the bug',
      footerText: 'myorg/notifications-test',
      onClick: onClickMock,
    };

    renderWithProviders(<NotificationContent {...props} />);

    await userEvent.click(screen.getByTestId('notification-details'));

    expect(onClickMock).toHaveBeenCalledOnce();
  });
});
