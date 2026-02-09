import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { useThemeObserver } from '@atlaskit/tokens';

import { vi } from 'vitest';

import { renderWithAppContext } from '../__helpers__/test-utils';
import {
  mockAccountNotifications,
  mockAccountNotificationsWithMorePages,
} from '../__mocks__/notifications-mocks';
import { mockSettings } from '../__mocks__/state-mocks';

import * as comms from '../utils/comms';
import { Sidebar } from './Sidebar';

vi.mock('@atlaskit/tokens', async () => {
  const actual = await vi.importActual('@atlaskit/tokens');
  return {
    ...actual,
    useThemeObserver: vi.fn(() => ({ colorMode: 'light' })),
  };
});

import { defaultFiltersState } from '../stores/defaults';
import useFiltersStore from '../stores/useFiltersStore';

const mockThemeObserverColorMode = (mode: 'light' | 'dark') => {
  (useThemeObserver as any).mockReturnValue({ colorMode: mode });
};

const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => navigateMock,
}));

describe('renderer/components/Sidebar.tsx', () => {
  const updateSettingMock = vi.fn();
  const fetchNotificationsMock = vi.fn();
  const openExternalLinkSpy = vi
    .spyOn(comms, 'openExternalLink')
    .mockImplementation(vi.fn());

  beforeEach(() => {
    useFiltersStore.getState().reset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('logged in', () => {
    it('should render itself & its children - light mode', () => {
      mockThemeObserverColorMode('light');

      const tree = renderWithAppContext(
        <MemoryRouter initialEntries={['/']}>
          <Sidebar />
        </MemoryRouter>,
        {
          isLoggedIn: true,
          notifications: mockAccountNotifications,
        },
      );

      expect(tree).toMatchSnapshot();
    });

    it('should render itself & its children - dark mode', () => {
      mockThemeObserverColorMode('dark');

      const tree = renderWithAppContext(
        <MemoryRouter initialEntries={['/']}>
          <Sidebar />
        </MemoryRouter>,
        {
          isLoggedIn: true,
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
        <MemoryRouter initialEntries={['/landing']}>
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

  it('should navigate to home when clicking logo', async () => {
    renderWithAppContext(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    );

    await userEvent.click(screen.getByTestId('sidebar-home'));

    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith('/', { replace: true });
  });

  describe('notifications icon', () => {
    it('opens notifications home when clicked', async () => {
      renderWithAppContext(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>,
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
          settings: { ...mockSettings, fetchOnlyUnreadNotifications: true },
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
          settings: { ...mockSettings, fetchOnlyUnreadNotifications: false },
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
          updateSetting: updateSettingMock,
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
          settings: {
            ...mockSettings,
            groupNotificationsByProduct: false,
          },
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
          settings: {
            ...mockSettings,
            groupNotificationsByProduct: true,
          },
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
          updateSetting: updateSettingMock,
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
          settings: {
            ...mockSettings,
            groupNotificationsByTitle: true,
          },
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
          settings: {
            ...mockSettings,
            groupNotificationsByTitle: false,
          },
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
          updateSetting: updateSettingMock,
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
      );

      await userEvent.click(screen.getByTestId('sidebar-filter-notifications'));

      expect(
        screen.getByTestId('sidebar-filter-notifications'),
      ).toMatchSnapshot();
      expect(navigateMock).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledWith('/filters');
    });

    it('go to the home if filters path already shown', async () => {
      renderWithAppContext(
        <MemoryRouter initialEntries={['/filters']}>
          <Sidebar />
        </MemoryRouter>,
      );

      await userEvent.click(screen.getByTestId('sidebar-filter-notifications'));

      expect(
        screen.getByTestId('sidebar-filter-notifications'),
      ).toMatchSnapshot();
      expect(navigateMock).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledWith('/', { replace: true });
    });

    it('highlight filters sidebar if any are saved', () => {
      useFiltersStore.setState({
        ...defaultFiltersState,
        products: ['bitbucket'],
      });

      renderWithAppContext(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>,
        {
          settings: {
            ...mockSettings,
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
          fetchNotifications: fetchNotificationsMock,
          status: 'success',
        },
      );

      await userEvent.click(screen.getByTestId('sidebar-refresh'));

      expect(fetchNotificationsMock).toHaveBeenCalledTimes(1);
    });

    it('should not refresh the notifications when status is loading', async () => {
      renderWithAppContext(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>,
        {
          fetchNotifications: fetchNotificationsMock,
          status: 'loading',
        },
      );

      await userEvent.click(screen.getByTestId('sidebar-refresh'));

      expect(fetchNotificationsMock).not.toHaveBeenCalled();
    });
  });

  describe('Settings', () => {
    it('go to the settings route', async () => {
      renderWithAppContext(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>,
      );

      await userEvent.click(screen.getByTestId('sidebar-settings'));

      expect(navigateMock).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledWith('/settings');
    });

    it('go to the home if settings path already shown', async () => {
      renderWithAppContext(
        <MemoryRouter initialEntries={['/settings']}>
          <Sidebar />
        </MemoryRouter>,
        {
          fetchNotifications: fetchNotificationsMock,
        },
      );

      await userEvent.click(screen.getByTestId('sidebar-settings'));

      expect(fetchNotificationsMock).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledWith('/', { replace: true });
    });
  });

  it('should quit the app', async () => {
    const quitAppSpy = vi.spyOn(comms, 'quitApp');

    renderWithAppContext(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
      {
        isLoggedIn: false,
      },
    );

    await userEvent.click(screen.getByTestId('sidebar-quit'));

    expect(quitAppSpy).toHaveBeenCalledTimes(1);
  });
});
