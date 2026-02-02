import axios from 'axios';

import type { Account, OAuthAccessToken, Token, Username } from '../../types';
import type { AtlassianGraphQLResponse } from './types';

import { decryptValue } from '../comms';
import { URLs } from '../links';
import type { TypedDocumentString } from './graphql/generated/graphql';

/**
 * Perform a GraphQL API request for an account
 *
 * @param account An Atlassian account
 * @param query The GraphQL operation/query statement
 * @param variables The GraphQL operation variables
 * @returns Resolves to an Atlassian GraphQL response
 */
export async function performRequestForAccount<TResult, TVariables>(
  account: Account,
  query: TypedDocumentString<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
): Promise<AtlassianGraphQLResponse<TResult>> {
  if (account.authMethod === 'API_TOKEN') {
    const decryptedToken = (await decryptValue(account.token!)) as Token;
    return performGraphQLApiRequestWithBasicAuth<TResult, TVariables>(
      account.username,
      decryptedToken,
      query,
      variables,
    );
  } else {
    // OAuth
    const decryptedAccessToken = (await decryptValue(account.oauthAccessToken!)) as OAuthAccessToken;
    return performGraphQLApiRequestWithOAuth<TResult, TVariables>(
      decryptedAccessToken,
      query,
      variables,
    );
  }
}

/**
 * Perform a GraphQL API request for a username and token
 *
 * @param username An Atlassian account username
 * @param token An Atlassian token (decrypted)
 * @param query The GraphQL operation/query statement
 * @param variables The GraphQL operation variables
 * @returns Resolves to an Atlassian GraphQL response
 */
export async function performRequestForCredentials<TResult, TVariables>(
  username: Username,
  token: Token,
  query: TypedDocumentString<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
): Promise<AtlassianGraphQLResponse<TResult>> {
  return performGraphQLApiRequestWithBasicAuth<TResult, TVariables>(
    username,
    token,
    query,
    variables,
  );
}

/**
 * Perform a REST API request for an Atlassian account
 *
 * @param url The API endpoint
 * @param account An Atlassian account
 * @returns Resolves to an Atlassian REST response
 */
export async function performRESTRequestForAccount<TResult>(
  url: string,
  account: Account,
): Promise<TResult> {
  let headers: Record<string, string>;

  if (account.authMethod === 'API_TOKEN') {
    const decryptedToken = (await decryptValue(account.token!)) as Token;
    headers = getBasicAuthHeaders(account.username, decryptedToken);
  } else {
    // OAuth
    const decryptedAccessToken = (await decryptValue(account.oauthAccessToken!)) as OAuthAccessToken;
    headers = getOAuthHeaders(decryptedAccessToken);
  }

  return axios({
    method: 'GET',
    url: url,
    headers,
  }).then((response) => {
    return response.data;
  }) as Promise<TResult>;
}

/**
 * Perform a GraphQL API request with Basic Authentication (username + API token)
 *
 * @param username An Atlassian account username
 * @param token An Atlassian token (decrypted)
 * @param query The GraphQL operation/query statement
 * @param variables The GraphQL operation variables
 * @returns Resolves to an Atlassian GraphQL response
 */
function performGraphQLApiRequestWithBasicAuth<TResult, TVariables>(
  username: Username,
  token: Token,
  query: TypedDocumentString<TResult, TVariables>,
  variables: TVariables,
): Promise<AtlassianGraphQLResponse<TResult>> {
  const url = URLs.ATLASSIAN.API;

  return axios({
    method: 'POST',
    url,
    data: {
      query,
      variables,
    },
    headers: getBasicAuthHeaders(username, token),
  }).then((response) => {
    return response.data;
  }) as Promise<AtlassianGraphQLResponse<TResult>>;
}

/**
 * Perform a GraphQL API request with OAuth Bearer token
 *
 * @param accessToken An OAuth access token (decrypted)
 * @param query The GraphQL operation/query statement
 * @param variables The GraphQL operation variables
 * @returns Resolves to an Atlassian GraphQL response
 */
function performGraphQLApiRequestWithOAuth<TResult, TVariables>(
  accessToken: OAuthAccessToken,
  query: TypedDocumentString<TResult, TVariables>,
  variables: TVariables,
): Promise<AtlassianGraphQLResponse<TResult>> {
  const url = URLs.ATLASSIAN.API;

  return axios({
    method: 'POST',
    url,
    data: {
      query,
      variables,
    },
    headers: getOAuthHeaders(accessToken),
  }).then((response) => {
    return response.data;
  }) as Promise<AtlassianGraphQLResponse<TResult>>;
}

/**
 * Construct headers for Basic Auth API requests
 *
 * @param username An Atlassian account username
 * @param token An Atlassian token (decrypted)
 * @returns A headers object to use with API requests
 */
function getBasicAuthHeaders(username: Username, token: Token) {
  const auth = btoa(`${username}:${token}`);
  return {
    Accept: 'application/json',
    Authorization: `Basic ${auth}`,
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
  };
}

/**
 * Construct headers for OAuth API requests
 *
 * @param accessToken An OAuth access token (decrypted)
 * @returns A headers object to use with API requests
 */
function getOAuthHeaders(accessToken: OAuthAccessToken) {
  return {
    Accept: 'application/json',
    Authorization: `Bearer ${accessToken}`,
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
  };
}
