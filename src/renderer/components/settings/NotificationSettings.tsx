import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Checkbox } from '@atlaskit/checkbox';
import Heading from '@atlaskit/heading';
import InlineMessage from '@atlaskit/inline-message';
import { Inline, Stack } from '@atlaskit/primitives';

import { APPLICATION } from '../../../shared/constants';

import useSettingsStore from '../../stores/useSettingsStore';

export const NotificationSettings: FC = () => {
  const { t } = useTranslation();

  const updateSetting = useSettingsStore((s) => s.updateSetting);

  const markAsReadOnOpen = useSettingsStore((s) => s.markAsReadOnOpen);
  const groupNotificationsByProductAlphabetically = useSettingsStore(
    (s) => s.groupNotificationsByProductAlphabetically,
  );
  const delayNotificationState = useSettingsStore(
    (s) => s.delayNotificationState,
  );

  return (
    <Stack space="space.100">
      <Heading size="small">{t('settings.notifications.title')}</Heading>

      <Checkbox
        isChecked={markAsReadOnOpen}
        label={t('settings.notifications.mark_as_read_on_open')}
        name="markAsReadOnOpen"
        onChange={() => updateSetting('markAsReadOnOpen', !markAsReadOnOpen)}
      />

      <Inline space="space.100">
        <Checkbox
          isChecked={groupNotificationsByProductAlphabetically}
          label={t('settings.notifications.group_alphabetically')}
          name="groupNotificationsByProductAlphabetically"
          onChange={() =>
            updateSetting(
              'groupNotificationsByProductAlphabetically',
              !groupNotificationsByProductAlphabetically,
            )
          }
        />
        <InlineMessage appearance="info">
          <div className="w-60 text-xs">
            {t('settings.notifications.group_alphabetically_help')}
          </div>
        </InlineMessage>
      </Inline>

      <Inline space="space.100">
        <Checkbox
          isChecked={delayNotificationState}
          label={t('settings.notifications.delay_notification_state')}
          name="delayNotificationState"
          onChange={() =>
            updateSetting('delayNotificationState', !delayNotificationState)
          }
        />
        <InlineMessage appearance="info">
          <div className="w-60 text-xs">
            {t('settings.notifications.delay_notification_state_help', {
              appName: APPLICATION.NAME,
            })}
          </div>
        </InlineMessage>
      </Inline>
    </Stack>
  );
};
