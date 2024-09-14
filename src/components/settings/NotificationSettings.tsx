import { type FC, useContext } from 'react';

import { Checkbox } from '@atlaskit/checkbox';
import Heading from '@atlaskit/heading';
import { Inline, Stack, Text } from '@atlaskit/primitives';
import { RadioGroup } from '@atlaskit/radio';
import type { OptionsPropType } from '@atlaskit/radio/types';

import InlineMessage from '@atlaskit/inline-message';
import { AppContext } from '../../context/App';
import { GroupBy } from '../../types';

export const NotificationSettings: FC = () => {
  const { settings, updateSetting } = useContext(AppContext);

  const groupByOptions: OptionsPropType = [
    { name: 'groupBy', label: 'Date', value: GroupBy.DATE },
    { name: 'openLinks', label: 'Product', value: GroupBy.PRODUCT },
  ];

  return (
    <Stack space="space.100">
      <Heading size="small">Notifications</Heading>

      <Inline space="space.100">
        <Text id="groupBy-label" weight="medium">
          Group by:
        </Text>
        <RadioGroup
          options={groupByOptions}
          defaultValue={settings.groupBy}
          value={settings.groupBy}
          onChange={(evt) => {
            updateSetting('groupBy', evt.target.value as GroupBy);
          }}
          aria-labelledby="groupBy-label"
        />
      </Inline>

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
