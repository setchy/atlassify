import { logError, logInfo, logWarn } from '../../shared/logger';

import type { AtlassifyNotification } from '../types';

// Renderer logger augments log entries with notification context formatting.
export function rendererLogInfo(
  type: string,
  message: string,
  notification?: AtlassifyNotification,
) {
  logInfo(type, message, buildContexts(notification));
}

export function rendererLogWarn(
  type: string,
  message: string,
  notification?: AtlassifyNotification,
) {
  logWarn(type, message, buildContexts(notification));
}

export function rendererLogError(
  type: string,
  message: string,
  err: Error,
  notification?: AtlassifyNotification,
) {
  // Avoid spamming logs with expected offline errors (noisy stack traces).
  if ((err as any)?.isOffline) {
    return;
  }

  logError(type, message, err, buildContexts(notification));
}

function buildContexts(notification?: AtlassifyNotification): string[] {
  if (!notification) {
    return [];
  }
  return [notification.entity.title, notification.message];
}
