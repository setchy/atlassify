import { describe, expect, it, vi } from 'vitest';

import type {
  Account,
  AccountNotifications,
  AtlassifyNotification,
} from '../../types';

import { postProcessNotifications } from './postProcess';
import * as remove from './remove';

describe('postProcessNotifications', () => {
  const account: Account = { id: 'a' } as Account;
  const notification: AtlassifyNotification = {
    id: '1',
    readState: 'unread',
    account: account,
    notificationGroup: { id: 'g1', size: 1 },
    product: { type: 'jira' },
  } as AtlassifyNotification;
  const accountNotifications: AccountNotifications[] = [
    {
      account,
      notifications: [notification],
      hasMoreNotifications: false,
      error: null,
    },
  ];

  it('should update readState for affected notifications', () => {
    const affected = [{ ...notification }];
    const result = postProcessNotifications(
      account,
      accountNotifications,
      affected,
      'read',
    );

    expect(result[0].notifications).toBeDefined();

    if (result[0].notifications.length > 0) {
      expect(result[0].notifications[0].readState).toBe('read');
    }
  });

  it('should not mutate the original notifications', () => {
    const affected = [{ ...notification }];
    const original = JSON.parse(JSON.stringify(accountNotifications));

    postProcessNotifications(account, accountNotifications, affected, 'read');

    expect(accountNotifications).toEqual(original);
  });

  it('should remove notifications if shouldRemoveNotificationsFromState returns true', async () => {
    const shouldRemoveSpy = vi
      .spyOn(remove, 'shouldRemoveNotificationsFromState')
      .mockReturnValue(true);

    const removeSpy = vi.spyOn(remove, 'removeNotificationsForAccount');

    const affected = [{ ...notification }];

    const result = postProcessNotifications(
      account,
      accountNotifications,
      affected,
      'read',
    );

    expect(result[0].notifications).toBeDefined();
    expect(result[0].notifications.length).toBe(0);
    expect(shouldRemoveSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();
  });

  it('should not remove notifications if shouldRemoveNotificationsFromState returns false', async () => {
    const shouldRemoveSpy = vi
      .spyOn(remove, 'shouldRemoveNotificationsFromState')
      .mockReturnValue(false);

    const removeSpy = vi.spyOn(remove, 'removeNotificationsForAccount');

    const affected = [{ ...notification }];

    const result = postProcessNotifications(
      account,
      accountNotifications,
      affected,
      'read',
    );

    expect(result[0].notifications.length).toEqual(
      accountNotifications[0].notifications.length,
    );
    expect(shouldRemoveSpy).toHaveBeenCalled();
    expect(removeSpy).not.toHaveBeenCalled();
  });
});
