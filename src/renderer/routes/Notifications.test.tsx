import { renderWithProviders } from '../__helpers__/test-utils';
import {
  mockAtlassianCloudAccount,
  mockAtlassianCloudAccountTwo,
} from '../__mocks__/account-mocks';
import { mockAccountNotifications } from '../__mocks__/notifications-mocks';

import { Errors } from '../utils/core/errors';
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

vi.mock('../components/Loading', () => ({
  Loading: () => <p>Loading</p>,
}));

vi.mock('../components/Oops', () => ({
  Oops: () => <p>Oops</p>,
}));

describe('renderer/routes/Notifications.tsx', () => {
  it('should render account notifications when present', () => {
    const tree = renderWithProviders(<NotificationsRoute />, {
      accounts: { accounts: [mockAtlassianCloudAccount] },
      settings: { showAccountHeader: false },
      notifications: mockAccountNotifications,
      hasNotifications: true,
      isLoading: false,
      isFetching: false,
      isErrorOrPaused: false,
      globalError: null,
    });

    expect(tree.container).toMatchSnapshot();
  });

  it('should force account header when multiple accounts', () => {
    const tree = renderWithProviders(<NotificationsRoute />, {
      accounts: {
        accounts: [mockAtlassianCloudAccount, mockAtlassianCloudAccountTwo],
      },
      settings: { showAccountHeader: false },
      notifications: mockAccountNotifications,
      hasNotifications: true,
      isLoading: false,
      isFetching: false,
      isErrorOrPaused: false,
      globalError: null,
    });

    expect(tree.container).toMatchSnapshot();
  });

  it('should render Loading on first startup when loading and no notifications', () => {
    const tree = renderWithProviders(<NotificationsRoute />, {
      notifications: [],
      hasNotifications: false,
      isLoading: true,
      isFetching: false,
      isErrorOrPaused: false,
      globalError: null,
    });

    expect(tree.container).toMatchSnapshot();
  });

  it('should render AllRead when there are no notifications and no errors', () => {
    const tree = renderWithProviders(<NotificationsRoute />, {
      notifications: [],
      hasNotifications: false,
      isLoading: false,
      isFetching: false,
      isErrorOrPaused: false,
      globalError: null,
    });

    expect(tree.container).toMatchSnapshot();
  });

  it('should show notifications while loading when data already exists', () => {
    const tree = renderWithProviders(<NotificationsRoute />, {
      accounts: { accounts: [mockAtlassianCloudAccount] },
      settings: { showAccountHeader: false },
      notifications: mockAccountNotifications,
      hasNotifications: true,
      isFetching: true,
      globalError: null,
    });

    expect(tree.container).toMatchSnapshot();
  });

  it('should render AllRead when loading a background refresh with an empty inbox', () => {
    const tree = renderWithProviders(<NotificationsRoute />, {
      notifications: [],
      hasNotifications: false,
      isLoading: false,
      isFetching: true,
      globalError: null,
    });

    expect(tree.container).toMatchSnapshot();
  });

  it('should render Offline Error when not online', () => {
    const tree = renderWithProviders(<NotificationsRoute />, {
      notifications: [],
      hasNotifications: false,
      globalError: null,
      isOnline: false,
    });

    expect(tree.container).toMatchSnapshot();
  });

  it.each([
    ['bad credentials', Errors.BAD_CREDENTIALS],
    ['unknown error', Errors.UNKNOWN],
    ['default error', null],
  ])('should render Oops for %s', (_label, globalError) => {
    const tree = renderWithProviders(<NotificationsRoute />, {
      notifications: [],
      hasNotifications: false,
      isErrorOrPaused: true,
      globalError,
    });

    expect(tree.container).toMatchSnapshot();
  });
});
