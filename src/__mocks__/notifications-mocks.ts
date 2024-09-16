import type { AccountNotifications } from '../types';
import { mockAtlasifyNotification } from '../utils/api/__mocks__/response-mocks';
import { mockAtlassianCloudAccount } from './state-mocks';

export const mockAccountNotifications: AccountNotifications[] = [
  {
    account: mockAtlassianCloudAccount,
    notifications: mockAtlasifyNotification,
    hasNextPage: false,
    error: null,
  },
];

export const mockSingleAccountNotifications: AccountNotifications[] = [
  {
    account: mockAtlassianCloudAccount,
    notifications: [mockAtlasifyNotification[0]],
    hasNextPage: false,
    error: null,
  },
];
