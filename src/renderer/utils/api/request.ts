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

  return performApiRequest<TResult>(account.username, decryptedToken, {
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
  return performApiRequest<TResult>(username, token, { query, variables });
}

function performApiRequest<T>(username: Username, token: Token, data) {
  const url = URLs.ATLASSIAN.API;

  const auth = btoa(`${username}:${token}`);

  return axios({
    method: 'POST',
    url,
    data,
    headers: {
      Accept: '*/*',
      Authorization: `Basic ${auth}`,
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    return response.data;
  }) as Promise<AtlassianGraphQLResponse<T>>;
}
