import type { ActorType, AtlassifyNotification } from '../../../types';

export interface ProductNotificationStrategy {
  /**
   * The primary body text displayed for the notification.
   */
  bodyText(notification: AtlassifyNotification): string;

  /**
   * The footer text displayed below the notification body (e.g. project, path, or repo).
   */
  footerText(notification: AtlassifyNotification): string;

  /**
   * The shape of the actor avatar — `circle` for users, `square` for bots/services.
   */
  avatarAppearance(notification: AtlassifyNotification): 'circle' | 'square';

  /**
   * Returns the notification actor type.
   */
  actorType(notification: AtlassifyNotification): ActorType;
}
