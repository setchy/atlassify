import type { ActorType, AtlassifyNotification } from '../../../types';

import { DefaultStrategy } from './default';

export function extractRovoDevContextName(
  notification: AtlassifyNotification,
): string {
  const context = new URL(notification.url).pathname.split('/').pop();
  return `${notification.message} for ${context}`;
}

class RovoDevStrategy extends DefaultStrategy {
  override bodyText(notification: AtlassifyNotification): string {
    return extractRovoDevContextName(notification);
  }

  override actorType(_notification: AtlassifyNotification): ActorType {
    return 'rovo';
  }
}

export const rovoDevStrategy = new RovoDevStrategy();
