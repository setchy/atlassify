import {
  mockAtlassianCloudAccount,
  mockAuth,
} from '../../__mocks__/state-mocks';
import type { Account, Token } from '../../types';
import * as auth from './utils';

describe('utils/auth/utils.ts', () => {
  describe.skip('removeAccount', () => {
    it('should remove account with matching token', async () => {
      expect(mockAuth.accounts.length).toBe(2);

      const result = auth.removeAccount(mockAuth, mockAtlassianCloudAccount);

      expect(result.accounts.length).toBe(1);
    });

    it('should do nothing if no accounts match', async () => {
      const mockAccount = {
        token: 'unknown-token',
      } as Account;

      expect(mockAuth.accounts.length).toBe(2);

      const result = auth.removeAccount(mockAuth, mockAccount);

      expect(result.accounts.length).toBe(2);
    });
  });
});

describe('isValidAPIToken', () => {
  it('should validate token - valid', () => {
    expect(
      auth.isValidAPIToken('1234567890asdfghjklPOIUYTREWQ09' as Token),
    ).toBeTruthy();
  });

  it('should validate token - empty', () => {
    expect(auth.isValidAPIToken('' as Token)).toBeFalsy();
  });

  it('should validate token - invalid', () => {
    expect(auth.isValidAPIToken('1234567890asdfg' as Token)).toBeFalsy();
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

describe('hasMultipleAccounts', () => {
  it('should return true', () => {
    expect(auth.hasMultipleAccounts(mockAuth)).toBeTruthy();
  });

  it('should validate false', () => {
    expect(
      auth.hasMultipleAccounts({
        accounts: [],
      }),
    ).toBeFalsy();
    expect(
      auth.hasMultipleAccounts({
        accounts: [mockAtlassianCloudAccount],
      }),
    ).toBeFalsy();
  });
});
