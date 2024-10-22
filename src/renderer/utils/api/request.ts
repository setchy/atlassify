import axios, { type Method } from 'axios';

import type { Account, Token, Username } from '../../types';
import { decryptValue } from '../comms';
import { Constants } from '../constants';
import type { TypedDocumentString } from './graphql/generated/graphql';
import type { AtlassianGraphQLResponse } from './types';

export async function performPostRequest<TResult, TVariables>(
  account: Account,
  query: TypedDocumentString<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) {
  // TODO consider storing the decrypted token in memory
  const decryptedToken = await decryptValue(account.token);
  const auth = btoa(`${account.username}:${decryptedToken}`);

  return performApiRequest<TResult>(auth, 'POST', { query, variables });
}

export function performHeadRequest(username: Username, token: Token) {
  const auth = btoa(`${username}:${token}`);

  return performApiRequest(auth, 'HEAD');
}

function performApiRequest<T>(auth: string, method: Method, data = {}) {
  const url = Constants.ATLASSIAN_URLS.API;

  axios.defaults.headers.common.Accept = '*/*';
  axios.defaults.headers.common.Authorization = `Basic ${auth}`;
  axios.defaults.headers.common['Cache-Control'] = 'no-cache';
  axios.defaults.headers.common['Content-Type'] = 'application/json';

  return axios({ method, url, data }).then((response) => {
    return response.data;
  }) as Promise<AtlassianGraphQLResponse<T>>;
}
