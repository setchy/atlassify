import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Checkbox } from '@atlaskit/checkbox';
import Heading from '@atlaskit/heading';
import InlineMessage from '@atlaskit/inline-message';
import { Inline, Stack } from '@atlaskit/primitives';

import { APPLICATION } from '../../../shared/constants';

import { useAppContext } from '../../hooks/useAppContext';

export const NotificationSettings: FC = () => {
  const { settings, updateSetting } = useAppContext();

  const { t } = useTranslation();

  return (
    <Stack space="space.100">
      <Heading size="small">{t('settings.notifications.title')}</Heading>

      <Checkbox
        isChecked={settings.markAsReadOnOpen}
        label={t('settings.notifications.mark_as_read_on_open')}
        name="markAsReadOnOpen"
        onChange={() =>
          updateSetting('markAsReadOnOpen', !settings.markAsReadOnOpen)
        }
      />

      <Inline space="space.100">
        <Checkbox
          isChecked={settings.groupNotificationsByProductAlphabetically}
          label={t('settings.notifications.group_alphabetically')}
          name="groupNotificationsByProductAlphabetically"
          onChange={() =>
            updateSetting(
              'groupNotificationsByProductAlphabetically',
              !settings.groupNotificationsByProductAlphabetically,
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
          isChecked={settings.delayNotificationState}
          label={t('settings.notifications.delay_notification_state')}
          name="delayNotificationState"
          onChange={() =>
            updateSetting(
              'delayNotificationState',
              !settings.delayNotificationState,
            )
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
