import type { Token, Username } from '../../types';

/**
 * The credentials required to login to an Atlassian account.
 */
export interface LoginOptions {
  /**
   * The username for the account.
   */
  username: Username;

  /**
   * The API token for the account.
   */
  token: Token;
}
