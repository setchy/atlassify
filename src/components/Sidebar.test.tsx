import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { mockAccountNotifications } from '../__mocks__/notifications-mocks';
import { mockAuth, mockSettings } from '../__mocks__/state-mocks';
import { AppContext } from '../context/App';
import * as comms from '../utils/comms';
import { Sidebar } from './Sidebar';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('components/Sidebar.tsx', () => {
  const fetchNotifications = jest.fn();
  const openExternalLinkMock = jest
    .spyOn(comms, 'openExternalLink')
    .mockImplementation();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render itself & its children (logged in)', () => {
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

  it('should render itself & its children (logged out)', () => {
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

  it('should navigate to home', () => {
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

    fireEvent.click(screen.getByTitle('Home'));
    expect(fetchNotifications).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenNthCalledWith(1, '/', { replace: true });
  });

  describe.skip('quick links', () => {
    describe('notifications icon', () => {
      it('when there are 0 notifications', () => {
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

        const notificationsIcon = screen.getByTitle('0 Unread Notifications');

        expect(notificationsIcon).toMatchSnapshot();

        fireEvent.click(screen.getByLabelText('0 Unread Notifications'));

        expect(openExternalLinkMock).toHaveBeenCalledTimes(1);
        expect(openExternalLinkMock).toHaveBeenCalledWith(
          'https://team.atlassian.com/notifications',
        );
      });

      it('when there are more than 0 notifications', () => {
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

        const notificationsIcon = screen.getByTitle('4 Unread Notifications');

        expect(notificationsIcon).toMatchSnapshot();

        fireEvent.click(screen.getByLabelText('4 Unread Notifications'));

        expect(openExternalLinkMock).toHaveBeenCalledTimes(1);
        expect(openExternalLinkMock).toHaveBeenCalledWith(
          'https://team.atlassian.com/notifications',
        );
      });
    });
  });

  describe.skip('Refresh Notifications', () => {
    it('should refresh the notifications when status is not loading', () => {
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

      fireEvent.click(screen.getByTitle('Refresh Notifications'));

      expect(fetchNotifications).toHaveBeenCalledTimes(1);
    });

    it('should not refresh the notifications when status is loading', () => {
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

      fireEvent.click(screen.getByTitle('Refresh Notifications'));

      expect(fetchNotifications).not.toHaveBeenCalled();
    });
  });

  describe.skip('Filters', () => {
    it('go to the filters route', () => {
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
      fireEvent.click(screen.getByTitle('Filters'));
      expect(mockNavigate).toHaveBeenNthCalledWith(1, '/filters');
    });

    it('go to the home if filters path already shown', () => {
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
      fireEvent.click(screen.getByTitle('Filters'));
      expect(mockNavigate).toHaveBeenNthCalledWith(1, '/', { replace: true });
    });
  });

  describe.skip('Settings', () => {
    it('go to the settings route', () => {
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

      fireEvent.click(screen.getByTitle('Settings'));

      expect(mockNavigate).toHaveBeenNthCalledWith(1, '/settings');
    });

    it('go to the home if settings path already shown', () => {
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

      fireEvent.click(screen.getByTitle('Settings'));

      expect(fetchNotifications).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenNthCalledWith(1, '/', { replace: true });
    });
  });

  it.skip('opens atlassian notifications page', () => {
    const openExternalLinkMock = jest.spyOn(comms, 'openExternalLink');

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
    fireEvent.click(screen.getByLabelText('4 Unread Notifications'));
    expect(openExternalLinkMock).toHaveBeenCalledTimes(1);
    expect(openExternalLinkMock).toHaveBeenCalledWith(
      'https://team.atlassian.com/notifications',
    );
  });

  it.skip('should quit the app', () => {
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

    fireEvent.click(screen.getByTitle('Quit Atlasify'));

    expect(quitAppMock).toHaveBeenCalledTimes(1);
  });

  describe.skip('should render the notifications icon', () => {
    it('when there are 0 notifications', () => {
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

      const notificationsIcon = screen.getByTitle('0 Unread Notifications');
      expect(notificationsIcon.className).toContain('text-white');
      expect(notificationsIcon.childNodes.length).toBe(1);
      expect(notificationsIcon.childNodes[0].nodeName).toBe('svg');
    });

    it('when there are more than 0 notifications', () => {
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

      const notificationsIcon = screen.getByTitle('4 Unread Notifications');
      expect(notificationsIcon).toMatchSnapshot();
    });
  });
});
