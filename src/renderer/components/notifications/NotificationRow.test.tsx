import { fireEvent, render, screen } from '@testing-library/react';
import { mockSingleAtlassifyNotification } from '../../__mocks__/notifications-mocks';
import {
  mockAtlassianCloudAccount,
  mockAuth,
  mockSettings,
} from '../../__mocks__/state-mocks';
import { AppContext } from '../../context/App';
import type { ReadState } from '../../types';
import * as comms from '../../utils/comms';
import * as links from '../../utils/links';
import { NotificationRow } from './NotificationRow';

describe('renderer/components/notifications/NotificationRow.tsx', () => {
  jest.spyOn(links, 'openNotification');
  jest.spyOn(comms, 'openExternalLink').mockImplementation();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render itself & its children - group by date', async () => {
    jest
      .spyOn(global.Date, 'now')
      .mockImplementation(() => new Date('2024').valueOf());

    const props = {
      notification: mockSingleAtlassifyNotification,
      account: mockAtlassianCloudAccount,
    };

    const tree = render(
      <AppContext.Provider
        value={{
          settings: { ...mockSettings, groupNotificationsByProduct: false },
        }}
      >
        <NotificationRow {...props} />
      </AppContext.Provider>,
    );

    expect(tree).toMatchSnapshot();
  });

  it('should render itself & its children - group by products', async () => {
    jest
      .spyOn(global.Date, 'now')
      .mockImplementation(() => new Date('2024').valueOf());

    const props = {
      notification: mockSingleAtlassifyNotification,
      account: mockAtlassianCloudAccount,
    };

    const tree = render(
      <AppContext.Provider
        value={{
          settings: { ...mockSettings, groupNotificationsByProduct: true },
        }}
      >
        <NotificationRow {...props} />
      </AppContext.Provider>,
    );

    expect(tree).toMatchSnapshot();
  });

  describe('notification interactions', () => {
    it('should open a notification in the browser - click', () => {
      const markNotificationsReadMock = jest.fn();

      const props = {
        notification: mockSingleAtlassifyNotification,
        account: mockAtlassianCloudAccount,
      };

      render(
        <AppContext.Provider
          value={{
            settings: mockSettings,
            markNotificationsRead: markNotificationsReadMock,
            auth: mockAuth,
          }}
        >
          <NotificationRow {...props} />
        </AppContext.Provider>,
      );

      fireEvent.click(screen.getByTestId('notification-row'));

      expect(links.openNotification).toHaveBeenCalledTimes(1);
      expect(markNotificationsReadMock).toHaveBeenCalledTimes(1);
    });

    it('should open a notification in the browser - key down', () => {
      const markNotificationsReadMock = jest.fn();

      const props = {
        notification: mockSingleAtlassifyNotification,
        account: mockAtlassianCloudAccount,
      };

      render(
        <AppContext.Provider
          value={{
            settings: mockSettings,
            markNotificationsRead: markNotificationsReadMock,
            auth: mockAuth,
          }}
        >
          <NotificationRow {...props} />
        </AppContext.Provider>,
      );

      fireEvent.keyDown(screen.getByTestId('notification-row'));

      expect(links.openNotification).toHaveBeenCalledTimes(1);
      expect(markNotificationsReadMock).toHaveBeenCalledTimes(1);
    });

    it('should open a notification in the browser - delay notification setting enabled', () => {
      const markNotificationsReadMock = jest.fn();

      const props = {
        notification: mockSingleAtlassifyNotification,
        account: mockAtlassianCloudAccount,
      };

      render(
        <AppContext.Provider
          value={{
            settings: {
              ...mockSettings,
              delayNotificationState: true,
            },
            markNotificationsRead: markNotificationsReadMock,
            auth: mockAuth,
          }}
        >
          <NotificationRow {...props} />
        </AppContext.Provider>,
      );

      fireEvent.click(screen.getByTestId('notification-row'));

      expect(links.openNotification).toHaveBeenCalledTimes(1);
      expect(markNotificationsReadMock).toHaveBeenCalledTimes(1);
    });

    it('should mark a notification as read', () => {
      const markNotificationsReadMock = jest.fn();

      const props = {
        notification: mockSingleAtlassifyNotification,
        account: mockAtlassianCloudAccount,
      };

      render(
        <AppContext.Provider
          value={{
            settings: mockSettings,
            markNotificationsRead: markNotificationsReadMock,
          }}
        >
          <NotificationRow {...props} />
        </AppContext.Provider>,
      );

      fireEvent.click(screen.getByTestId('notification-mark-as-read'));

      expect(markNotificationsReadMock).toHaveBeenCalledTimes(1);
    });

    it('should mark a notification as unread', () => {
      const markNotificationsUnreadMock = jest.fn();

      const props = {
        notification: {
          ...mockSingleAtlassifyNotification,
          readState: 'read' as ReadState,
        },
        account: mockAtlassianCloudAccount,
      };

      render(
        <AppContext.Provider
          value={{
            settings: mockSettings,
            markNotificationsUnread: markNotificationsUnreadMock,
          }}
        >
          <NotificationRow {...props} />
        </AppContext.Provider>,
      );

      fireEvent.click(screen.getByTestId('notification-mark-as-unread'));

      expect(markNotificationsUnreadMock).toHaveBeenCalledTimes(1);
    });
  });
});
