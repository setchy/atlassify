import type { AccountNotifications } from '../types';
import { mockGitHubNotifications } from '../utils/api/__mocks__/response-mocks';
import { mockAtlassianCloudAccount } from './state-mocks';

export const mockAccountNotifications: AccountNotifications[] = [
  {
    account: mockAtlassianCloudAccount,
    notifications: mockGitHubNotifications,
    error: null,
  },
];

export const mockSingleAccountNotifications: AccountNotifications[] = [
  {
    account: mockAtlassianCloudAccount,
    notifications: [mockGitHubNotifications[0]],
    error: null,
  },
];
