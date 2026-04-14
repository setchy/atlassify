import type { AtlassifyNotification } from '../../../types';
import type { ProductNotificationStrategy } from './types';

export class DefaultStrategy implements ProductNotificationStrategy {
  bodyText(notification: AtlassifyNotification): string {
    return notification.entity.title;
  }

  footerText(notification: AtlassifyNotification): string {
    if (notification.path) {
      return notification.path.title;
    }
    return notification.product.display;
  }

  avatarAppearance(_notification: AtlassifyNotification): 'circle' | 'square' {
    return 'circle';
  }

  isAutomationActor(notification: AtlassifyNotification): boolean {
    if (!notification.actor.displayName) {
      return true;
    }

    if (notification.actor.displayName?.startsWith('Automation for')) {
      return true;
    }

    return false;
  }

  isRovoActor(_notification: AtlassifyNotification): boolean {
    return false;
  }
}

export const defaultStrategy = new DefaultStrategy();
