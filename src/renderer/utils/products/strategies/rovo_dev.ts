import type { ActorType, AtlassifyNotification } from '../../../types';

import { DefaultStrategy } from './default';

export function extractRovoDevContextName(
  notification: AtlassifyNotification,
): string {
  const context = new URL(notification.url).pathname.split('/').pop();
  return `The AI coding tool has generated code for ${context}`;
}

class RovoDevStrategy extends DefaultStrategy {
  override bodyText(notification: AtlassifyNotification): string {
    return extractRovoDevContextName(notification);
  }

  override actorType(_notification: AtlassifyNotification): ActorType {
    return 'automation';
  }
}

export const rovoDevStrategy = new RovoDevStrategy();
