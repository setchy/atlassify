import type { AccountNotifications } from '../types';
import { mockAtlassifyNotifications } from '../utils/api/__mocks__/response-mocks';
import { mockAtlassianCloudAccount } from './state-mocks';

export const mockAccountNotifications: AccountNotifications[] = [
  {
    account: mockAtlassianCloudAccount,
    notifications: mockAtlassifyNotifications,
    hasNextPage: false,
    error: null,
  },
];

export const mockAccountNotificationsWithMorePages: AccountNotifications[] = [
  {
    account: mockAtlassianCloudAccount,
    notifications: mockAtlassifyNotifications,
    hasNextPage: true,
    error: null,
  },
];

export const mockSingleAccountNotifications: AccountNotifications[] = [
  {
    account: mockAtlassianCloudAccount,
    notifications: [mockAtlassifyNotifications[0]],
    hasNextPage: false,
    error: null,
  },
];
