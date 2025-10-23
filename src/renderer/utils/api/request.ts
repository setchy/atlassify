// Replaced axios with native fetch

import type { Account, Token, Username } from '../../types';
import { decryptValue } from '../comms';
import { URLs } from '../links';
import type { TypedDocumentString } from './graphql/generated/graphql';
import type { AtlassianGraphQLResponse } from './types';

/**
 * Perform a GraphQL API request for account
 *
 * @param account
 * @param query
 * @param variables
 * @returns
 */
export async function performRequestForAccount<TResult, TVariables>(
  account: Account,
  query: TypedDocumentString<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) {
  const decryptedToken = (await decryptValue(account.token)) as Token;

  return performGraphQLApiRequest<TResult>(account.username, decryptedToken, {
    query,
    variables,
  });
}

/**
 * Perform a GraphQL API request for username and token
 *
 * @param username
 * @param token
 * @param query
 * @param variables
 * @returns
 */
export async function performRequestForCredentials<TResult, TVariables>(
  username: Username,
  token: Token,
  query: TypedDocumentString<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) {
  return performGraphQLApiRequest<TResult>(username, token, {
    query,
    variables,
  });
}

/**
 * Perform a REST API request for account
 *
 * @param account
 * @param url
 * @returns
 */
export async function performRESTRequestForAccount<T>(
  account: Account,
  url: string,
) {
  const decryptedToken = (await decryptValue(account.token)) as Token;

  const res = await safeFetch(url, {
    method: 'GET',
    headers: getHeaders(account.username, decryptedToken),
  });

  return (await res.json()) as T;
}

/**
 * Perform a GraphQL API request for username and token
 *
 * @param username
 * @param token
 * @param data
 * @returns
 */
function performGraphQLApiRequest<T>(username: Username, token: Token, data) {
  const url = URLs.ATLASSIAN.API;

  return safeFetch(url, {
    method: 'POST',
    headers: getHeaders(username, token),
    body: JSON.stringify(data),
  }).then(async (response) => {
    return (await response.json()) as AtlassianGraphQLResponse<T>;
  });
}

/**
 * Construct headers for API requests
 *
 * @param username
 * @param token
 * @returns
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

/**
 * Thin wrapper around fetch that throws on non-2xx and maps to a simple error shape
 * consumed by determineFailureType().
 */
async function safeFetch(url: string, init: RequestInit): Promise<Response> {
  type HttpLikeError = Error & {
    code?: string;
    response?: { status?: number };
  };
  try {
    const res = await fetch(url, init);
    if (!res.ok) {
      // Construct an error compatible with determineFailureType()
      const err = new Error(
        res.statusText || 'Request failed',
      ) as HttpLikeError;
      err.response = { status: res.status };
      throw err;
    }
    return res;
  } catch (e) {
    // Map network-like errors
    const errObj = e as HttpLikeError;
    if (errObj && typeof errObj === 'object' && errObj.response?.status) {
      throw errObj;
    }
    const err = (
      e instanceof Error ? e : new Error('Network Error')
    ) as HttpLikeError;
    // align with previous AxiosError.ERR_NETWORK string check
    err.code = 'ERR_NETWORK';
    throw err;
  }
}
