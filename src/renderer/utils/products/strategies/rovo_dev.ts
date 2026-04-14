import type { AtlassifyNotification } from '../../../types';

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

  override isRovoActor(): boolean {
    return true;
  }
}

export const rovoDevStrategy = new RovoDevStrategy();
