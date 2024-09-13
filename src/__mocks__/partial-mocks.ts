import type { Link } from '../types';
import type { Notification, Subject, User } from '../utils/api/typesGitHub';
import { mockAtlasifyUser, mockToken } from './state-mocks';

export function partialMockNotification(
  subject: Partial<Subject>,
): Notification {
  const mockNotification: Partial<Notification> = {
    account: {
      platform: 'Atlassian Cloud',
      method: 'API Token',
      token: mockToken,
      user: mockAtlasifyUser,
    },
    subject: subject as Subject,
  };

  return mockNotification as Notification;
}

export function partialMockUser(login: string): User {
  const mockUser: Partial<User> = {
    login: login,
    html_url: `https://github.com/${login}` as Link,
    avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4' as Link,
    type: 'User',
  };

  return mockUser as User;
}
