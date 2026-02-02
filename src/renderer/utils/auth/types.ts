import type { AuthMethod, Token, Username } from '../../types';

/**
 * The credentials required to login to an Atlassian account using API Token.
 */
export interface ApiTokenLoginOptions {
  /**
   * The authentication method.
   */
  authMethod: AuthMethod.API_TOKEN;

  /**
   * The username for the account.
   */
  username: Username;

  /**
   * The API token for the account.
   */
  token: Token;
}

/**
 * The credentials required to login to an Atlassian account using OAuth.
 */
export interface OAuthLoginOptions {
  /**
   * The authentication method.
   */
  authMethod: AuthMethod.OAUTH;

  /**
   * The username for the account.
   */
  username: Username;

  /**
   * The OAuth access token for the account.
   */
  accessToken: string;

  /**
   * The OAuth refresh token for the account.
   */
  refreshToken: string;
}

/**
 * The credentials required to login to an Atlassian account.
 */
export type LoginOptions = ApiTokenLoginOptions | OAuthLoginOptions;
