import axios, { type AxiosPromise, type Method } from 'axios';
import type { Link, Token } from '../../types';

export function apiRequestAuth(
  url: Link,
  method: Method,
  username: string,
  token: Token,
  data = {},
): AxiosPromise | null {
  axios.defaults.headers.common.Accept = 'application/json';
  axios.defaults.headers.common.Authorization = `Basic ${btoa(`${username}:${token}`)}`;
  axios.defaults.headers.common['Cache-Control'] = 'no-cache';
  axios.defaults.headers.common['Content-Type'] = 'application/json';
  return axios({ method, url, data });
}
