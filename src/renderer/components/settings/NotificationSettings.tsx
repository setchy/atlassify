import { type FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { Checkbox } from '@atlaskit/checkbox';
import Heading from '@atlaskit/heading';
import InlineMessage from '@atlaskit/inline-message';
import { Inline, Stack } from '@atlaskit/primitives';

import { APPLICATION } from '../../../shared/constants';
import { AppContext } from '../../context/App';

export const NotificationSettings: FC = () => {
  const { settings, updateSetting } = useContext(AppContext);
  const { t } = useTranslation();

  return (
    <Stack space="space.100">
      <Heading size="small">{t('common.notifications')}</Heading>

      <Checkbox
        name="markAsReadOnOpen"
        label={t('settings.mark_as_read_on_open')}
        isChecked={settings.markAsReadOnOpen}
        onChange={(evt) =>
          updateSetting('markAsReadOnOpen', evt.target.checked)
        }
      />

      <Inline space="space.100">
        <Checkbox
          name="groupNotificationsByProductAlphabetically"
          label={t('settings.group_alphabetically')}
          isChecked={settings.groupNotificationsByProductAlphabetically}
          onChange={(evt) =>
            updateSetting(
              'groupNotificationsByProductAlphabetically',
              evt.target.checked,
            )
          }
        />
        <InlineMessage appearance="info">
          <div className="w-60 text-xs">
            {t('settings.group_alphabetically_help')}
          </div>
        </InlineMessage>
      </Inline>

      <Inline space="space.100">
        <Checkbox
          name="delayNotificationState"
          label={t('settings.delay_notification_state')}
          isChecked={settings.delayNotificationState}
          onChange={(evt) =>
            updateSetting('delayNotificationState', evt.target.checked)
          }
        />
        <InlineMessage appearance="info">
          <div className="w-60 text-xs">
            {t('settings.delay_notification_state_help', {
              appName: APPLICATION.NAME,
            })}
          </div>
        </InlineMessage>
      </Inline>
    </Stack>
  );
};
