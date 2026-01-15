import { mockAtlassianCloudAccount } from '../../__mocks__/account-mocks';
import { mockAuth } from '../../__mocks__/state-mocks';

import type { Account, Username } from '../../types';

import * as auth from './utils';

describe('renderer/utils/auth/utils.ts', () => {
  describe('removeAccount', () => {
    it('should remove account with matching token', async () => {
      expect(mockAuth.accounts.length).toBe(1);

      const result = auth.removeAccount(mockAuth, mockAtlassianCloudAccount);

      expect(result.accounts.length).toBe(0);
    });

    it('should do nothing if no accounts match', async () => {
      const mockAccount = {
        id: 'some-id',
      } as Account;

      expect(mockAuth.accounts.length).toBe(1);

      const result = auth.removeAccount(mockAuth, mockAccount);

      expect(result.accounts.length).toBe(1);
    });
  });
});

describe('hasAccounts', () => {
  it('should return true', () => {
    expect(auth.hasAccounts(mockAuth)).toBeTruthy();
  });

  it('should validate false', () => {
    expect(
      auth.hasAccounts({
        accounts: [],
      }),
    ).toBeFalsy();
  });

  describe('hasUsernameAlready', () => {
    it('should return true', () => {
      expect(
        auth.hasUsernameAlready(mockAuth, mockAtlassianCloudAccount.username),
      ).toBeTruthy();
    });

    it('should validate false', () => {
      expect(
        auth.hasUsernameAlready(mockAuth, 'some-other-username' as Username),
      ).toBeFalsy();
    });
  });
});
