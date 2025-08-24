import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { mockSingleAtlassifyNotification } from '../../__mocks__/notifications-mocks';
import { mockAuth, mockSettings } from '../../__mocks__/state-mocks';
import { AppContext } from '../../context/App';
import type { ReadStateType } from '../../types';
import * as comms from '../../utils/comms';
import * as links from '../../utils/links';
import { type INotificationRow, NotificationRow } from './NotificationRow';

describe('renderer/components/notifications/NotificationRow.tsx', () => {
  jest.spyOn(links, 'openNotification');
  jest.spyOn(comms, 'openExternalLink').mockImplementation();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('should render notifications', () => {
    it('standard notification', async () => {
      jest
        .spyOn(global.Date, 'now')
        .mockImplementation(() => new Date('2024').valueOf());

      const props: INotificationRow = {
        notification: mockSingleAtlassifyNotification,
      };

      const tree = render(
        <AppContext.Provider
          value={{
            settings: mockSettings,
          }}
        >
          <NotificationRow {...props} />
        </AppContext.Provider>,
      );

      expect(tree).toMatchSnapshot();
    });

    it('group by title', async () => {
      jest
        .spyOn(global.Date, 'now')
        .mockImplementation(() => new Date('2024').valueOf());

      const props: INotificationRow = {
        notification: mockSingleAtlassifyNotification,
      };

      const tree = render(
        <AppContext.Provider
          value={{
            settings: { ...mockSettings, groupNotificationsByTitle: true },
          }}
        >
          <NotificationRow {...props} />
        </AppContext.Provider>,
      );

      expect(tree).toMatchSnapshot();
    });

    it('group by title with multiple named actors', async () => {
      jest
        .spyOn(global.Date, 'now')
        .mockImplementation(() => new Date('2024').valueOf());

      const mockNotification = mockSingleAtlassifyNotification;
      mockNotification.notificationGroup.size = 3;
      mockNotification.notificationGroup.additionalActors = [
        { displayName: 'User 1', avatarURL: null },
        { displayName: 'User 2', avatarURL: null },
      ];

      const props: INotificationRow = {
        notification: mockNotification,
      };

      const tree = render(
        <AppContext.Provider
          value={{
            settings: { ...mockSettings, groupNotificationsByTitle: true },
          }}
        >
          <NotificationRow {...props} />
        </AppContext.Provider>,
      );

      expect(tree).toMatchSnapshot();
    });

    it('group by title with multiple unnamed actors', async () => {
      jest
        .spyOn(global.Date, 'now')
        .mockImplementation(() => new Date('2024').valueOf());

      const mockNotification = mockSingleAtlassifyNotification;
      mockNotification.notificationGroup.size = 3;
      mockNotification.notificationGroup.additionalActors = [];

      const props: INotificationRow = {
        notification: mockNotification,
      };

      const tree = render(
        <AppContext.Provider
          value={{
            settings: { ...mockSettings, groupNotificationsByTitle: true },
          }}
        >
          <NotificationRow {...props} />
        </AppContext.Provider>,
      );

      expect(tree).toMatchSnapshot();
    });

    it('compass avatar as square', async () => {
      jest
        .spyOn(global.Date, 'now')
        .mockImplementation(() => new Date('2024').valueOf());

      const mockNotification = mockSingleAtlassifyNotification;
      mockNotification.product.name = 'compass';
      mockNotification.message = 'some-project improved a scorecard';

      const props: INotificationRow = {
        notification: mockNotification,
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
  });

  describe('notification interactions', () => {
    it('should open a notification in the browser - click', async () => {
      const markNotificationsReadMock = jest.fn();

      const props: INotificationRow = {
        notification: mockSingleAtlassifyNotification,
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

      await userEvent.click(screen.getByTestId('notification-details'));

      expect(links.openNotification).toHaveBeenCalledTimes(1);
      expect(markNotificationsReadMock).toHaveBeenCalledTimes(1);
    });

    it('should open a notification in the browser - delay notification setting enabled', async () => {
      const markNotificationsReadMock = jest.fn();

      const props: INotificationRow = {
        notification: mockSingleAtlassifyNotification,
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

      await userEvent.click(screen.getByTestId('notification-details'));

      expect(links.openNotification).toHaveBeenCalledTimes(1);
      expect(markNotificationsReadMock).toHaveBeenCalledTimes(1);
    });

    it('should mark a notification as read', async () => {
      const markNotificationsReadMock = jest.fn();

      const props: INotificationRow = {
        notification: mockSingleAtlassifyNotification,
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

      await userEvent.click(screen.getByTestId('notification-mark-as-read'));

      expect(markNotificationsReadMock).toHaveBeenCalledTimes(1);
    });

    it('should mark a notification as unread', async () => {
      const markNotificationsUnreadMock = jest.fn();

      const props: INotificationRow = {
        notification: {
          ...mockSingleAtlassifyNotification,
          readState: 'read' as ReadStateType,
        },
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

      await userEvent.click(screen.getByTestId('notification-mark-as-unread'));

      expect(markNotificationsUnreadMock).toHaveBeenCalledTimes(1);
    });
  });
});
