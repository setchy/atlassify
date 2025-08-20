import axios from 'axios';

import type { Account, Token, Username } from '../../types';
import { decryptValue } from '../comms';
import { URLs } from '../links';
import type { TypedDocumentString } from './graphql/generated/graphql';
import type { AtlassianGraphQLResponse } from './types';

export async function performRequestForAccount<TResult, TVariables>(
  account: Account,
  query: TypedDocumentString<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) {
  // TODO consider storing the decrypted token in memory
  const decryptedToken = (await decryptValue(account.token)) as Token;

  return performGraphQLApiRequest<TResult>(account.username, decryptedToken, {
    query,
    variables,
  });
}

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

export async function performRESTRequestForAccount<T>(
  account: Account,
  url: string,
) {
  // decrypt token for REST calls
  const decryptedToken = (await decryptValue(account.token)) as Token;

  return axios({
    method: 'GET',
    url: url,
    headers: getHeaders(account.username, decryptedToken),
  }).then((response) => {
    return response.data;
  }) as Promise<T>;
}

function performGraphQLApiRequest<T>(username: Username, token: Token, data) {
  const url = URLs.ATLASSIAN.API;

  return axios({
    method: 'POST',
    url,
    data,
    headers: getHeaders(username, token),
  }).then((response) => {
    return response.data;
  }) as Promise<AtlassianGraphQLResponse<T>>;
}

function getHeaders(username: Username, token: Token) {
  const auth = btoa(`${username}:${token}`);
  return {
    Accept: 'application/json',
    Authorization: `Basic ${auth}`,
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
  };
}
