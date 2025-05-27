import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import {
  mockAccountNotifications,
  mockAccountNotificationsWithMorePages,
} from '../__mocks__/notifications-mocks';
import { mockAuth, mockSettings } from '../__mocks__/state-mocks';
import { AppContext } from '../context/App';
import * as comms from '../utils/comms';
import * as theme from '../utils/theme';
import { Sidebar } from './Sidebar';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('renderer/components/Sidebar.tsx', () => {
  const updateSetting = jest.fn();
  const fetchNotifications = jest.fn();
  const openExternalLinkMock = jest
    .spyOn(comms, 'openExternalLink')
    .mockImplementation();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('logged in', () => {
    it('should render itself & its children - light mode', () => {
      jest.spyOn(theme, 'isLightMode').mockReturnValue(true);

      const tree = render(
        <AppContext.Provider
          value={{
            notifications: mockAccountNotifications,
            auth: mockAuth,
            settings: mockSettings,
          }}
        >
          <MemoryRouter>
            <Sidebar />
          </MemoryRouter>
        </AppContext.Provider>,
      );

      expect(tree).toMatchSnapshot();
    });

    it('should render itself & its children - dark mode', () => {
      jest.spyOn(theme, 'isLightMode').mockReturnValue(false);

      const tree = render(
        <AppContext.Provider
          value={{
            notifications: mockAccountNotifications,
            auth: mockAuth,
            settings: mockSettings,
          }}
        >
          <MemoryRouter>
            <Sidebar />
          </MemoryRouter>
        </AppContext.Provider>,
      );

      expect(tree).toMatchSnapshot();
    });
  });

  describe('logged out', () => {
    it('should render itself & its children - light mode', () => {
      jest.spyOn(theme, 'isLightMode').mockReturnValue(true);

      const tree = render(
        <AppContext.Provider
          value={{
            isLoggedIn: false,
            notifications: mockAccountNotifications,
            auth: mockAuth,
            settings: mockSettings,
          }}
        >
          <MemoryRouter>
            <Sidebar />
          </MemoryRouter>
        </AppContext.Provider>,
      );

      expect(tree).toMatchSnapshot();
    });

    it('should render itself & its children - dark mode', () => {
      jest.spyOn(theme, 'isLightMode').mockReturnValue(false);

      const tree = render(
        <AppContext.Provider
          value={{
            isLoggedIn: false,
            notifications: mockAccountNotifications,
            auth: mockAuth,
            settings: mockSettings,
          }}
        >
          <MemoryRouter>
            <Sidebar />
          </MemoryRouter>
        </AppContext.Provider>,
      );

      expect(tree).toMatchSnapshot();
    });
  });

  it('should navigate to home', async () => {
    render(
      <AppContext.Provider
        value={{
          isLoggedIn: false,
          notifications: [],
          auth: mockAuth,
          settings: mockSettings,
          fetchNotifications,
        }}
      >
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    await userEvent.click(screen.getByTestId('sidebar-home'));

    expect(mockNavigate).toHaveBeenNthCalledWith(1, '/', { replace: true });
  });

  describe('notifications icon', () => {
    it('opens notifications home when clicked', async () => {
      render(
        <AppContext.Provider
          value={{
            isLoggedIn: true,
            notifications: [],
            auth: mockAuth,
            settings: mockSettings,
          }}
        >
          <MemoryRouter>
            <Sidebar />
          </MemoryRouter>
        </AppContext.Provider>,
      );

      await userEvent.click(screen.getByTestId('sidebar-notifications'));

      expect(openExternalLinkMock).toHaveBeenCalledWith(
        'https://team.atlassian.com/notifications',
      );
    });

    it('renders correct icon when there are no notifications', () => {
      render(
        <AppContext.Provider
          value={{
            isLoggedIn: true,
            notifications: [],
            auth: mockAuth,
            settings: mockSettings,
          }}
        >
          <MemoryRouter>
            <Sidebar />
          </MemoryRouter>
        </AppContext.Provider>,
      );

      expect(screen.getByTestId('sidebar-notifications')).toMatchSnapshot();
    });

    it('renders correct icon when there are notifications', () => {
      render(
        <AppContext.Provider
          value={{
            isLoggedIn: true,
            notifications: mockAccountNotifications,
            auth: mockAuth,
            settings: mockSettings,
          }}
        >
          <MemoryRouter>
            <Sidebar />
          </MemoryRouter>
        </AppContext.Provider>,
      );

      expect(screen.getByTestId('sidebar-notifications')).toMatchSnapshot();
    });

    it('renders correct icon when there are more notifications available', () => {
      render(
        <AppContext.Provider
          value={{
            isLoggedIn: true,
            notifications: mockAccountNotificationsWithMorePages,
            auth: mockAuth,
            settings: mockSettings,
          }}
        >
          <MemoryRouter>
            <Sidebar />
          </MemoryRouter>
        </AppContext.Provider>,
      );

      expect(screen.getByTestId('sidebar-notifications')).toMatchSnapshot();
    });
  });

  describe('show only unread notifications', () => {
    it('should toggle show only unread notifications', async () => {
      render(
        <AppContext.Provider
          value={{
            isLoggedIn: true,
            notifications: [],
            auth: mockAuth,
            settings: mockSettings,
            updateSetting,
          }}
        >
          <MemoryRouter>
            <Sidebar />
          </MemoryRouter>
        </AppContext.Provider>,
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
      render(
        <AppContext.Provider
          value={{
            isLoggedIn: true,
            notifications: [],
            auth: mockAuth,
            settings: mockSettings,
          }}
        >
          <MemoryRouter>
            <Sidebar />
          </MemoryRouter>
        </AppContext.Provider>,
      );

      expect(screen.getByTestId('sidebar-group-by-product')).toMatchSnapshot();
    });

    it('should group notifications by product', () => {
      render(
        <AppContext.Provider
          value={{
            isLoggedIn: true,
            notifications: [],
            auth: mockAuth,
            settings: {
              ...mockSettings,
              groupNotificationsByProduct: true,
            },
            updateSetting,
          }}
        >
          <MemoryRouter>
            <Sidebar />
          </MemoryRouter>
        </AppContext.Provider>,
      );

      expect(screen.getByTestId('sidebar-group-by-product')).toMatchSnapshot();
    });

    it('should toggle group by products', async () => {
      render(
        <AppContext.Provider
          value={{
            isLoggedIn: true,
            notifications: [],
            auth: mockAuth,
            settings: mockSettings,
            updateSetting,
          }}
        >
          <MemoryRouter>
            <Sidebar />
          </MemoryRouter>
        </AppContext.Provider>,
      );

      await userEvent.click(screen.getByTestId('sidebar-group-by-product'));

      expect(screen.getByTestId('sidebar-group-by-product')).toMatchSnapshot();
    });
  });

  describe('Filter notifications', () => {
    it('go to the filters route', async () => {
      render(
        <AppContext.Provider
          value={{
            isLoggedIn: true,
            notifications: [],
            auth: mockAuth,
            settings: mockSettings,
          }}
        >
          <MemoryRouter>
            <Sidebar />
          </MemoryRouter>
        </AppContext.Provider>,
      );

      await userEvent.click(screen.getByTestId('sidebar-filter-notifications'));

      expect(
        screen.getByTestId('sidebar-filter-notifications'),
      ).toMatchSnapshot();
      expect(mockNavigate).toHaveBeenNthCalledWith(1, '/filters');
    });

    it('go to the home if filters path already shown', async () => {
      render(
        <AppContext.Provider
          value={{
            isLoggedIn: true,
            notifications: [],
            auth: mockAuth,
            settings: mockSettings,
          }}
        >
          <MemoryRouter initialEntries={['/filters']}>
            <Sidebar />
          </MemoryRouter>
        </AppContext.Provider>,
      );

      await userEvent.click(screen.getByTestId('sidebar-filter-notifications'));

      expect(
        screen.getByTestId('sidebar-filter-notifications'),
      ).toMatchSnapshot();
      expect(mockNavigate).toHaveBeenNthCalledWith(1, '/', { replace: true });
    });

    it('show filters count if any are saved', () => {
      render(
        <AppContext.Provider
          value={{
            isLoggedIn: true,
            notifications: [],
            auth: mockAuth,
            settings: {
              ...mockSettings,
              filterProducts: ['bitbucket'],
            },
          }}
        >
          <MemoryRouter>
            <Sidebar />
          </MemoryRouter>
        </AppContext.Provider>,
      );

      expect(
        screen.getByTestId('sidebar-filter-notifications'),
      ).toMatchSnapshot();
    });
  });

  describe('Refresh Notifications', () => {
    it('should refresh the notifications when status is not loading', async () => {
      render(
        <AppContext.Provider
          value={{
            isLoggedIn: true,
            notifications: [],
            auth: mockAuth,
            settings: mockSettings,
            fetchNotifications,
            status: 'success',
          }}
        >
          <MemoryRouter>
            <Sidebar />
          </MemoryRouter>
        </AppContext.Provider>,
      );

      await userEvent.click(screen.getByTestId('sidebar-refresh'));

      expect(fetchNotifications).toHaveBeenCalledTimes(1);
    });

    it('should not refresh the notifications when status is loading', async () => {
      render(
        <AppContext.Provider
          value={{
            isLoggedIn: true,
            notifications: [],
            auth: mockAuth,
            settings: mockSettings,
            fetchNotifications,
            status: 'loading',
          }}
        >
          <MemoryRouter>
            <Sidebar />
          </MemoryRouter>
        </AppContext.Provider>,
      );

      await userEvent.click(screen.getByTestId('sidebar-refresh'));

      expect(fetchNotifications).not.toHaveBeenCalled();
    });
  });

  describe('Settings', () => {
    it('go to the settings route', async () => {
      render(
        <AppContext.Provider
          value={{
            isLoggedIn: true,
            notifications: [],
            auth: mockAuth,
            settings: mockSettings,
          }}
        >
          <MemoryRouter>
            <Sidebar />
          </MemoryRouter>
        </AppContext.Provider>,
      );

      await userEvent.click(screen.getByTestId('sidebar-settings'));

      expect(mockNavigate).toHaveBeenNthCalledWith(1, '/settings');
    });

    it('go to the home if settings path already shown', async () => {
      render(
        <AppContext.Provider
          value={{
            isLoggedIn: true,
            notifications: [],
            auth: mockAuth,
            settings: mockSettings,
            fetchNotifications,
          }}
        >
          <MemoryRouter initialEntries={['/settings']}>
            <Sidebar />
          </MemoryRouter>
        </AppContext.Provider>,
      );

      await userEvent.click(screen.getByTestId('sidebar-settings'));

      expect(fetchNotifications).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenNthCalledWith(1, '/', { replace: true });
    });
  });

  it('should quit the app', async () => {
    const quitAppMock = jest.spyOn(comms, 'quitApp');

    render(
      <AppContext.Provider
        value={{
          isLoggedIn: false,
          notifications: [],
          auth: mockAuth,
          settings: mockSettings,
        }}
      >
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    await userEvent.click(screen.getByTestId('sidebar-quit'));

    expect(quitAppMock).toHaveBeenCalledTimes(1);
  });
});
