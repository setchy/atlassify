import type { ActorType, AtlassifyNotification } from '../../../types';

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

  override actorType(notification: AtlassifyNotification): ActorType {
    if (notification.actor.displayName === 'Rovo Dev') {
      return 'rovo';
    }

    return 'user';
  }
}

export const bitbucketStrategy = new BitbucketStrategy();
