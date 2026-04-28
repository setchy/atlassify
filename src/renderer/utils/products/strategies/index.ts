import type { AtlassifyNotification } from '../../../types';
import type { ProductNotificationStrategy } from './types';

import { bitbucketStrategy } from './bitbucket';
import { compassStrategy } from './compass';
import { defaultStrategy } from './default';
import { homeStrategy } from './home';
import { rovoStrategy } from './rovo';
import { rovoDevStrategy } from './rovo_dev';

export function getProductStrategy(
  notification: AtlassifyNotification,
): ProductNotificationStrategy {
  switch (notification.product.type) {
    case 'bitbucket':
      return bitbucketStrategy;
    case 'compass':
      return compassStrategy;
    case 'home':
      return homeStrategy;
    case 'rovo':
      return rovoStrategy;
    case 'rovo_dev':
      return rovoDevStrategy;
    default:
      return defaultStrategy;
  }
}
