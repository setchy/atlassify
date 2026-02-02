import type { Account, AuthState, Username } from '../../types';
import type { LoginOptions } from './types';

import { getAuthenticatedUser } from '../api/client';
import { encryptValue } from '../comms';
import { rendererLogError } from '../logger';

export async function addAccount(
  auth: AuthState,
  loginOptions: LoginOptions,
): Promise<AuthState> {
  let newAccount: Account;

  if (loginOptions.authMethod === 'API_TOKEN') {
    const encryptedToken = await encryptValue(loginOptions.token);
    newAccount = {
      username: loginOptions.username,
      authMethod: loginOptions.authMethod,
      token: encryptedToken,
    } as Account;
  } else {
    // OAuth
    const encryptedAccessToken = await encryptValue(loginOptions.accessToken);
    const encryptedRefreshToken = await encryptValue(loginOptions.refreshToken);
    newAccount = {
      username: loginOptions.username,
      authMethod: loginOptions.authMethod,
      oauthAccessToken: encryptedAccessToken,
      oauthRefreshToken: encryptedRefreshToken,
    } as Account;
  }

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

export function hasAccounts(auth: AuthState) {
  return auth.accounts.length > 0;
}

export function hasUsernameAlready(auth: AuthState, username: Username) {
  return auth.accounts.some(
    (a) => a.username.trim().toLowerCase() === username.trim().toLowerCase(),
  );
}
