import { describe, expect, it, vi } from 'vitest';

import {
  mockSingleAccountNotifications,
  mockSingleAtlassifyNotification,
} from '../../__mocks__/notifications-mocks';

import { postProcessNotifications } from './postProcess';
import * as remove from './remove';

describe('postProcessNotifications', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should update readState for affected notifications', () => {
    const affected = [{ ...mockSingleAtlassifyNotification }];
    const result = postProcessNotifications(
      mockSingleAccountNotifications[0].account,
      mockSingleAccountNotifications,
      affected,
      'read',
    );

    expect(result[0].notifications).toBeDefined();

    if (result[0].notifications.length > 0) {
      expect(result[0].notifications[0].readState).toBe('read');
    }
  });

  it('should remove notifications if shouldRemoveNotificationsFromState returns true', async () => {
    const shouldRemoveSpy = vi
      .spyOn(remove, 'shouldRemoveNotificationsFromState')
      .mockReturnValue(true);

    const removeSpy = vi.spyOn(remove, 'removeNotificationsForAccount');

    const affected = [{ ...mockSingleAtlassifyNotification }];

    const result = postProcessNotifications(
      mockSingleAccountNotifications[0].account,
      mockSingleAccountNotifications,
      affected,
      'read',
    );

    expect(result[0].notifications).toBeDefined();
    expect(result[0].notifications.length).toBe(0);
    expect(shouldRemoveSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();
  });

  it('should not remove notifications actionType is "unread"', async () => {
    const shouldRemoveSpy = vi
      .spyOn(remove, 'shouldRemoveNotificationsFromState')
      .mockReturnValue(true);

    const removeSpy = vi.spyOn(remove, 'removeNotificationsForAccount');

    const affected = [{ ...mockSingleAtlassifyNotification }];

    const result = postProcessNotifications(
      mockSingleAccountNotifications[0].account,
      mockSingleAccountNotifications,
      affected,
      'unread',
    );

    expect(result[0].notifications.length).toEqual(
      mockSingleAccountNotifications[0].notifications.length,
    );
    expect(shouldRemoveSpy).not.toHaveBeenCalled();
    expect(removeSpy).not.toHaveBeenCalled();
  });
});
