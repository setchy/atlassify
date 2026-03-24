import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useThemeObserver } from '@atlaskit/tokens';

import { navigateMock, renderWithProviders } from '../__helpers__/test-utils';
import {
  mockAccountNotifications,
  mockAccountNotificationsWithMorePages,
} from '../__mocks__/notifications-mocks';

import * as comms from '../utils/system/comms';
import { Sidebar } from './Sidebar';

vi.mock('@atlaskit/tokens', async () => {
  const actual = await vi.importActual('@atlaskit/tokens');
  return {
    ...actual,
    useThemeObserver: vi.fn(() => ({ colorMode: 'light' })),
  };
});

const mockThemeObserverColorMode = (mode: 'light' | 'dark') => {
  vi.mocked(useThemeObserver).mockReturnValue({ colorMode: mode });
};

describe('renderer/components/Sidebar.tsx', () => {
  const fetchNotificationsMock = vi.fn();
  const openExternalLinkSpy = vi
    .spyOn(comms, 'openExternalLink')
    .mockImplementation(vi.fn());

  describe('logged in', () => {
    it('should render itself & its children - light mode', () => {
      mockThemeObserverColorMode('light');
      const tree = renderWithProviders(<Sidebar />, {
        initialEntries: ['/'],
        notifications: mockAccountNotifications,
      });

      expect(tree.container).toMatchSnapshot();
    });

    it('should render itself & its children - dark mode', () => {
      mockThemeObserverColorMode('dark');
      const tree = renderWithProviders(<Sidebar />, {
        initialEntries: ['/'],
        notifications: mockAccountNotifications,
      });

      expect(tree.container).toMatchSnapshot();
    });
  });

  describe('logged out', () => {
    it('should render itself & its children - light mode', () => {
      mockThemeObserverColorMode('light');

      const tree = renderWithProviders(<Sidebar />, {
        accounts: { accounts: [] },
        initialEntries: ['/landing'],
        notifications: mockAccountNotifications,
      });

      expect(tree.container).toMatchSnapshot();
    });

    it('should render itself & its children - dark mode', () => {
      mockThemeObserverColorMode('dark');

      const tree = renderWithProviders(<Sidebar />, {
        accounts: { accounts: [] },
        notifications: mockAccountNotifications,
      });

      expect(tree.container).toMatchSnapshot();
    });
  });

  it('should navigate to home when clicking logo', async () => {
    renderWithProviders(<Sidebar />);

    await userEvent.click(screen.getByTestId('sidebar-home'));

    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith('/', { replace: true });
  });

  describe('notifications icon', () => {
    it('opens notifications home when clicked', async () => {
      renderWithProviders(<Sidebar />);

      await userEvent.click(screen.getByTestId('sidebar-notifications'));

      expect(openExternalLinkSpy).toHaveBeenCalledWith(
        'https://team.atlassian.com/notifications',
      );
    });

    it('renders correct icon when there are no notifications', () => {
      renderWithProviders(<Sidebar />, {
        notifications: [],
      });

      expect(screen.getByTestId('sidebar-notifications')).toMatchSnapshot();
    });

    it('renders correct icon when there are notifications', () => {
      renderWithProviders(<Sidebar />, {
        notifications: mockAccountNotifications,
      });

      expect(screen.getByTestId('sidebar-notifications')).toMatchSnapshot();
    });

    it('renders correct icon when there are more notifications available', () => {
      renderWithProviders(<Sidebar />, {
        notifications: mockAccountNotificationsWithMorePages,
      });

      expect(screen.getByTestId('sidebar-notifications')).toMatchSnapshot();
    });
  });

  describe('show read / unread notifications', () => {
    it('renders correct icon when in unread only mode', () => {
      renderWithProviders(<Sidebar />, {
        settings: { fetchOnlyUnreadNotifications: true },
      });

      expect(screen.getByTestId('sidebar-notifications')).toMatchSnapshot();
    });

    it('renders correct icon when in unread and read mode', () => {
      renderWithProviders(<Sidebar />, {
        settings: { fetchOnlyUnreadNotifications: false },
      });

      expect(screen.getByTestId('sidebar-notifications')).toMatchSnapshot();
    });

    it('should toggle show only unread notifications', async () => {
      renderWithProviders(<Sidebar />);

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
      renderWithProviders(<Sidebar />, {
        settings: { groupBy: 'none' },
      });

      expect(screen.getByTestId('sidebar-group-by')).toMatchSnapshot();
    });

    it('should group notifications by product', () => {
      renderWithProviders(<Sidebar />, {
        settings: { groupBy: 'product' },
      });

      expect(screen.getByTestId('sidebar-group-by')).toMatchSnapshot();
    });

    it('should toggle group notifications by products', async () => {
      renderWithProviders(<Sidebar />);

      await userEvent.click(screen.getByTestId('sidebar-group-by'));

      expect(screen.getByTestId('sidebar-group-by')).toMatchSnapshot();
    });
  });

  describe('Group by titles', () => {
    it('should group notifications by title', () => {
      renderWithProviders(<Sidebar />, {
        settings: { groupNotificationsByTitle: true },
      });

      expect(screen.getByTestId('sidebar-group-by-title')).toMatchSnapshot();
    });

    it('should not group notifications by title - flat notifications', () => {
      renderWithProviders(<Sidebar />, {
        settings: { groupNotificationsByTitle: false },
      });

      expect(screen.getByTestId('sidebar-group-by-title')).toMatchSnapshot();
    });

    it('should toggle group notifications by title', async () => {
      renderWithProviders(<Sidebar />);

      await userEvent.click(screen.getByTestId('sidebar-group-by-title'));

      expect(screen.getByTestId('sidebar-group-by-title')).toMatchSnapshot();
    });
  });

  describe('Filter notifications', () => {
    it('go to the filters route', async () => {
      renderWithProviders(<Sidebar />);

      await userEvent.click(screen.getByTestId('sidebar-filter-notifications'));

      expect(
        screen.getByTestId('sidebar-filter-notifications'),
      ).toMatchSnapshot();
      expect(navigateMock).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledWith('/filters');
    });

    it('go to the home if filters path already shown', async () => {
      renderWithProviders(<Sidebar />, {
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
      renderWithProviders(<Sidebar />, {
        filters: { products: ['bitbucket'] },
      });

      expect(
        screen.getByTestId('sidebar-filter-notifications'),
      ).toMatchSnapshot();
    });
  });

  describe('Refresh Notifications', () => {
    it('should refresh the notifications when status is not loading', async () => {
      renderWithProviders(<Sidebar />, {
        fetchNotifications: fetchNotificationsMock,
      });

      await userEvent.click(screen.getByTestId('sidebar-refresh'));

      expect(fetchNotificationsMock).toHaveBeenCalledTimes(1);
    });

    it('should not refresh the notifications when status is loading', async () => {
      renderWithProviders(<Sidebar />, {
        fetchNotifications: fetchNotificationsMock,
        isLoading: true,
      });

      await userEvent.click(screen.getByTestId('sidebar-refresh'));

      expect(fetchNotificationsMock).not.toHaveBeenCalled();
    });
  });

  describe('Settings', () => {
    it('go to the settings route', async () => {
      renderWithProviders(<Sidebar />);

      await userEvent.click(screen.getByTestId('sidebar-settings'));

      expect(navigateMock).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledWith('/settings');
    });

    it('go to the home if settings path already shown', async () => {
      renderWithProviders(<Sidebar />, {
        initialEntries: ['/settings'],
      });

      await userEvent.click(screen.getByTestId('sidebar-settings'));

      expect(navigateMock).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledWith('/', { replace: true });
    });
  });

  it('should quit the app', async () => {
    const quitAppSpy = vi.spyOn(comms, 'quitApp');

    renderWithProviders(<Sidebar />, {
      accounts: { accounts: [] },
    });

    await userEvent.click(screen.getByTestId('sidebar-quit'));

    expect(quitAppSpy).toHaveBeenCalledTimes(1);
  });
});
