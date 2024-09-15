import { type FC, useContext } from 'react';

import { Checkbox } from '@atlaskit/checkbox';
import Heading from '@atlaskit/heading';
import { Inline, Stack } from '@atlaskit/primitives';

import InlineMessage from '@atlaskit/inline-message';
import { AppContext } from '../../context/App';

export const NotificationSettings: FC = () => {
  const { settings, updateSetting } = useContext(AppContext);

  return (
    <Stack space="space.100">
      <Heading size="small">Notifications</Heading>

      <Checkbox
        name="markAsReadOnOpen"
        label="Mark as read on open"
        isChecked={settings.markAsReadOnOpen}
        onChange={(evt) =>
          updateSetting('markAsReadOnOpen', evt.target.checked)
        }
      />

      <Inline space="space.100">
        <Checkbox
          name="delayNotificationState"
          label="Delay notification state"
          isChecked={settings.delayNotificationState}
          onChange={(evt) =>
            updateSetting('delayNotificationState', evt.target.checked)
          }
        />
        <InlineMessage appearance="info">
          <div className="w-60 text-xs">
            <div>
              Keep the notification within Atlasify window upon interaction
              (click, mark as read, mark as done, etc) until the next refresh
              window (scheduled or user initiated).
            </div>
          </div>
        </InlineMessage>
      </Inline>
    </Stack>
  );
};
