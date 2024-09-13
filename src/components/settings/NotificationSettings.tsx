import { BellIcon } from '@primer/octicons-react';
import { type FC, useContext } from 'react';
import { AppContext } from '../../context/App';
import { GroupBy } from '../../types';
import { Checkbox } from '../fields/Checkbox';
import { RadioGroup } from '../fields/RadioGroup';
import { Legend } from './Legend';

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
          { label: 'Repository', value: GroupBy.REPOSITORY },
          { label: 'Date', value: GroupBy.DATE },
        ]}
        onChange={(evt) => {
          updateSetting('groupBy', evt.target.value as GroupBy);
        }}
      />

      <Checkbox
        name="delayNotificationState"
        label="Delay notification state"
        checked={settings.delayNotificationState}
        onChange={(evt) =>
          updateSetting('delayNotificationState', evt.target.checked)
        }
        tooltip={
          <div>
            Keep the notification within Atlasify window upon interaction
            (click, mark as read, mark as done, etc) until the next refresh
            window (scheduled or user initiated).
          </div>
        }
      />
    </fieldset>
  );
};
