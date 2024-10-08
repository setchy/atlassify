import axios, { type Method, type AxiosPromise } from 'axios';
import type { Account, Token, Username } from '../../types';
import { decryptValue } from '../comms';
import { Constants } from '../constants';
import type { GraphQLRequest } from './types';

export async function performPostRequest(
  account: Account,
  data: GraphQLRequest,
): AxiosPromise {
  // TODO consider storing the decrypted token in memory
  const decryptedToken = await decryptValue(account.token);
  const auth = btoa(`${account.username}:${decryptedToken}`);

  return performApiRequest(auth, 'POST', data);
}

export function performHeadRequest(
  username: Username,
  token: Token,
): AxiosPromise | null {
  const auth = btoa(`${username}:${token}`);

  return performApiRequest(auth, 'HEAD');
}

function performApiRequest(
  auth: string,
  method: Method,
  data = {},
): AxiosPromise | null {
  const url = Constants.ATLASSIAN_URLS.API;

  axios.defaults.headers.common.Accept = '*/*';
  axios.defaults.headers.common.Authorization = `Basic ${auth}`;
  axios.defaults.headers.common['Cache-Control'] = 'no-cache';
  axios.defaults.headers.common['Content-Type'] = 'application/json';

  return axios({ method, url, data });
}
