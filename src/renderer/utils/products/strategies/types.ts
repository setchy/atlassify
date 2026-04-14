import type { AtlassifyNotification } from '../../../types';

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
   * Returns `true` if the notification actor should be treated as an automation (bot/service).
   */
  isAutomationActor(notification: AtlassifyNotification): boolean;

  /**
   * Returns `true` if the notification actor should be treated as Rovo.
   */
  isRovoActor(notification: AtlassifyNotification): boolean;
}
