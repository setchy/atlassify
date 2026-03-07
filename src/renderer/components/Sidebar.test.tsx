import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useThemeObserver } from '@atlaskit/tokens';

import { navigateMock, renderWithAppContext } from '../__helpers__/test-utils';
import { mockAtlassianCloudAccount } from '../__mocks__/account-mocks';
import {
  mockAccountNotifications,
  mockAccountNotificationsWithMorePages,
} from '../__mocks__/notifications-mocks';

import { useAccountsStore, useSettingsStore } from '../stores';

import * as comms from '../utils/system/comms';
import { Sidebar } from './Sidebar';

vi.mock('@atlaskit/tokens', async () => {
  const actual = await vi.importActual('@atlaskit/tokens');
  return {
    ...actual,
    useThemeObserver: vi.fn(() => ({ colorMode: 'light' })),
  };
});

import { useFiltersStore } from '../stores';

const mockThemeObserverColorMode = (mode: 'light' | 'dark') => {
  vi.mocked(useThemeObserver).mockReturnValue({ colorMode: mode });
};

describe('renderer/components/Sidebar.tsx', () => {
  const fetchNotificationsMock = vi.fn();
  const openExternalLinkSpy = vi
    .spyOn(comms, 'openExternalLink')
    .mockImplementation(vi.fn());

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('logged in', () => {
    it('should render itself & its children - light mode', () => {
      mockThemeObserverColorMode('light');
      useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });

      const tree = renderWithAppContext(<Sidebar />, {
        initialEntries: ['/'],
        notifications: mockAccountNotifications,
      });

      expect(tree.container).toMatchSnapshot();
    });

    it('should render itself & its children - dark mode', () => {
      mockThemeObserverColorMode('dark');
      useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });

      const tree = renderWithAppContext(<Sidebar />, {
        initialEntries: ['/'],
        notifications: mockAccountNotifications,
      });

      expect(tree.container).toMatchSnapshot();
    });
  });

  describe('logged out', () => {
    it('should render itself & its children - light mode', () => {
      mockThemeObserverColorMode('light');
      useAccountsStore.setState({ accounts: [] });

      const tree = renderWithAppContext(<Sidebar />, {
        initialEntries: ['/landing'],
        notifications: mockAccountNotifications,
      });

      expect(tree.container).toMatchSnapshot();
    });

    it('should render itself & its children - dark mode', () => {
      mockThemeObserverColorMode('dark');
      useAccountsStore.setState({ accounts: [] });

      const tree = renderWithAppContext(<Sidebar />, {
        notifications: mockAccountNotifications,
      });

      expect(tree.container).toMatchSnapshot();
    });
  });

  it('should navigate to home when clicking logo', async () => {
    renderWithAppContext(<Sidebar />);

    await userEvent.click(screen.getByTestId('sidebar-home'));

    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith('/', { replace: true });
  });

  describe('notifications icon', () => {
    it('opens notifications home when clicked', async () => {
      renderWithAppContext(<Sidebar />);

      await userEvent.click(screen.getByTestId('sidebar-notifications'));

      expect(openExternalLinkSpy).toHaveBeenCalledWith(
        'https://team.atlassian.com/notifications',
      );
    });

    it('renders correct icon when there are no notifications', () => {
      renderWithAppContext(<Sidebar />, {
        notifications: [],
      });

      expect(screen.getByTestId('sidebar-notifications')).toMatchSnapshot();
    });

    it('renders correct icon when there are notifications', () => {
      renderWithAppContext(<Sidebar />, {
        notifications: mockAccountNotifications,
      });

      expect(screen.getByTestId('sidebar-notifications')).toMatchSnapshot();
    });

    it('renders correct icon when there are more notifications available', () => {
      renderWithAppContext(<Sidebar />, {
        notifications: mockAccountNotificationsWithMorePages,
      });

      expect(screen.getByTestId('sidebar-notifications')).toMatchSnapshot();
    });
  });

  describe('show read / unread notifications', () => {
    it('renders correct icon when in unread only mode', () => {
      useSettingsStore.setState({ fetchOnlyUnreadNotifications: true });

      renderWithAppContext(<Sidebar />);

      expect(screen.getByTestId('sidebar-notifications')).toMatchSnapshot();
    });

    it('renders correct icon when in unread and read mode', () => {
      useSettingsStore.setState({ fetchOnlyUnreadNotifications: false });

      renderWithAppContext(<Sidebar />);

      expect(screen.getByTestId('sidebar-notifications')).toMatchSnapshot();
    });

    it('should toggle show only unread notifications', async () => {
      useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });

      renderWithAppContext(<Sidebar />);

      expect(
        screen.getByTestId('sidebar-toggle-unread-only--input'),
      ).toBeChecked();

      await userEvent.click(
        screen.getByTestId('sidebar-toggle-unread-only--toggle-cross-icon'),
      );

      expect(
        screen.getByTestId('sidebar-toggle-unread-only--input'),
      ).not.toBeChecked();
    });
  });

  describe('Group by products', () => {
    it('should order notifications by date', () => {
      useSettingsStore.setState({ groupNotificationsByProduct: false });
      useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });

      renderWithAppContext(<Sidebar />);

      expect(screen.getByTestId('sidebar-group-by-product')).toMatchSnapshot();
    });

    it('should group notifications by product', () => {
      useSettingsStore.setState({ groupNotificationsByProduct: true });
      useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });

      renderWithAppContext(<Sidebar />);

      expect(screen.getByTestId('sidebar-group-by-product')).toMatchSnapshot();
    });

    it('should toggle group notifications by products', async () => {
      useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });

      renderWithAppContext(<Sidebar />);

      await userEvent.click(screen.getByTestId('sidebar-group-by-product'));

      expect(screen.getByTestId('sidebar-group-by-product')).toMatchSnapshot();
    });
  });

  describe('Group by titles', () => {
    it('should group notifications by title', () => {
      useSettingsStore.setState({ groupNotificationsByTitle: true });
      useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });

      renderWithAppContext(<Sidebar />);

      expect(screen.getByTestId('sidebar-group-by-title')).toMatchSnapshot();
    });

    it('should not group notifications by title - flat notifications', () => {
      useSettingsStore.setState({ groupNotificationsByTitle: false });
      useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });

      renderWithAppContext(<Sidebar />);

      expect(screen.getByTestId('sidebar-group-by-title')).toMatchSnapshot();
    });

    it('should toggle group notifications by title', async () => {
      useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });

      renderWithAppContext(<Sidebar />);

      await userEvent.click(screen.getByTestId('sidebar-group-by-title'));

      expect(screen.getByTestId('sidebar-group-by-title')).toMatchSnapshot();
    });
  });

  describe('Filter notifications', () => {
    it('go to the filters route', async () => {
      useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });

      renderWithAppContext(<Sidebar />);

      await userEvent.click(screen.getByTestId('sidebar-filter-notifications'));

      expect(
        screen.getByTestId('sidebar-filter-notifications'),
      ).toMatchSnapshot();
      expect(navigateMock).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledWith('/filters');
    });

    it('go to the home if filters path already shown', async () => {
      useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });

      renderWithAppContext(<Sidebar />, {
        initialEntries: ['/filters'],
      });

      await userEvent.click(screen.getByTestId('sidebar-filter-notifications'));

      expect(
        screen.getByTestId('sidebar-filter-notifications'),
      ).toMatchSnapshot();
      expect(navigateMock).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledWith('/', { replace: true });
    });

    it('highlight filters sidebar if any are saved', () => {
      useFiltersStore.setState({ products: ['bitbucket'] });
      useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });

      renderWithAppContext(<Sidebar />);

      expect(
        screen.getByTestId('sidebar-filter-notifications'),
      ).toMatchSnapshot();
    });
  });

  describe('Refresh Notifications', () => {
    it('should refresh the notifications when status is not loading', async () => {
      useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });

      renderWithAppContext(<Sidebar />, {
        fetchNotifications: fetchNotificationsMock,
      });

      await userEvent.click(screen.getByTestId('sidebar-refresh'));

      expect(fetchNotificationsMock).toHaveBeenCalledTimes(1);
    });

    it('should not refresh the notifications when status is loading', async () => {
      useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });
      renderWithAppContext(<Sidebar />, {
        fetchNotifications: fetchNotificationsMock,
        isLoading: true,
      });

      await userEvent.click(screen.getByTestId('sidebar-refresh'));

      expect(fetchNotificationsMock).not.toHaveBeenCalled();
    });
  });

  describe('Settings', () => {
    it('go to the settings route', async () => {
      useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });

      renderWithAppContext(<Sidebar />);

      await userEvent.click(screen.getByTestId('sidebar-settings'));

      expect(navigateMock).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledWith('/settings');
    });

    it('go to the home if settings path already shown', async () => {
      useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });

      renderWithAppContext(<Sidebar />, {
        initialEntries: ['/settings'],
        fetchNotifications: fetchNotificationsMock,
      });

      await userEvent.click(screen.getByTestId('sidebar-settings'));

      expect(fetchNotificationsMock).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledWith('/', { replace: true });
    });
  });

  it('should quit the app', async () => {
    const quitAppSpy = vi.spyOn(comms, 'quitApp');
    useAccountsStore.setState({ accounts: [] });

    renderWithAppContext(<Sidebar />);

    await userEvent.click(screen.getByTestId('sidebar-quit'));

    expect(quitAppSpy).toHaveBeenCalledTimes(1);
  });
});
