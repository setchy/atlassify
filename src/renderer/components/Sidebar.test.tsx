import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { useThemeObserver } from '@atlaskit/tokens';

import { renderWithAppContext } from '../__helpers__/test-utils';
import {
  mockAccountNotifications,
  mockAccountNotificationsWithMorePages,
} from '../__mocks__/notifications-mocks';
import * as comms from '../utils/comms';
import { Sidebar } from './Sidebar';

jest.mock('@atlaskit/tokens', () => {
  const actual = jest.requireActual('@atlaskit/tokens');
  return {
    ...actual,
    useThemeObserver: jest.fn(() => ({ colorMode: 'light' })),
  };
});

const mockThemeObserverColorMode = (mode: 'light' | 'dark') => {
  (useThemeObserver as jest.Mock).mockReturnValue({ colorMode: mode });
};

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('renderer/components/Sidebar.tsx', () => {
  const mockUpdateSettings = jest.fn();
  const mockFetchNotifications = jest.fn();
  const openExternalLinkSpy = jest
    .spyOn(comms, 'openExternalLink')
    .mockImplementation();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('logged in', () => {
    it('should render itself & its children - light mode', () => {
      mockThemeObserverColorMode('light');

      const tree = renderWithAppContext(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>,
        {
          notifications: mockAccountNotifications,
        },
      );

      expect(tree).toMatchSnapshot();
    });

    it('should render itself & its children - dark mode', () => {
      mockThemeObserverColorMode('dark');

      const tree = renderWithAppContext(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>,
        {
          notifications: mockAccountNotifications,
        },
      );

      expect(tree).toMatchSnapshot();
    });
  });

  describe('logged out', () => {
    it('should render itself & its children - light mode', () => {
      mockThemeObserverColorMode('light');

      const tree = renderWithAppContext(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>,
        {
          isLoggedIn: false,
          notifications: mockAccountNotifications,
        },
      );

      expect(tree).toMatchSnapshot();
    });

    it('should render itself & its children - dark mode', () => {
      mockThemeObserverColorMode('dark');

      const tree = renderWithAppContext(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>,
        {
          isLoggedIn: false,
          notifications: mockAccountNotifications,
        },
      );

      expect(tree).toMatchSnapshot();
    });
  });

  it('should navigate to home', async () => {
    renderWithAppContext(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
      {
        isLoggedIn: false,
        notifications: [],
        fetchNotifications: mockFetchNotifications,
      },
    );

    await userEvent.click(screen.getByTestId('sidebar-home'));

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  describe('notifications icon', () => {
    it('opens notifications home when clicked', async () => {
      renderWithAppContext(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>,
        {
          isLoggedIn: true,
          notifications: [],
        },
      );

      await userEvent.click(screen.getByTestId('sidebar-notifications'));

      expect(openExternalLinkSpy).toHaveBeenCalledWith(
        'https://team.atlassian.com/notifications',
      );
    });

    it('renders correct icon when there are no notifications', () => {
      renderWithAppContext(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>,
        {
          isLoggedIn: true,
          notifications: [],
        },
      );

      expect(screen.getByTestId('sidebar-notifications')).toMatchSnapshot();
    });

    it('renders correct icon when there are notifications', () => {
      renderWithAppContext(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>,
        {
          isLoggedIn: true,
          notifications: mockAccountNotifications,
        },
      );

      expect(screen.getByTestId('sidebar-notifications')).toMatchSnapshot();
    });

    it('renders correct icon when there are more notifications available', () => {
      renderWithAppContext(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>,
        {
          isLoggedIn: true,
          notifications: mockAccountNotificationsWithMorePages,
        },
      );

      expect(screen.getByTestId('sidebar-notifications')).toMatchSnapshot();
    });
  });

  describe('show read / unread notifications', () => {
    it('renders correct icon when in unread only mode', () => {
      renderWithAppContext(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>,
        {
          isLoggedIn: true,
          notifications: [],
          settings: { fetchOnlyUnreadNotifications: true },
        },
      );

      expect(screen.getByTestId('sidebar-notifications')).toMatchSnapshot();
    });

    it('renders correct icon when in unread and read mode', () => {
      renderWithAppContext(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>,
        {
          isLoggedIn: true,
          notifications: [],
          settings: { fetchOnlyUnreadNotifications: false },
        },
      );

      expect(screen.getByTestId('sidebar-notifications')).toMatchSnapshot();
    });

    it('should toggle show only unread notifications', async () => {
      renderWithAppContext(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>,
        {
          isLoggedIn: true,
          notifications: [],
          updateSetting: mockUpdateSettings,
        },
      );

      await userEvent.click(
        screen.getByTestId('sidebar-toggle-unread-only--toggle-cross-icon'),
      );

      expect(
        screen.getByTestId('sidebar-toggle-unread-only--input'),
      ).toMatchSnapshot();
    });
  });

  describe('Group by products', () => {
    it('should order notifications by date', () => {
      renderWithAppContext(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>,
        {
          isLoggedIn: true,
          notifications: [],
        },
      );

      expect(screen.getByTestId('sidebar-group-by-product')).toMatchSnapshot();
    });

    it('should group notifications by product', () => {
      renderWithAppContext(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>,
        {
          isLoggedIn: true,
          notifications: [],
          settings: {
            groupNotificationsByProduct: true,
          },
          updateSetting: mockUpdateSettings,
        },
      );

      expect(screen.getByTestId('sidebar-group-by-product')).toMatchSnapshot();
    });

    it('should toggle group notifications by products', async () => {
      renderWithAppContext(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>,
        {
          isLoggedIn: true,
          notifications: [],
          updateSetting: mockUpdateSettings,
        },
      );

      await userEvent.click(screen.getByTestId('sidebar-group-by-product'));

      expect(screen.getByTestId('sidebar-group-by-product')).toMatchSnapshot();
    });
  });

  describe('Group by titles', () => {
    it('should group notifications by title', () => {
      renderWithAppContext(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>,
        {
          isLoggedIn: true,
          notifications: [],
        },
      );

      expect(screen.getByTestId('sidebar-group-by-title')).toMatchSnapshot();
    });

    it('should not group notifications by title - flat notifications', () => {
      renderWithAppContext(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>,
        {
          isLoggedIn: true,
          notifications: [],
          settings: {
            groupNotificationsByTitle: false,
          },
          updateSetting: mockUpdateSettings,
        },
      );

      expect(screen.getByTestId('sidebar-group-by-title')).toMatchSnapshot();
    });

    it('should toggle group notifications by title', async () => {
      renderWithAppContext(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>,
        {
          isLoggedIn: true,
          notifications: [],
          updateSetting: mockUpdateSettings,
        },
      );

      await userEvent.click(screen.getByTestId('sidebar-group-by-title'));

      expect(screen.getByTestId('sidebar-group-by-title')).toMatchSnapshot();
    });
  });

  describe('Filter notifications', () => {
    it('go to the filters route', async () => {
      renderWithAppContext(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>,
        {
          isLoggedIn: true,
          notifications: [],
        },
      );

      await userEvent.click(screen.getByTestId('sidebar-filter-notifications'));

      expect(
        screen.getByTestId('sidebar-filter-notifications'),
      ).toMatchSnapshot();
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/filters');
    });

    it('go to the home if filters path already shown', async () => {
      renderWithAppContext(
        <MemoryRouter initialEntries={['/filters']}>
          <Sidebar />
        </MemoryRouter>,
        {
          isLoggedIn: true,
          notifications: [],
        },
      );

      await userEvent.click(screen.getByTestId('sidebar-filter-notifications'));

      expect(
        screen.getByTestId('sidebar-filter-notifications'),
      ).toMatchSnapshot();
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });

    it('show filters count if any are saved', () => {
      renderWithAppContext(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>,
        {
          isLoggedIn: true,
          notifications: [],
          settings: {
            filterProducts: ['bitbucket'],
          },
        },
      );

      expect(
        screen.getByTestId('sidebar-filter-notifications'),
      ).toMatchSnapshot();
    });
  });

  describe('Refresh Notifications', () => {
    it('should refresh the notifications when status is not loading', async () => {
      renderWithAppContext(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>,
        {
          isLoggedIn: true,
          notifications: [],
          fetchNotifications: mockFetchNotifications,
          status: 'success',
        },
      );

      await userEvent.click(screen.getByTestId('sidebar-refresh'));

      expect(mockFetchNotifications).toHaveBeenCalledTimes(1);
    });

    it('should not refresh the notifications when status is loading', async () => {
      renderWithAppContext(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>,
        {
          isLoggedIn: true,
          notifications: [],
          fetchNotifications: mockFetchNotifications,
          status: 'loading',
        },
      );

      await userEvent.click(screen.getByTestId('sidebar-refresh'));

      expect(mockFetchNotifications).not.toHaveBeenCalled();
    });
  });

  describe('Settings', () => {
    it('go to the settings route', async () => {
      renderWithAppContext(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>,
        {
          isLoggedIn: true,
          notifications: [],
        },
      );

      await userEvent.click(screen.getByTestId('sidebar-settings'));

      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/settings');
    });

    it('go to the home if settings path already shown', async () => {
      renderWithAppContext(
        <MemoryRouter initialEntries={['/settings']}>
          <Sidebar />
        </MemoryRouter>,
        {
          isLoggedIn: true,
          notifications: [],
          fetchNotifications: mockFetchNotifications,
        },
      );

      await userEvent.click(screen.getByTestId('sidebar-settings'));

      expect(mockFetchNotifications).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });

  it('should quit the app', async () => {
    const quitAppSpy = jest.spyOn(comms, 'quitApp');

    renderWithAppContext(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
      {
        isLoggedIn: false,
        notifications: [],
      },
    );

    await userEvent.click(screen.getByTestId('sidebar-quit'));

    expect(quitAppSpy).toHaveBeenCalledTimes(1);
  });
});
