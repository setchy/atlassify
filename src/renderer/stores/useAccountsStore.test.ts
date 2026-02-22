import { act, renderHook } from '@testing-library/react';

import type { Account, EncryptedToken, Link, Username } from '../types';

import { DEFAULT_ACCOUNTS_STATE } from './defaults';
import useAccountsStore from './useAccountsStore';

const mockAccount: Account = {
  id: '123',
  username: 'test@example.com' as Username,
  token: 'encrypted-token' as EncryptedToken,
  name: 'Test User',
  avatar: null,
};

const mockAccount2: Account = {
  id: '456',
  username: 'test2@example.com' as Username,
  token: 'encrypted-token-2' as EncryptedToken,
  name: 'Test User 2',
  avatar: 'https://example.com/avatar.png' as Link,
};

describe('renderer/stores/useAccountsStore.ts', () => {
  beforeEach(() => {
    useAccountsStore.setState({ ...DEFAULT_ACCOUNTS_STATE });
  });

  test('should start with default accounts', () => {
    const { result } = renderHook(() => useAccountsStore());

    expect(result.current).toMatchObject(DEFAULT_ACCOUNTS_STATE);
  });

  test('should start with default state', () => {
    const { result } = renderHook(() => useAccountsStore());

    expect(result.current.accounts).toEqual([]);
  });

  test('should remove an account', () => {
    useAccountsStore.setState({ accounts: [mockAccount, mockAccount2] });

    const { result } = renderHook(() => useAccountsStore());

    act(() => {
      result.current.removeAccount(mockAccount);
    });

    expect(result.current.accounts).toHaveLength(1);
    expect(result.current.accounts[0]).toEqual(mockAccount2);
  });

  test('should not remove account if not found', () => {
    useAccountsStore.setState({ accounts: [mockAccount] });

    const { result } = renderHook(() => useAccountsStore());

    act(() => {
      result.current.removeAccount(mockAccount2);
    });

    expect(result.current.accounts).toHaveLength(1);
    expect(result.current.accounts[0]).toEqual(mockAccount);
  });

  test('should reset accounts to default', () => {
    useAccountsStore.setState({ accounts: [mockAccount, mockAccount2] });

    const { result } = renderHook(() => useAccountsStore());

    act(() => {
      result.current.reset();
    });

    expect(result.current).toMatchObject(DEFAULT_ACCOUNTS_STATE);
    expect(result.current.accounts).toEqual([]);
  });
});
