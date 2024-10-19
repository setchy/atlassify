import log from 'electron-log';
import type { Account, AuthState, Token, Username } from '../../types';
import { getAuthenticatedUser } from '../api/client';
import { encryptValue } from '../comms';

export async function addAccount(
  auth: AuthState,
  username: Username,
  token: Token,
): Promise<AuthState> {
  const encryptedToken = await encryptValue(token);

  let newAccount = {
    username: username,
    token: encryptedToken,
  } as Account;

  // Refresh user data
  newAccount = await refreshAccount(newAccount);

  return {
    accounts: [...auth.accounts, newAccount],
  };
}

export function removeAccount(auth: AuthState, account: Account): AuthState {
  const updatedAccounts = auth.accounts.filter((a) => a.id !== account.id);

  return {
    accounts: updatedAccounts,
  };
}

export async function refreshAccount(account: Account): Promise<Account> {
  try {
    const res = await getAuthenticatedUser(account);

    account.id = res.data.data.me.user.accountId;
    account.name = res.data.data.me.user.name;
    account.avatar = res.data.data.me.user.picture;
  } catch (error) {
    log.error('Failed to refresh account', error);
  }

  return account;
}

export function hasAccounts(auth: AuthState) {
  return auth.accounts.length > 0;
}
