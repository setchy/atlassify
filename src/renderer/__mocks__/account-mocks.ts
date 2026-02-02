import type {
  Account,
  AccountNotifications,
  AtlassifyError,
  EncryptedToken,
  Link,
  Username,
} from '../types';
import { AuthMethod } from '../types';

export const mockAtlassianCloudAccount: Account = {
  id: '123456789',
  username: 'user@atlassify.io' as Username,
  authMethod: AuthMethod.API_TOKEN,
  token: 'token-123-456' as EncryptedToken,
  name: 'Atlassify',
  avatar: 'https://avatar.atlassify.io' as Link,
};

export const mockAtlassianCloudAccountTwo: Account = {
  id: '987654321',
  username: 'other@atlassify.io' as Username,
  authMethod: AuthMethod.API_TOKEN,
  token: 'token-abc-xyz' as EncryptedToken,
  name: 'Another One',
  avatar: 'https://avatar.atlassify.io' as Link,
};

export function createMockAccountWithError(
  error: AtlassifyError,
): AccountNotifications {
  return {
    account: mockAtlassianCloudAccount,
    notifications: [],
    hasMoreNotifications: false,
    error,
  };
}
