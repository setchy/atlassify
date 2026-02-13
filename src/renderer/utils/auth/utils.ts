import type { AccountsState } from '../../stores/types';

import type { Account, Token, Username } from '../../types';

import { getAuthenticatedUser } from '../api/client';
import { encryptValue } from '../comms';
import { rendererLogError } from '../logger';

export async function addAccount(
  auth: AccountsState,
  username: Username,
  token: Token,
): Promise<AccountsState> {
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

export function removeAccount(
  auth: AccountsState,
  account: Account,
): AccountsState {
  const updatedAccounts = auth.accounts.filter((a) => a.id !== account.id);

  return {
    accounts: updatedAccounts,
  };
}

export async function refreshAccount(account: Account): Promise<Account> {
  try {
    const res = await getAuthenticatedUser(account);

    account.id = res.data.me.user.accountId;
    account.name = res.data.me.user.name;
    account.avatar = res.data.me.user.picture;
  } catch (err) {
    rendererLogError(
      'refreshAccount',
      `failed to refresh account for user ${account.username}`,
      err,
    );
  }

  return account;
}

export function hasAccounts(auth: AccountsState) {
  return auth.accounts.length > 0;
}

export function hasUsernameAlready(auth: AccountsState, username: Username) {
  return auth.accounts.some(
    (a) => a.username.trim().toLowerCase() === username.trim().toLowerCase(),
  );
}
