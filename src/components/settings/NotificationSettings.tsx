import { type FC, useContext } from 'react';

import { BellIcon } from '@primer/octicons-react';

import { Checkbox } from '@atlaskit/checkbox';
import { Inline, Stack } from '@atlaskit/primitives';

import { AppContext } from '../../context/App';
import { GroupBy } from '../../types';
import { RadioGroup } from '../fields/RadioGroup';
import { Legend } from './Legend';
import InlineMessage from '@atlaskit/inline-message';

export const NotificationSettings: FC = () => {
  const { settings, updateSetting } = useContext(AppContext);

  return (
    <fieldset>
      <Legend icon={BellIcon}>Notifications</Legend>

      <RadioGroup
        name="groupBy"
        label="Group by:"
        value={settings.groupBy}
        options={[
          { label: 'Date', value: GroupBy.DATE },
          { label: 'Product', value: GroupBy.PRODUCT },
        ]}
        onChange={(evt) => {
          updateSetting('groupBy', evt.target.value as GroupBy);
        }}
      />

      <Stack space="space.150">
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
    </fieldset>
  );
};
