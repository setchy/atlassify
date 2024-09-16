import log from 'electron-log';
import type { Account, AuthState, Link, Token, Username } from '../../types';
import { getAuthenticatedUser } from '../api/client';
import type { AuthMethod } from './types';

export async function addAccount(
  auth: AuthState,
  username: Username,
  token: Token,
): Promise<AuthState> {
  let newAccount = {
    method: 'API Token' as AuthMethod,
    platform: 'Atlassian Cloud',
    token: token,
    user: {
      id: '0',
      login: username,
      name: username,
      avatar: '' as Link,
    },
  } as Account;

  // Refresh user data
  newAccount = await refreshAccount(newAccount);

  return {
    accounts: [...auth.accounts, newAccount],
  };
}

export function removeAccount(auth: AuthState, account: Account): AuthState {
  const updatedAccounts = auth.accounts.filter(
    (a) => a.token !== account.token,
  );

  return {
    accounts: updatedAccounts,
  };
}

export async function refreshAccount(account: Account): Promise<Account> {
  try {
    const res = await getAuthenticatedUser(account);

    // Refresh user data
    account.user = {
      id: res.data.data.me.user.accountId,
      login: account.user.login,
      name: res.data.data.me.user.name,
      avatar: res.data.data.me.user.picture,
    };
  } catch (error) {
    log.error('Failed to refresh account', error);
  }

  return account;
}

export function getAccountUUID(account: Account): string {
  return btoa(`${account.platform}-${account.user.id}-${account.method}`);
}

export function hasAccounts(auth: AuthState) {
  return auth.accounts.length > 0;
}
