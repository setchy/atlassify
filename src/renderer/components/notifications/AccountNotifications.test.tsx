import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '../../__helpers__/test-utils';
import { mockAtlassianCloudAccount } from '../../__mocks__/account-mocks';
import { mockAccountNotifications } from '../../__mocks__/notifications-mocks';

import * as links from '../../utils/system/links';
import * as theme from '../../utils/ui/theme';
import {
  AccountNotifications,
  type AccountNotificationsProps,
} from './AccountNotifications';

vi.mock('./ProductNotifications', () => ({
  ProductNotifications: () => <div>ProductNotifications</div>,
}));

const createProps = (
  overrides: Partial<AccountNotificationsProps> = {},
): AccountNotificationsProps => ({
  account: mockAtlassianCloudAccount,
  notifications: mockAccountNotifications[0].notifications,
  groupedNotifications: mockAccountNotifications[0].groupedNotifications,
  hasMoreNotifications: false,
  error: null,
  showAccountHeader: true,
  ...overrides,
});

describe('renderer/components/notifications/AccountNotifications.tsx', () => {
  describe('account view types', () => {
    it('should render itself - sort by date - light mode', () => {
      vi.spyOn(theme, 'isLightMode').mockReturnValue(true);

      const tree = renderWithProviders(
        <AccountNotifications {...createProps()} />,
      );

      expect(tree.container).toMatchSnapshot();
    });

    it('should render itself - sort by date - dark mode', () => {
      vi.spyOn(theme, 'isLightMode').mockReturnValue(false);

      const tree = renderWithProviders(
        <AccountNotifications {...createProps()} />,
      );

      expect(tree.container).toMatchSnapshot();
    });

    it('should render itself - group notifications by products - ordered by datetime', () => {
      const tree = renderWithProviders(
        <AccountNotifications {...createProps()} />,
        {
          settings: {
            groupNotificationsByProduct: true,
            groupNotificationsByProductAlphabetically: false,
          },
        },
      );

      expect(tree.container).toMatchSnapshot();
    });

    it('should render itself - group notifications by products - ordered by products alphabetically', () => {
      const tree = renderWithProviders(
        <AccountNotifications {...createProps()} />,
        {
          settings: {
            groupNotificationsByProduct: true,
            groupNotificationsByProductAlphabetically: true,
          },
        },
      );

      expect(tree.container).toMatchSnapshot();
    });

    it('should render itself - no notifications', async () => {
      await act(async () => {
        renderWithProviders(
          <AccountNotifications
            {...createProps({ notifications: [], groupedNotifications: {} })}
          />,
        );
      });

      expect(screen.getByText('No new notifications')).toBeInTheDocument();
    });

    it('should render itself - account error', async () => {
      await act(async () => {
        renderWithProviders(
          <AccountNotifications
            {...createProps({
              notifications: [],
              groupedNotifications: {},
              error: {
                title: 'Error title',
                descriptions: ['Error description'],
                emojis: ['🔥'],
              },
            })}
          />,
        );
      });

      expect(screen.getByText('Error title')).toBeInTheDocument();
      expect(screen.getByText('Error description')).toBeInTheDocument();
    });

    it('should hide the account header when disabled', () => {
      renderWithProviders(
        <AccountNotifications {...createProps({ showAccountHeader: false })} />,
      );

      expect(
        screen.queryByTestId('account-profile--itemInner'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('account-pull-requests'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('account-mark-as-read'),
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('account-toggle')).not.toBeInTheDocument();
    });
  });
});

describe('account actions', () => {
  it('should open profile when clicked', async () => {
    const openAccountProfileSpy = vi
      .spyOn(links, 'openAccountProfile')
      .mockImplementation(vi.fn());

    await act(async () => {
      renderWithProviders(
        <AccountNotifications
          {...createProps({ notifications: [], groupedNotifications: {} })}
        />,
      );
    });

    await userEvent.click(screen.getByTestId('account-profile--itemInner'));

    expect(openAccountProfileSpy).toHaveBeenCalledTimes(1);
    expect(openAccountProfileSpy).toHaveBeenCalledWith(
      mockAtlassianCloudAccount,
    );
  });

  it('should open my pull requests', async () => {
    const openPullRequestsSpy = vi
      .spyOn(links, 'openMyPullRequests')
      .mockImplementation(vi.fn());

    await act(async () => {
      renderWithProviders(
        <AccountNotifications
          {...createProps({ notifications: [], groupedNotifications: {} })}
        />,
      );
    });

    await userEvent.click(screen.getByTestId('account-pull-requests'));

    expect(openPullRequestsSpy).toHaveBeenCalledTimes(1);
  });

  it('should mark all account notifications as read when `confirmed`', async () => {
    const markNotificationsReadMock = vi.fn();

    await act(async () => {
      renderWithProviders(<AccountNotifications {...createProps()} />, {
        markNotificationsRead: markNotificationsReadMock,
      });
    });

    await userEvent.click(screen.getByTestId('account-mark-as-read'));
    await userEvent.click(screen.getByTestId('account-mark-as-read-confirm'));

    expect(markNotificationsReadMock).toHaveBeenCalledTimes(1);
  });

  it('should skip marking all account notifications as read when `cancelled`', async () => {
    const markNotificationsReadMock = vi.fn();

    await act(async () => {
      renderWithProviders(<AccountNotifications {...createProps()} />, {
        markNotificationsRead: markNotificationsReadMock,
      });
    });

    await userEvent.click(screen.getByTestId('account-mark-as-read'));
    await userEvent.click(screen.getByTestId('account-mark-as-read-cancel'));

    expect(markNotificationsReadMock).not.toHaveBeenCalled();
  });

  it('should toggle account notifications visibility', async () => {
    await act(async () => {
      renderWithProviders(<AccountNotifications {...createProps()} />);
    });

    expect(
      screen.getAllByTestId('notification-details').length,
    ).toBeGreaterThan(0);

    await userEvent.click(screen.getByTestId('account-toggle'));

    expect(screen.queryAllByTestId('notification-details')).toHaveLength(0);
  });
});
