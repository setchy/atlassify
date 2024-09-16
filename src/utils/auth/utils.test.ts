import {
  mockAtlassianCloudAccount,
  mockAuth,
} from '../../__mocks__/state-mocks';
import type { Account } from '../../types';
import * as auth from './utils';

describe('utils/auth/utils.ts', () => {
  describe('removeAccount', () => {
    it('should remove account with matching token', async () => {
      expect(mockAuth.accounts.length).toBe(1);

      const result = auth.removeAccount(mockAuth, mockAtlassianCloudAccount);

      expect(result.accounts.length).toBe(0);
    });

    it('should do nothing if no accounts match', async () => {
      const mockAccount = {
        token: 'unknown-token',
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
});
