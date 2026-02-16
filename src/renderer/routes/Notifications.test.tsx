import { render } from '@testing-library/react';

import { renderWithAppContext } from '../__helpers__/test-utils';
import {
  mockAtlassianCloudAccount,
  mockAtlassianCloudAccountTwo,
} from '../__mocks__/account-mocks';
import { mockAccountNotifications } from '../__mocks__/notifications-mocks';

import { AppContext, type AppContextState } from '../context/App';
import useAccountsStore from '../stores/useAccountsStore';
import { useSettingsStore } from '../stores/useSettingsStore';

import { Errors } from '../utils/errors';
import { NotificationsRoute } from './Notifications';

vi.mock('../components/notifications/AccountNotifications', () => ({
  AccountNotifications: (props: {
    account: { id: string };
    showAccountHeader: boolean;
  }) => {
    return (
      <div
        data-account-id={props.account.id}
        data-show-header={String(props.showAccountHeader)}
        data-testid="account-notifications"
      />
    );
  },
}));

vi.mock('../components/AllRead', () => ({
  AllRead: () => <p>AllRead</p>,
}));

vi.mock('../components/Oops', () => ({
  Oops: () => <p>Oops</p>,
}));

describe('renderer/routes/Notifications.tsx', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render account notifications when present', () => {
    useSettingsStore.setState({ showAccountHeader: false });
    useAccountsStore.getState().setAccounts([mockAtlassianCloudAccount]);

    const tree = renderWithAppContext(<NotificationsRoute />, {
      notifications: mockAccountNotifications,
      hasNotifications: true,
      status: 'success',
      globalError: null,
    });

    expect(tree.container).toMatchSnapshot();
  });

  it('should force account header when multiple accounts', () => {
    useSettingsStore.setState({ showAccountHeader: false });
    useAccountsStore
      .getState()
      .setAccounts([mockAtlassianCloudAccount, mockAtlassianCloudAccountTwo]);

    const tree = renderWithAppContext(<NotificationsRoute />, {
      notifications: mockAccountNotifications,
      hasNotifications: true,
      status: 'success',
      globalError: null,
    });

    expect(tree.container).toMatchSnapshot();
  });

  it('should render AllRead when there are no notifications and no errors', () => {
    const tree = renderWithAppContext(<NotificationsRoute />, {
      notifications: [],
      hasNotifications: false,
      status: 'success',
      globalError: null,
    });

    expect(tree.container).toMatchSnapshot();
  });

  it('should render Offline Error when not online', () => {
    const tree = renderWithAppContext(<NotificationsRoute />, {
      notifications: [],
      hasNotifications: false,
      status: 'success',
      globalError: null,
      isOnline: false,
    });

    expect(tree.container).toMatchSnapshot();
  });

  it.each([
    ['bad credentials', Errors.BAD_CREDENTIALS, Errors.BAD_CREDENTIALS],
    ['unknown error', Errors.UNKNOWN, Errors.UNKNOWN],
    ['default error', null, Errors.UNKNOWN],
  ])('should render Oops for %s', (_label, globalError) => {
    const tree = renderWithAppContext(<NotificationsRoute />, {
      notifications: [],
      hasNotifications: false,
      status: 'error',
      globalError,
    });

    expect(tree.container).toMatchSnapshot();
  });

  it('should keep previous state while loading', () => {
    useSettingsStore.setState({ showAccountHeader: false });

    const baseContext: AppContextState = {
      status: 'success',
      globalError: null,
      notifications: mockAccountNotifications,
      notificationCount: 2,
      hasNotifications: true,
      hasMoreAccountNotifications: false,
      fetchNotifications: vi.fn(),
      markNotificationsRead: vi.fn(),
      markNotificationsUnread: vi.fn(),
      focusedNotificationId: null,
      isOnline: true,
    };

    const tree = render(
      <AppContext.Provider value={baseContext}>
        <NotificationsRoute />
      </AppContext.Provider>,
    );

    expect(tree.container).toMatchSnapshot();

    tree.rerender(
      <AppContext.Provider
        value={{
          ...baseContext,
          status: 'loading',
          notifications: [],
          hasNotifications: false,
        }}
      >
        <NotificationsRoute />
      </AppContext.Provider>,
    );

    expect(tree.container).toMatchSnapshot();
  });
});
