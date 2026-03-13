import { logError, logInfo, logWarn } from '../../../shared/logger';

import type { AtlassifyNotification } from '../../types';

// Renderer logger augments log entries with notification context formatting.

/**
 * Logs an informational message from the renderer process.
 *
 * @param type - A short label identifying the caller or module (e.g. `'getAllNotifications'`).
 * @param message - The log message.
 * @param notification - Optional notification to include as context in the log entry.
 */
export function rendererLogInfo(
  type: string,
  message: string,
  notification?: AtlassifyNotification,
) {
  logInfo(type, message, buildContexts(notification));
}

/**
 * Logs a warning message from the renderer process.
 *
 * @param type - A short label identifying the caller or module.
 * @param message - The warning message.
 * @param notification - Optional notification to include as context in the log entry.
 */
export function rendererLogWarn(
  type: string,
  message: string,
  notification?: AtlassifyNotification,
) {
  logWarn(type, message, buildContexts(notification));
}

/**
 * Logs an error from the renderer process.
 *
 * @param type - A short label identifying the caller or module.
 * @param message - A description of the error context.
 * @param err - The error object that was caught.
 * @param notification - Optional notification to include as context in the log entry.
 */
export function rendererLogError(
  type: string,
  message: string,
  err: Error,
  notification?: AtlassifyNotification,
) {
  logError(type, message, err, buildContexts(notification));
}

function buildContexts(notification?: AtlassifyNotification): string[] {
  if (!notification) {
    return [];
  }
  return [notification.entity.title, notification.message];
}
