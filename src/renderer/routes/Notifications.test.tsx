import { renderWithAppContext } from '../__helpers__/test-utils';
import {
  mockAtlassianCloudAccount,
  mockAtlassianCloudAccountTwo,
} from '../__mocks__/account-mocks';
import { mockAccountNotifications } from '../__mocks__/notifications-mocks';

import { useAccountsStore, useSettingsStore } from '../stores';

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
    useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });

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
    useAccountsStore.setState({
      accounts: [mockAtlassianCloudAccount, mockAtlassianCloudAccountTwo],
    });

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
    ['bad credentials', Errors.BAD_CREDENTIALS],
    ['unknown error', Errors.UNKNOWN],
    ['default error', null],
  ])('should render Oops for %s', (_label, globalError) => {
    const tree = renderWithAppContext(<NotificationsRoute />, {
      notifications: [],
      hasNotifications: false,
      status: 'error',
      globalError,
    });

    expect(tree.container).toMatchSnapshot();
  });
});
