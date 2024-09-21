import axios, { type Method, type AxiosPromise } from 'axios';
import type { Account, Token, Username } from '../../types';
import { Constants } from '../constants';

export function performPostRequest(
  account: Account,
  data = {},
): AxiosPromise | null {
  const auth = btoa(`${account.user.login}:${account.token}`);

  const method: Method = 'POST';

  return performApiRequest(auth, method, data);
}

export function performHeadRequest(
  username: Username,
  token: Token,
): AxiosPromise | null {
  const auth = btoa(`${username}:${token}`);

  const method: Method = 'HEAD';

  return performApiRequest(auth, method, {});
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
