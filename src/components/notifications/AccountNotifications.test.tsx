import { act, fireEvent, render, screen } from '@testing-library/react';
import { mockAtlassifyNotifications } from '../../__mocks__/notifications-mocks';
import {
  mockAtlassianCloudAccount,
  mockSettings,
} from '../../__mocks__/state-mocks';
import { ensureStableEmojis, mockDirectoryPath } from '../../__mocks__/utils';
import { AppContext } from '../../context/App';
import * as links from '../../utils/links';
import { AccountNotifications } from './AccountNotifications';

jest.mock('./ProductNotifications', () => ({
  ProductNotifications: () => <div>Product Notifications</div>,
}));

describe('components/notifications/AccountNotifications.tsx', () => {
  beforeEach(() => {
    ensureStableEmojis();
    mockDirectoryPath();
  });

  describe('account view types', () => {
    it('should render itself - sort by date', () => {
      const props = {
        account: mockAtlassianCloudAccount,
        notifications: mockAtlassifyNotifications,
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

    it('should render itself - group notifications by products', () => {
      const props = {
        account: mockAtlassianCloudAccount,
        notifications: mockAtlassifyNotifications,
        error: null,
      };

      const tree = render(
        <AppContext.Provider
          value={{
            settings: { ...mockSettings, groupNotificationsByProduct: true },
          }}
        >
          <AccountNotifications {...props} />
        </AppContext.Provider>,
      );

      expect(tree).toMatchSnapshot();
    });

    it('should render itself - no notifications', () => {
      const props = {
        account: mockAtlassianCloudAccount,
        notifications: [],
        error: null,
      };

      const tree = render(
        <AppContext.Provider value={{ settings: mockSettings }}>
          <AccountNotifications {...props} />
        </AppContext.Provider>,
      );

      expect(tree).toMatchSnapshot();
    });

    it('should render itself - account error', () => {
      const props = {
        account: mockAtlassianCloudAccount,
        notifications: [],
        error: {
          title: 'Error title',
          descriptions: ['Error description'],
          emojis: ['🔥'],
        },
      };

      const tree = render(
        <AppContext.Provider value={{ settings: mockSettings }}>
          <AccountNotifications {...props} />
        </AppContext.Provider>,
      );

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
      error: null,
    };

    await act(async () => {
      render(
        <AppContext.Provider value={{ settings: mockSettings }}>
          <AccountNotifications {...props} />
        </AppContext.Provider>,
      );
    });

    fireEvent.click(screen.getByTestId('account-profile--itemInner'));

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
      error: null,
    };

    await act(async () => {
      render(
        <AppContext.Provider value={{ settings: mockSettings }}>
          <AccountNotifications {...props} />
        </AppContext.Provider>,
      );
    });

    fireEvent.click(screen.getByTestId('account-pull-requests'));

    expect(openMyPullRequestsMock).toHaveBeenCalledTimes(1);
  });

  it('should mark all account notifications as read', async () => {
    const props = {
      account: mockAtlassianCloudAccount,
      notifications: mockAtlassifyNotifications,
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

    fireEvent.click(screen.getByTestId('account-mark-as-read'));

    expect(markNotificationsReadMock).toHaveBeenCalledTimes(1);
  });

  it('should toggle account notifications visibility', async () => {
    const props = {
      account: mockAtlassianCloudAccount,
      notifications: mockAtlassifyNotifications,
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

    fireEvent.click(screen.getByTestId('account-toggle'));

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
