import log from 'electron-log';

import type { AtlassifyNotification } from '../renderer/types';

export function logInfo(
  type: string,
  message: string,
  notification?: AtlassifyNotification,
) {
  logMessage(log.info, type, message, null, notification);
}

export function logWarn(
  type: string,
  message: string,
  notification?: AtlassifyNotification,
) {
  logMessage(log.warn, type, message, null, notification);
}

export function logError(
  type: string,
  message: string,
  err: Error,
  notification?: AtlassifyNotification,
) {
  logMessage(log.error, type, message, err, notification);
}

function logMessage(
  // biome-ignore lint/suspicious/noExplicitAny: We need to allow any type for the log function parameters
  logFunction: (...params: any[]) => void,
  type: string,
  message: string,
  err?: Error,
  notification?: AtlassifyNotification,
) {
  const args: (string | Error)[] = [`[${type}]`, message];

  if (notification) {
    args.push(`[${notification.entity.title} >> ${notification.message}]`);
  }

  if (err) {
    args.push(err);
  }

  logFunction(...args);
}
