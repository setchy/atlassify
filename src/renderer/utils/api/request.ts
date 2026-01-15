import axios from 'axios';

import type { Account, Token, Username } from '../../types';
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
  const decryptedToken = (await decryptValue(account.token)) as Token;

  return performGraphQLApiRequest<TResult, TVariables>(
    account.username,
    decryptedToken,
    query,
    variables,
  );
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
  return performGraphQLApiRequest<TResult, TVariables>(
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
  const decryptedToken = (await decryptValue(account.token)) as Token;

  return axios({
    method: 'GET',
    url: url,
    headers: getHeaders(account.username, decryptedToken),
  }).then((response) => {
    return response.data;
  }) as Promise<TResult>;
}

/**
 * Perform a GraphQL API request for username and token
 *
 * @param username An Atlassian account username
 * @param token An Atlassian token (decrypted)
 * @param query The GraphQL operation/query statement
 * @param variables The GraphQL operation variables
 * @returns Resolves to an Atlassian GraphQL response
 */
function performGraphQLApiRequest<TResult, TVariables>(
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
    headers: getHeaders(username, token),
  }).then((response) => {
    return response.data;
  }) as Promise<AtlassianGraphQLResponse<TResult>>;
}

/**
 * Construct headers for API requests
 *
 * @param username An Atlassian account username
 * @param token An Atlassian token (decrypted)
 * @returns A headers object to use with API requests
 */
function getHeaders(username: Username, token: Token) {
  const auth = btoa(`${username}:${token}`);
  return {
    Accept: 'application/json',
    Authorization: `Basic ${auth}`,
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
  };
}
