import { AxiosError } from 'axios';

import {
  mockAtlassifyNotifications,
  mockSingleAtlassifyNotification,
} from '../../__mocks__/notifications-mocks';

import { Errors } from '../core/errors';
import {
  restoreFailedNotifications,
  settleNotificationActionBatches,
} from './mutations';

describe('renderer/utils/notifications/mutations.ts', () => {
  it('reports complete success', async () => {
    const result = await settleNotificationActionBatches([
      {
        notifications: [mockSingleAtlassifyNotification],
        execute: vi.fn().mockResolvedValue(undefined),
      },
    ]);

    expect(result).toEqual({
      succeeded: [mockSingleAtlassifyNotification],
      failed: [],
    });
  });

  it('reports complete failure', async () => {
    const error = new Error('failed');
    const result = await settleNotificationActionBatches([
      {
        notifications: [mockSingleAtlassifyNotification],
        execute: vi.fn().mockRejectedValue(error),
      },
    ]);

    expect(result.succeeded).toEqual([]);
    expect(result.failed).toEqual([
      {
        notification: mockSingleAtlassifyNotification,
        error: Errors.UNKNOWN,
        rawError: error,
      },
    ]);
  });

  it('settles cloud batches independently and classifies every failed notification', async () => {
    const failedNotification = {
      ...mockSingleAtlassifyNotification,
      id: 'failed-notification',
    };
    const error = new AxiosError('network unavailable', AxiosError.ERR_NETWORK);

    const result = await settleNotificationActionBatches([
      {
        notifications: [mockAtlassifyNotifications[1]],
        execute: vi.fn().mockResolvedValue(undefined),
      },
      {
        notifications: [mockSingleAtlassifyNotification, failedNotification],
        execute: vi.fn().mockRejectedValue(error),
      },
    ]);

    expect(result.succeeded).toEqual([mockAtlassifyNotifications[1]]);
    expect(result.failed).toEqual([
      {
        notification: mockSingleAtlassifyNotification,
        error: Errors.NETWORK,
        rawError: error,
      },
      {
        notification: failedNotification,
        error: Errors.NETWORK,
        rawError: error,
      },
    ]);
  });

  it('restores failed notification state without discarding concurrent additions', () => {
    const failedNotification = {
      ...mockSingleAtlassifyNotification,
      readState: 'unread' as const,
    };
    const concurrentNotification = {
      ...mockSingleAtlassifyNotification,
      id: 'concurrent-notification',
      order: 1,
    };
    const accountEntry = {
      account: failedNotification.account,
      notifications: [failedNotification],
      error: null,
      hasMoreNotifications: false,
    };

    const result = restoreFailedNotifications(
      [failedNotification],
      [accountEntry],
      [
        {
          ...accountEntry,
          notifications: [
            { ...failedNotification, readState: 'read' },
            concurrentNotification,
          ],
        },
      ],
    );

    expect(result[0].notifications).toEqual([
      failedNotification,
      concurrentNotification,
    ]);
  });
});
