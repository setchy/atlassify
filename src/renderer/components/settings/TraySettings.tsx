import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Checkbox } from '@atlaskit/checkbox';
import Heading from '@atlaskit/heading';
import InlineMessage from '@atlaskit/inline-message';
import { Inline, Stack } from '@atlaskit/primitives';

import { APPLICATION } from '../../../shared/constants';

import { useSettingsStore } from '../../stores';

export const TraySettings: FC = () => {
  const { t } = useTranslation();

  // Setting store actions
  const toggleSetting = useSettingsStore((s) => s.toggleSetting);

  // Setting store values
  const showNotificationsCountInTray = useSettingsStore(
    (s) => s.showNotificationsCountInTray,
  );
  const useUnreadActiveIcon = useSettingsStore((s) => s.useUnreadActiveIcon);
  const useAlternateIdleIcon = useSettingsStore((s) => s.useAlternateIdleIcon);

  return (
    <Stack space="space.100">
      <Heading size="small">{t('settings.tray.title')}</Heading>

      {window.atlassify.platform.isMacOS() && (
        <Inline space="space.100">
          <Checkbox
            isChecked={showNotificationsCountInTray}
            label={t('settings.tray.show_count_in_tray')}
            name="showNotificationsCountInTray"
            onChange={() => toggleSetting('showNotificationsCountInTray')}
          />
          <InlineMessage appearance="info">
            <div className="w-60 text-xs">
              {t('settings.tray.show_count_in_tray_help')}
            </div>
          </InlineMessage>
        </Inline>
      )}

      <Inline space="space.100">
        <Checkbox
          isChecked={useUnreadActiveIcon}
          label={t('settings.tray.unread_active_icon')}
          name="useUnreadActiveIcon"
          onChange={() => toggleSetting('useUnreadActiveIcon')}
        />
        <InlineMessage appearance="info">
          <div className="w-60 text-xs">
            {t('settings.tray.unread_active_icon_help', {
              appName: APPLICATION.NAME,
            })}
          </div>
        </InlineMessage>
      </Inline>

      <Inline space="space.100">
        <Checkbox
          isChecked={useAlternateIdleIcon}
          label={t('settings.tray.alternate_icon')}
          name="useAlternateIdleIcon"
          onChange={() => toggleSetting('useAlternateIdleIcon')}
        />
        <InlineMessage appearance="info">
          <div className="w-60 text-xs">
            {t('settings.tray.alternate_icon_help', {
              appName: APPLICATION.NAME,
            })}
          </div>
        </InlineMessage>
      </Inline>
    </Stack>
  );
};
