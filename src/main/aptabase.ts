import { initialize, trackEvent } from '@aptabase/electron/main';

import { logError, logInfo } from '../shared/logger';

export async function initializeAptabase(): Promise<void> {
  const aptabaseKey = process.env.APTABASE_KEY;

  if (!aptabaseKey) {
    logError(
      'main:initialize',
      'APTABASE_KEY environment variable is not set',
      new Error('APTABASE_KEY environment variable is not set'),
    );
    return;
  }

  try {
    initialize(aptabaseKey);
    logInfo('aptabase', 'initialized successfully');
  } catch (err) {
    logError('main:initialize', 'Failed to initialize Aptabase', err);
  }
}

export { trackEvent };
