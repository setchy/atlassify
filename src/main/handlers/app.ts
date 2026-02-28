import { app } from 'electron';

import { trackEvent } from '@aptabase/electron/main';

import { EVENTS, type IAptabaseEvent } from '../../shared/events';

import { Paths } from '../config';
import { handleMainEvent } from '../events';

export function registerAppHandlers(): void {
  handleMainEvent(EVENTS.VERSION, () => app.getVersion());

  handleMainEvent(EVENTS.NOTIFICATION_SOUND_PATH, () => {
    return Paths.notificationSound;
  });

  handleMainEvent(EVENTS.TWEMOJI_DIRECTORY, () => {
    return Paths.twemojiFolder;
  });

  handleMainEvent(EVENTS.APTABASE_TRACK_EVENT, (_, event: IAptabaseEvent) => {
    trackEvent(event.eventName, event.props);
  });
}
