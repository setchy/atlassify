import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAppContext } from '../../__helpers__/test-utils';
import { mockSingleAtlassifyNotification } from '../../__mocks__/notifications-mocks';
import { mockSettings } from '../../__mocks__/state-mocks';

import type { ReadStateType } from '../../types';

import * as comms from '../../utils/comms';
import * as links from '../../utils/links';
import { PRODUCTS } from '../../utils/products';
import { NotificationRow, type NotificationRowProps } from './NotificationRow';

describe('renderer/components/notifications/NotificationRow.tsx', () => {
  jest.spyOn(links, 'openNotification').mockImplementation();
  jest.spyOn(comms, 'openExternalLink').mockImplementation();
  jest
    .spyOn(globalThis.Date, 'now')
    .mockImplementation(() => new Date('2024').valueOf());

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('should render notifications', () => {
    it('standard notification', async () => {
      const props: NotificationRowProps = {
        notification: mockSingleAtlassifyNotification,
      };

      const tree = renderWithAppContext(<NotificationRow {...props} />);

      expect(tree).toMatchSnapshot();
    });

    it('group by title', async () => {
      const props: NotificationRowProps = {
        notification: mockSingleAtlassifyNotification,
      };

      const tree = renderWithAppContext(<NotificationRow {...props} />, {
        settings: { ...mockSettings, groupNotificationsByTitle: true },
      });

      expect(tree).toMatchSnapshot();
    });

    it('group by title with multiple named actors', async () => {
      const mockNotification = mockSingleAtlassifyNotification;
      mockNotification.notificationGroup.size = 3;
      mockNotification.notificationGroup.additionalActors = [
        { displayName: 'User 1', avatarURL: null },
        { displayName: 'User 2', avatarURL: null },
      ];

      const props: NotificationRowProps = {
        notification: mockNotification,
      };

      const tree = renderWithAppContext(<NotificationRow {...props} />, {
        settings: { ...mockSettings, groupNotificationsByTitle: true },
      });

      expect(tree).toMatchSnapshot();
    });

    it('group by title with multiple unnamed actors', async () => {
      const mockNotification = mockSingleAtlassifyNotification;
      mockNotification.notificationGroup.size = 3;
      mockNotification.notificationGroup.additionalActors = [];

      const props: NotificationRowProps = {
        notification: mockNotification,
      };

      const tree = renderWithAppContext(<NotificationRow {...props} />, {
        settings: { ...mockSettings, groupNotificationsByTitle: true },
      });

      expect(tree).toMatchSnapshot();
    });

    it('compass avatar as square', async () => {
      const props: NotificationRowProps = {
        notification: {
          ...mockSingleAtlassifyNotification,
          product: PRODUCTS.compass,
          message: 'some-project improved a scorecard',
        },
      };

      const tree = renderWithAppContext(<NotificationRow {...props} />, {
        settings: { ...mockSettings, groupNotificationsByProduct: true },
      });

      expect(tree).toMatchSnapshot();
    });

    it('missing entity icon url should default to product logo', async () => {
      const props: NotificationRowProps = {
        notification: {
          ...mockSingleAtlassifyNotification,
          entity: {
            ...mockSingleAtlassifyNotification.entity,
            iconUrl: null,
          },
        },
      };

      const tree = renderWithAppContext(<NotificationRow {...props} />, {
        settings: { groupNotificationsByProduct: true },
      });

      expect(tree).toMatchSnapshot();
    });
  });

  describe('notification interactions', () => {
    it('should open a notification in the browser - click', async () => {
      const markNotificationsReadMock = jest.fn();

      const props: NotificationRowProps = {
        notification: mockSingleAtlassifyNotification,
      };

      renderWithAppContext(<NotificationRow {...props} />, {
        markNotificationsRead: markNotificationsReadMock,
      });

      await userEvent.click(screen.getByTestId('notification-details'));

      expect(links.openNotification).toHaveBeenCalledTimes(1);
      expect(markNotificationsReadMock).toHaveBeenCalledTimes(1);
    });

    it('should open a notification in the browser - delay notification setting enabled', async () => {
      const markNotificationsReadMock = jest.fn();

      const props: NotificationRowProps = {
        notification: mockSingleAtlassifyNotification,
      };

      renderWithAppContext(<NotificationRow {...props} />, {
        settings: {
          ...mockSettings,
          delayNotificationState: true,
        },
        markNotificationsRead: markNotificationsReadMock,
      });

      await userEvent.click(screen.getByTestId('notification-details'));

      expect(links.openNotification).toHaveBeenCalledTimes(1);
      expect(markNotificationsReadMock).toHaveBeenCalledTimes(1);
    });

    it('should mark a notification as read', async () => {
      const markNotificationsReadMock = jest.fn();

      const props: NotificationRowProps = {
        notification: mockSingleAtlassifyNotification,
      };

      renderWithAppContext(<NotificationRow {...props} />, {
        markNotificationsRead: markNotificationsReadMock,
      });

      await userEvent.click(screen.getByTestId('notification-mark-as-read'));

      expect(markNotificationsReadMock).toHaveBeenCalledTimes(1);
    });

    it('should mark a notification as unread', async () => {
      const markNotificationsUnreadMock = jest.fn();

      const props: NotificationRowProps = {
        notification: {
          ...mockSingleAtlassifyNotification,
          readState: 'read' as ReadStateType,
        },
      };

      renderWithAppContext(<NotificationRow {...props} />, {
        markNotificationsUnread: markNotificationsUnreadMock,
      });

      await userEvent.click(screen.getByTestId('notification-mark-as-unread'));

      expect(markNotificationsUnreadMock).toHaveBeenCalledTimes(1);
    });
  });
});
