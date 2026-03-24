import type {
  ActorType,
  AtlassifyNotification,
  EngagementStateType,
} from '../../../types';

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
   * The type of the notification actor.
   */
  actorType(notification: AtlassifyNotification): ActorType;

  /**
   * Infers the engagement state of the notification based on its message content.
   */
  engagementState(notification: AtlassifyNotification): EngagementStateType;
}
