import type { AtlassifyNotification } from '../../../types';

import { DefaultStrategy } from './default';

export function extractGoalOrProjectKey(
  notification: AtlassifyNotification,
): string | null {
  const match = notification.path.url.match(/\/(goal|project)\/([^/]+)\/about/);
  return match ? match[2] : null;
}

class HomeStrategy extends DefaultStrategy {
  override footerText(notification: AtlassifyNotification): string {
    const key = extractGoalOrProjectKey(notification);

    if (key) {
      return `${key}${notification.path.title}`
        .replace('Atlassian Home', '')
        .replace('Goals', '');
    }

    return super.footerText(notification);
  }
}

export const homeStrategy = new HomeStrategy();
