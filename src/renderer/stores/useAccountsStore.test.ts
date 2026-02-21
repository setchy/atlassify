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

describe('useAccountsStore', () => {
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

  test('should add an account', () => {
    const { result } = renderHook(() => useAccountsStore());

    act(() => {
      result.current.addAccount(mockAccount);
    });

    expect(result.current.accounts).toHaveLength(1);
    expect(result.current.accounts[0]).toEqual(mockAccount);
  });

  test('should add multiple accounts', () => {
    const { result } = renderHook(() => useAccountsStore());

    act(() => {
      result.current.addAccount(mockAccount);
      result.current.addAccount(mockAccount2);
    });

    expect(result.current.accounts).toHaveLength(2);
    expect(result.current.accounts[0]).toEqual(mockAccount);
    expect(result.current.accounts[1]).toEqual(mockAccount2);
  });

  test('should remove an account', () => {
    const { result } = renderHook(() => useAccountsStore());

    act(() => {
      result.current.addAccount(mockAccount);
      result.current.addAccount(mockAccount2);
      result.current.removeAccount(mockAccount);
    });

    expect(result.current.accounts).toHaveLength(1);
    expect(result.current.accounts[0]).toEqual(mockAccount2);
  });

  test('should not remove account if not found', () => {
    const { result } = renderHook(() => useAccountsStore());

    act(() => {
      result.current.addAccount(mockAccount);
      result.current.removeAccount(mockAccount2);
    });

    expect(result.current.accounts).toHaveLength(1);
    expect(result.current.accounts[0]).toEqual(mockAccount);
  });

  test('should reset accounts to default', () => {
    const { result } = renderHook(() => useAccountsStore());

    act(() => {
      result.current.addAccount(mockAccount);
      result.current.addAccount(mockAccount2);
      result.current.reset();
    });

    expect(result.current).toMatchObject(DEFAULT_ACCOUNTS_STATE);
    expect(result.current.accounts).toEqual([]);
  });
});
