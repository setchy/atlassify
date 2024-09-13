import type { Token, Username } from '../../types';

export type AuthMethod = 'API Token';

export type PlatformType = 'Atlassian Cloud';

export interface LoginAPITokenOptions {
  username: Username;
  token: Token;
}
