import type { AccountNotifications } from '../types';
import { mockAtlassifyNotification } from '../utils/api/__mocks__/response-mocks';
import { mockAtlassianCloudAccount } from './state-mocks';

export const mockAccountNotifications: AccountNotifications[] = [
  {
    account: mockAtlassianCloudAccount,
    notifications: mockAtlassifyNotification,
    hasNextPage: false,
    error: null,
  },
];

export const mockSingleAccountNotifications: AccountNotifications[] = [
  {
    account: mockAtlassianCloudAccount,
    notifications: [mockAtlassifyNotification[0]],
    hasNextPage: false,
    error: null,
  },
];
