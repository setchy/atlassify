import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { vi } from 'vitest';

import {
  ensureStableEmojis,
  renderWithAppContext,
} from '../../__helpers__/test-utils';
import { mockAtlassianCloudAccount } from '../../__mocks__/account-mocks';
import { mockAtlassifyNotifications } from '../../__mocks__/notifications-mocks';

import useSettingsStore from '../../stores/useSettingsStore';

import * as links from '../../utils/links';
import * as theme from '../../utils/theme';
import {
  AccountNotifications,
  type AccountNotificationsProps,
} from './AccountNotifications';

vi.mock('./ProductNotifications', () => ({
  ProductNotifications: () => <div>ProductNotifications</div>,
}));

describe('renderer/components/notifications/AccountNotifications.tsx', () => {
  beforeEach(() => {
    ensureStableEmojis();
  });

  describe('account view types', () => {
    it('should render itself - sort by date - light mode', () => {
      vi.spyOn(theme, 'isLightMode').mockReturnValue(true);

      const props: AccountNotificationsProps = {
        account: mockAtlassianCloudAccount,
        notifications: mockAtlassifyNotifications,
        hasMoreNotifications: false,
        error: null,
        showAccountHeader: true,
      };

      const tree = renderWithAppContext(<AccountNotifications {...props} />);

      expect(tree.container).toMatchSnapshot();
    });

    it('should render itself - sort by date - dark mode', () => {
      vi.spyOn(theme, 'isLightMode').mockReturnValue(false);

      const props: AccountNotificationsProps = {
        account: mockAtlassianCloudAccount,
        notifications: mockAtlassifyNotifications,
        hasMoreNotifications: false,
        error: null,
        showAccountHeader: true,
      };

      const tree = renderWithAppContext(<AccountNotifications {...props} />);

      expect(tree.container).toMatchSnapshot();
    });

    it('should render itself - group notifications by products - ordered by datetime', () => {
      useSettingsStore.setState({
        groupNotificationsByProduct: true,
        groupNotificationsByProductAlphabetically: false,
      });

      const props: AccountNotificationsProps = {
        account: mockAtlassianCloudAccount,
        notifications: mockAtlassifyNotifications,
        hasMoreNotifications: false,
        error: null,
        showAccountHeader: true,
      };

      const tree = renderWithAppContext(<AccountNotifications {...props} />);

      expect(tree.container).toMatchSnapshot();
    });

    it('should render itself - group notifications by products - ordered by products alphabetically', () => {
      useSettingsStore.setState({
        groupNotificationsByProduct: true,
        groupNotificationsByProductAlphabetically: true,
      });

      const props: AccountNotificationsProps = {
        account: mockAtlassianCloudAccount,
        notifications: mockAtlassifyNotifications,
        hasMoreNotifications: false,
        error: null,
        showAccountHeader: true,
      };

      const tree = renderWithAppContext(<AccountNotifications {...props} />);

      expect(tree.container).toMatchSnapshot();
    });

    it('should render itself - no notifications', async () => {
      const props: AccountNotificationsProps = {
        account: mockAtlassianCloudAccount,
        notifications: [],
        hasMoreNotifications: false,
        error: null,
        showAccountHeader: true,
      };

      await act(async () => {
        renderWithAppContext(<AccountNotifications {...props} />);
      });

      expect(screen.getByText('No new notifications')).toBeInTheDocument();
    });

    it('should render itself - account error', async () => {
      const props: AccountNotificationsProps = {
        account: mockAtlassianCloudAccount,
        notifications: [],
        hasMoreNotifications: false,
        error: {
          title: 'Error title',
          descriptions: ['Error description'],
          emojis: ['🔥'],
        },
        showAccountHeader: true,
      };

      await act(async () => {
        renderWithAppContext(<AccountNotifications {...props} />);
      });

      expect(screen.getByText('Error title')).toBeInTheDocument();
      expect(screen.getByText('Error description')).toBeInTheDocument();
    });

    it('should hide the account header when disabled', () => {
      const props: AccountNotificationsProps = {
        account: mockAtlassianCloudAccount,
        notifications: mockAtlassifyNotifications,
        hasMoreNotifications: false,
        error: null,
        showAccountHeader: false,
      };

      renderWithAppContext(<AccountNotifications {...props} />);

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

    const props: AccountNotificationsProps = {
      account: mockAtlassianCloudAccount,
      notifications: [],
      hasMoreNotifications: false,
      error: null,
      showAccountHeader: true,
    };

    await act(async () => {
      renderWithAppContext(<AccountNotifications {...props} />);
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

    const props: AccountNotificationsProps = {
      account: mockAtlassianCloudAccount,
      notifications: [],
      hasMoreNotifications: false,
      error: null,
      showAccountHeader: true,
    };

    await act(async () => {
      renderWithAppContext(<AccountNotifications {...props} />);
    });

    await userEvent.click(screen.getByTestId('account-pull-requests'));

    expect(openPullRequestsSpy).toHaveBeenCalledTimes(1);
  });

  it('should mark all account notifications as read when `confirmed`', async () => {
    const props: AccountNotificationsProps = {
      account: mockAtlassianCloudAccount,
      notifications: mockAtlassifyNotifications,
      hasMoreNotifications: false,
      error: null,
      showAccountHeader: true,
    };

    const markNotificationsReadMock = vi.fn();

    await act(async () => {
      renderWithAppContext(<AccountNotifications {...props} />, {
        markNotificationsRead: markNotificationsReadMock,
      });
    });

    await userEvent.click(screen.getByTestId('account-mark-as-read'));
    await userEvent.click(screen.getByTestId('account-mark-as-read-confirm'));

    expect(markNotificationsReadMock).toHaveBeenCalledTimes(1);
  });

  it('should skip marking all account notifications as read when `cancelled`', async () => {
    const props: AccountNotificationsProps = {
      account: mockAtlassianCloudAccount,
      notifications: mockAtlassifyNotifications,
      hasMoreNotifications: false,
      error: null,
      showAccountHeader: true,
    };

    const markNotificationsReadMock = vi.fn();

    await act(async () => {
      renderWithAppContext(<AccountNotifications {...props} />, {
        markNotificationsRead: markNotificationsReadMock,
      });
    });

    await userEvent.click(screen.getByTestId('account-mark-as-read'));
    await userEvent.click(screen.getByTestId('account-mark-as-read-cancel'));

    expect(markNotificationsReadMock).not.toHaveBeenCalled();
  });

  it('should toggle account notifications visibility', async () => {
    const props: AccountNotificationsProps = {
      account: mockAtlassianCloudAccount,
      notifications: mockAtlassifyNotifications,
      hasMoreNotifications: false,
      error: null,
      showAccountHeader: true,
    };

    await act(async () => {
      renderWithAppContext(<AccountNotifications {...props} />);
    });

    expect(
      screen.getAllByTestId('notification-details').length,
    ).toBeGreaterThan(0);

    await userEvent.click(screen.getByTestId('account-toggle'));

    expect(screen.queryAllByTestId('notification-details')).toHaveLength(0);
  });
});
