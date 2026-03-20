import type { AtlassifyNotification } from '../../../types';

import { DefaultStrategy } from './default';

export function extractRepositoryName(
  notification: AtlassifyNotification,
): string {
  return notification.entity.url.split('/').slice(3, 5).join('/');
}

class BitbucketStrategy extends DefaultStrategy {
  override footerText(notification: AtlassifyNotification): string {
    return extractRepositoryName(notification);
  }
}

export const bitbucketStrategy = new BitbucketStrategy();
