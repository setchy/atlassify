import { initialize, trackEvent } from '@aptabase/electron/main';

import { EVENTS, type IAptabaseEvent } from '../../shared/events';
import { logError, logInfo } from '../../shared/logger';

import { handleMainEvent } from '../events';

/**
 * Initialize the Aptabase analytics SDK using the APTABASE_KEY environment variable.
 */
export async function initializeAnalytics(): Promise<void> {
  const aptabaseKey = process.env.APTABASE_KEY;

  if (!aptabaseKey) {
    logError(
      'analytics',
      'APTABASE_KEY environment variable is not set',
      new Error('APTABASE_KEY environment variable is not set'),
    );
    return;
  }

  try {
    initialize(aptabaseKey);
    logInfo('analytics', 'Aptabase initialized successfully');
  } catch (err) {
    logError('analytics', 'Failed to initialize Aptabase', err);
  }
}

/**
 * Register IPC handlers for analytics events.
 */
export function registerAnalyticsHandlers(): void {
  /**
   * Track an event in Aptabase with the given event name and properties.
   */
  handleMainEvent(EVENTS.APTABASE_TRACK_EVENT, (_, event: IAptabaseEvent) => {
    trackEvent(event.eventName, event.props);
  });
}

export { trackEvent };
