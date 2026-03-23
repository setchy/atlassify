import type {
  ActorType,
  AtlassifyNotification,
  EngagementStateType,
} from '../../../types';
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

  actorType(notification: AtlassifyNotification): ActorType {
    const displayName = notification.actor.displayName;

    if (!displayName) {
      return 'automation';
    }

    // Check for "Automation for" prefix
    if (displayName.startsWith('Automation for')) {
      return 'automation';
    }

    return 'user';
  }

  engagementState(notification: AtlassifyNotification): EngagementStateType {
    const message = notification.message;

    if (message.includes(' mentioned ')) {
      return 'mention';
    }

    if (message.includes(' replied ')) {
      return 'comment';
    }

    if (/ reacted.+to your /.exec(message)) {
      return 'reaction';
    }

    return 'other';
  }
}

export const defaultStrategy = new DefaultStrategy();
