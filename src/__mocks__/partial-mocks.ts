import type { AtlasifyNotification, Link } from '../types';
import type { Subject, User } from '../utils/api/types';

export function partialMockNotification(
  subject: Partial<Subject>,
): AtlasifyNotification {
  const mockNotification: Partial<AtlasifyNotification> = {
    subject: subject as Subject,
  };

  return mockNotification as AtlasifyNotification;
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
