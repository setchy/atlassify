import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  ensureStableEmojis,
  renderWithAppContext,
} from '../../__helpers__/test-utils';
import { mockAtlassianCloudAccount } from '../../__mocks__/account-mocks';
import { mockAtlassifyNotifications } from '../../__mocks__/notifications-mocks';

import * as links from '../../utils/links';
import * as theme from '../../utils/theme';
import {
  AccountNotifications,
  type AccountNotificationsProps,
} from './AccountNotifications';

jest.mock('./ProductNotifications', () => ({
  ProductNotifications: () => <div>ProductNotifications</div>,
}));

describe('renderer/components/notifications/AccountNotifications.tsx', () => {
  beforeEach(() => {
    ensureStableEmojis();
  });

  describe('account view types', () => {
    it('should render itself - sort by date - light mode', () => {
      jest.spyOn(theme, 'isLightMode').mockReturnValue(true);

      const props: AccountNotificationsProps = {
        account: mockAtlassianCloudAccount,
        notifications: mockAtlassifyNotifications,
        hasMoreNotifications: false,
        error: null,
      };

      const tree = renderWithAppContext(<AccountNotifications {...props} />);

      expect(tree).toMatchSnapshot();
    });

    it('should render itself - sort by date - dark mode', () => {
      jest.spyOn(theme, 'isLightMode').mockReturnValue(false);

      const props: AccountNotificationsProps = {
        account: mockAtlassianCloudAccount,
        notifications: mockAtlassifyNotifications,
        hasMoreNotifications: false,
        error: null,
      };

      const tree = renderWithAppContext(<AccountNotifications {...props} />);

      expect(tree).toMatchSnapshot();
    });

    it('should render itself - group notifications by products - ordered by datetime', () => {
      const props: AccountNotificationsProps = {
        account: mockAtlassianCloudAccount,
        notifications: mockAtlassifyNotifications,
        hasMoreNotifications: false,
        error: null,
      };

      const tree = renderWithAppContext(<AccountNotifications {...props} />, {
        settings: {
          groupNotificationsByProduct: true,
          groupNotificationsByProductAlphabetically: false,
        },
      });

      expect(tree).toMatchSnapshot();
    });

    it('should render itself - group notifications by products - ordered by products alphabetically', () => {
      const props: AccountNotificationsProps = {
        account: mockAtlassianCloudAccount,
        notifications: mockAtlassifyNotifications,
        hasMoreNotifications: false,
        error: null,
      };

      const tree = renderWithAppContext(<AccountNotifications {...props} />, {
        settings: {
          groupNotificationsByProduct: true,
          groupNotificationsByProductAlphabetically: true,
        },
      });

      expect(tree).toMatchSnapshot();
    });

    it('should render itself - no notifications', async () => {
      const props: AccountNotificationsProps = {
        account: mockAtlassianCloudAccount,
        notifications: [],
        hasMoreNotifications: false,
        error: null,
      };

      let tree: ReturnType<typeof renderWithAppContext> | null = null;

      await act(async () => {
        tree = renderWithAppContext(<AccountNotifications {...props} />);
      });

      expect(tree).toMatchSnapshot();
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
      };

      let tree: ReturnType<typeof renderWithAppContext> | null = null;

      await act(async () => {
        tree = renderWithAppContext(<AccountNotifications {...props} />);
      });

      expect(tree).toMatchSnapshot();
    });
  });

  it('should open profile when clicked', async () => {
    const openAccountProfileSpy = jest
      .spyOn(links, 'openAccountProfile')
      .mockImplementation();

    const props: AccountNotificationsProps = {
      account: mockAtlassianCloudAccount,
      notifications: [],
      hasMoreNotifications: false,
      error: null,
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
    const openPullRequestsSpy = jest
      .spyOn(links, 'openMyPullRequests')
      .mockImplementation();

    const props: AccountNotificationsProps = {
      account: mockAtlassianCloudAccount,
      notifications: [],
      hasMoreNotifications: false,
      error: null,
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
    };

    const markNotificationsReadMock = jest.fn();

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
    };

    const markNotificationsReadMock = jest.fn();

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
    };

    await act(async () => {
      renderWithAppContext(<AccountNotifications {...props} />);
    });

    await userEvent.click(screen.getByTestId('account-toggle'));

    const tree = renderWithAppContext(<AccountNotifications {...props} />);
    expect(tree).toMatchSnapshot();
  });
});
