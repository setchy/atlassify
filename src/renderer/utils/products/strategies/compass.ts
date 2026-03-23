import type { AtlassifyNotification } from '../../../types';

import { DefaultStrategy } from './default';

/**
 * Returns true if this is a Compass scorecard notification.
 * Product type is already guaranteed by the strategy registry — only the message check is needed.
 */
function isCompassScorecardNotification(
  notification: AtlassifyNotification,
): boolean {
  return notification.message.includes('a scorecard');
}

class CompassStrategy extends DefaultStrategy {
  override avatarAppearance(
    notification: AtlassifyNotification,
  ): 'circle' | 'square' {
    return isCompassScorecardNotification(notification) ? 'square' : 'circle';
  }

  override actorType(notification: AtlassifyNotification) {
    if (isCompassScorecardNotification(notification)) {
      return 'automation';
    }

    return super.actorType(notification);
  }
}

export const compassStrategy = new CompassStrategy();
