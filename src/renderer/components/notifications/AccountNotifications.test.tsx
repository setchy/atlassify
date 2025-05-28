import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { mockAtlassifyNotifications } from '../../__mocks__/notifications-mocks';
import {
  mockAtlassianCloudAccount,
  mockSettings,
} from '../../__mocks__/state-mocks';
import { ensureStableEmojis } from '../../__mocks__/utils';
import { AppContext } from '../../context/App';
import * as links from '../../utils/links';
import * as theme from '../../utils/theme';
import { AccountNotifications } from './AccountNotifications';

jest.mock('./ProductNotifications', () => ({
  ProductNotifications: () => <div>Product Notifications</div>,
}));

describe('renderer/components/notifications/AccountNotifications.tsx', () => {
  beforeEach(() => {
    ensureStableEmojis();
  });

  describe('account view types', () => {
    it('should render itself - sort by date - light mode', () => {
      jest.spyOn(theme, 'isLightMode').mockReturnValue(true);

      const props = {
        account: mockAtlassianCloudAccount,
        notifications: mockAtlassifyNotifications,
        hasMoreNotifications: false,
        error: null,
      };

      const tree = render(
        <AppContext.Provider
          value={{
            settings: mockSettings,
          }}
        >
          <AccountNotifications {...props} />
        </AppContext.Provider>,
      );

      expect(tree).toMatchSnapshot();
    });

    it('should render itself - sort by date - dark mode', () => {
      jest.spyOn(theme, 'isLightMode').mockReturnValue(false);

      const props = {
        account: mockAtlassianCloudAccount,
        notifications: mockAtlassifyNotifications,
        hasMoreNotifications: false,
        error: null,
      };

      const tree = render(
        <AppContext.Provider
          value={{
            settings: mockSettings,
          }}
        >
          <AccountNotifications {...props} />
        </AppContext.Provider>,
      );

      expect(tree).toMatchSnapshot();
    });

    it('should render itself - group notifications by products - ordered by datetime', () => {
      const props = {
        account: mockAtlassianCloudAccount,
        notifications: mockAtlassifyNotifications,
        hasMoreNotifications: false,
        error: null,
      };

      const tree = render(
        <AppContext.Provider
          value={{
            settings: {
              ...mockSettings,
              groupNotificationsByProduct: true,
              groupNotificationsByProductAlphabetically: false,
            },
          }}
        >
          <AccountNotifications {...props} />
        </AppContext.Provider>,
      );

      expect(tree).toMatchSnapshot();
    });

    it('should render itself - group notifications by products - ordered by products alphabetically', () => {
      const props = {
        account: mockAtlassianCloudAccount,
        notifications: mockAtlassifyNotifications,
        hasMoreNotifications: false,
        error: null,
      };

      const tree = render(
        <AppContext.Provider
          value={{
            settings: {
              ...mockSettings,
              groupNotificationsByProduct: true,
              groupNotificationsByProductAlphabetically: true,
            },
          }}
        >
          <AccountNotifications {...props} />
        </AppContext.Provider>,
      );

      expect(tree).toMatchSnapshot();
    });

    it('should render itself - no notifications', async () => {
      const props = {
        account: mockAtlassianCloudAccount,
        notifications: [],
        hasMoreNotifications: false,
        error: null,
      };

      let tree: ReturnType<typeof render> | null = null;

      await act(async () => {
        tree = render(
          <AppContext.Provider value={{ settings: mockSettings }}>
            <AccountNotifications {...props} />
          </AppContext.Provider>,
        );
      });

      expect(tree).toMatchSnapshot();
    });

    it('should render itself - account error', async () => {
      const props = {
        account: mockAtlassianCloudAccount,
        notifications: [],
        hasMoreNotifications: false,
        error: {
          title: 'Error title',
          descriptions: ['Error description'],
          emojis: ['🔥'],
        },
      };

      let tree: ReturnType<typeof render> | null = null;

      await act(async () => {
        tree = render(
          <AppContext.Provider value={{ settings: mockSettings }}>
            <AccountNotifications {...props} />
          </AppContext.Provider>,
        );
      });

      expect(tree).toMatchSnapshot();
    });
  });

  it('should open profile when clicked', async () => {
    const openAccountProfileMock = jest
      .spyOn(links, 'openAccountProfile')
      .mockImplementation();

    const props = {
      account: mockAtlassianCloudAccount,
      notifications: [],
      hasMoreNotifications: false,
      error: null,
    };

    await act(async () => {
      render(
        <AppContext.Provider value={{ settings: mockSettings }}>
          <AccountNotifications {...props} />
        </AppContext.Provider>,
      );
    });

    await userEvent.click(screen.getByTestId('account-profile--itemInner'));

    expect(openAccountProfileMock).toHaveBeenCalledTimes(1);
    expect(openAccountProfileMock).toHaveBeenCalledWith(
      mockAtlassianCloudAccount,
    );
  });

  it('should open my pull requests', async () => {
    const openMyPullRequestsMock = jest
      .spyOn(links, 'openMyPullRequests')
      .mockImplementation();

    const props = {
      account: mockAtlassianCloudAccount,
      notifications: [],
      hasMoreNotifications: false,
      error: null,
    };

    await act(async () => {
      render(
        <AppContext.Provider value={{ settings: mockSettings }}>
          <AccountNotifications {...props} />
        </AppContext.Provider>,
      );
    });

    await userEvent.click(screen.getByTestId('account-pull-requests'));

    expect(openMyPullRequestsMock).toHaveBeenCalledTimes(1);
  });

  it('should mark all account notifications as read when `confirmed`', async () => {
    const props = {
      account: mockAtlassianCloudAccount,
      notifications: mockAtlassifyNotifications,
      hasMoreNotifications: false,
      error: null,
    };

    const markNotificationsReadMock = jest.fn();

    await act(async () => {
      render(
        <AppContext.Provider
          value={{
            settings: mockSettings,
            markNotificationsRead: markNotificationsReadMock,
          }}
        >
          <AccountNotifications {...props} />
        </AppContext.Provider>,
      );
    });

    await userEvent.click(screen.getByTestId('account-mark-as-read'));
    await userEvent.click(screen.getByTestId('account-mark-as-read-confirm'));

    expect(markNotificationsReadMock).toHaveBeenCalledTimes(1);
  });

  it('should skip marking all account notifications as read when `cancelled`', async () => {
    const props = {
      account: mockAtlassianCloudAccount,
      notifications: mockAtlassifyNotifications,
      hasMoreNotifications: false,
      error: null,
    };

    const markNotificationsReadMock = jest.fn();

    await act(async () => {
      render(
        <AppContext.Provider
          value={{
            settings: mockSettings,
            markNotificationsRead: markNotificationsReadMock,
          }}
        >
          <AccountNotifications {...props} />
        </AppContext.Provider>,
      );
    });

    await userEvent.click(screen.getByTestId('account-mark-as-read'));
    await userEvent.click(screen.getByTestId('account-mark-as-read-cancel'));

    expect(markNotificationsReadMock).not.toHaveBeenCalled();
  });

  it('should toggle account notifications visibility', async () => {
    const props = {
      account: mockAtlassianCloudAccount,
      notifications: mockAtlassifyNotifications,
      hasMoreNotifications: false,
      error: null,
    };

    await act(async () => {
      render(
        <AppContext.Provider
          value={{
            settings: { ...mockSettings },
          }}
        >
          <AccountNotifications {...props} />
        </AppContext.Provider>,
      );
    });

    await userEvent.click(screen.getByTestId('account-toggle'));

    const tree = render(
      <AppContext.Provider
        value={{
          settings: { ...mockSettings },
        }}
      >
        <AccountNotifications {...props} />
      </AppContext.Provider>,
    );
    expect(tree).toMatchSnapshot();
  });
});
