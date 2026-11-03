import { createMockAccountWithError } from '../../__mocks__/account-mocks';

import type { AccountNotifications } from '../../types';

import i18n from '../../i18n';
import {
  areAllAccountErrorsSame,
  doesAllAccountsHaveErrors,
  Errors,
} from './errors';

describe('renderer/utils/core/errors.ts', () => {
  describe('doesAllAccountsHaveErrors', () => {
    it('returns false for empty list', () => {
      expect(doesAllAccountsHaveErrors([])).toBe(false);
    });

    it('returns false when some accounts have no error', () => {
      const items: AccountNotifications[] = [
        createMockAccountWithError(Errors.NETWORK),
        createMockAccountWithError(null),
      ];

      expect(doesAllAccountsHaveErrors(items)).toBe(false);
    });

    it('returns true when every account has an error', () => {
      const items: AccountNotifications[] = [
        createMockAccountWithError(Errors.NETWORK),
        createMockAccountWithError(Errors.BAD_REQUEST),
      ];

      expect(doesAllAccountsHaveErrors(items)).toBe(true);
    });
  });

  describe('areAllAccountErrorsSame', () => {
    it('returns true for empty list', () => {
      expect(areAllAccountErrorsSame([])).toBe(true);
    });

    it('returns true when all errors are identical object reference', () => {
      const err = Errors.NETWORK;
      const items: AccountNotifications[] = [
        createMockAccountWithError(err),
        createMockAccountWithError(err),
      ];

      expect(areAllAccountErrorsSame(items)).toBe(true);
    });

    it('returns false when errors differ', () => {
      const items: AccountNotifications[] = [
        createMockAccountWithError(Errors.NETWORK),
        createMockAccountWithError(Errors.BAD_REQUEST),
      ];

      expect(areAllAccountErrorsSame(items)).toBe(false);
    });

    it('returns false when one account has null error', () => {
      const items: AccountNotifications[] = [
        createMockAccountWithError(Errors.NETWORK),
        createMockAccountWithError(null),
      ];

      expect(areAllAccountErrorsSame(items)).toBe(false);
    });
  });

  describe('translation reactivity', () => {
    afterEach(async () => {
      await i18n.changeLanguage('en');
    });

    it('exposes translatable strings for every error type', () => {
      const errorTypes = [
        Errors.BAD_CREDENTIALS,
        Errors.BAD_REQUEST,
        Errors.NETWORK,
        Errors.OFFLINE,
        Errors.UNKNOWN,
      ];

      for (const error of errorTypes) {
        expect(error.title.length).toBeGreaterThan(0);
        expect(error.descriptions.length).toBeGreaterThan(0);
        error.actions?.forEach((action) => {
          expect(action.label.length).toBeGreaterThan(0);
        });
      }
    });

    it('resolves translated strings in the current language at access time', async () => {
      const enTitle = Errors.NETWORK.title;
      await i18n.changeLanguage('de');
      const deTitle = Errors.NETWORK.title;

      expect(enTitle).toBe('Network Error');
      expect(deTitle).toBe('Netzwerkfehler');
      expect(deTitle).not.toBe(enTitle);
    });

    it('keeps stable object references across language changes', async () => {
      const before = Errors.NETWORK;
      await i18n.changeLanguage('de');

      expect(Errors.NETWORK).toBe(before);
    });
  });
});
