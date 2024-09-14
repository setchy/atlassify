import axios, { type Method, type AxiosPromise } from 'axios';
import type { Account } from '../../types';
import { Constants } from '../constants';

export function apiRequestAuth(
  account: Account,
  data = {},
): AxiosPromise | null {
  const auth = btoa(`${account.user.login}:${account.token}`);

  axios.defaults.headers.common.Accept = 'application/json';
  axios.defaults.headers.common.Authorization = `Basic ${auth}`;
  axios.defaults.headers.common['Cache-Control'] = 'no-cache';
  axios.defaults.headers.common['Content-Type'] = 'application/json';

  const method: Method = 'POST';
  const url = Constants.ATLASSIAN_URLS.API;

  return axios({ method, url, data });
}
