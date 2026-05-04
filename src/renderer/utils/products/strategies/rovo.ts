import type { ActorType, AtlassifyNotification } from '../../../types';

import { DefaultStrategy } from './default';

class RovoStrategy extends DefaultStrategy {
  override actorType(_notification: AtlassifyNotification): ActorType {
    return 'rovo';
  }
}

export const rovoStrategy = new RovoStrategy();
