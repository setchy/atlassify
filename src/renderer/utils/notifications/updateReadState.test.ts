import { mockAtlassianCloudAccountTwo } from '../../__mocks__/account-mocks';
import {
  mockAccountNotifications,
  mockSingleAccountNotifications,
  mockSingleAtlassifyNotification,
} from '../../__mocks__/notifications-mocks';

import { updateNotificationsReadState } from './updateReadState';

describe('renderer/utils/notifications/updateReadState.ts', () => {
  describe('updateNotificationsReadState', () => {
    it('should update readState for a matching notification', () => {
      const result = updateNotificationsReadState(
        mockSingleAccountNotifications[0].account,
        mockSingleAccountNotifications,
        new Set([mockSingleAtlassifyNotification.id]),
        'read',
      );

      expect(result[0].notifications.length).toBe(1);
      expect(result[0].notifications[0].readState).toBe('read');
    });

    it('should not update readState if no matching IDs to update', () => {
      const result = updateNotificationsReadState(
        mockSingleAccountNotifications[0].account,
        mockSingleAccountNotifications,
        new Set(['non-existent-id']),
        'read',
      );

      expect(result[0].notifications.length).toBe(1);
      expect(result).toEqual(mockSingleAccountNotifications);
    });

    it('should not update readState if nothing to update', () => {
      const result = updateNotificationsReadState(
        mockSingleAccountNotifications[0].account,
        mockSingleAccountNotifications,
        new Set(),
        'read',
      );

      expect(result[0].notifications.length).toBe(1);
      expect(result).toEqual(mockSingleAccountNotifications);
    });

    it('should not update readState if no matching accounts found', () => {
      const result = updateNotificationsReadState(
        mockAtlassianCloudAccountTwo,
        mockSingleAccountNotifications,
        new Set([mockSingleAtlassifyNotification.id]),
        'read',
      );

      expect(result[0].notifications.length).toBe(1);
      expect(result).toEqual(mockSingleAccountNotifications);
    });

    it('should update readState for multiple notifications if IDs match', () => {
      const result = updateNotificationsReadState(
        mockAccountNotifications[0].account,
        mockAccountNotifications,
        new Set([
          mockAccountNotifications[0].notifications[0].id,
          mockAccountNotifications[0].notifications[1].id,
        ]),
        'read',
      );

      expect(result[0].notifications[0].readState).toBe('read');
      expect(result[0].notifications[1].readState).toBe('read');
    });
  });
});
