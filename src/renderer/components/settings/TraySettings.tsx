import { type FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { Checkbox } from '@atlaskit/checkbox';
import Heading from '@atlaskit/heading';
import InlineMessage from '@atlaskit/inline-message';
import { Inline, Stack } from '@atlaskit/primitives';

import { APPLICATION } from '../../../shared/constants';

import { AppContext } from '../../context/App';

export const TraySettings: FC = () => {
  const { settings, updateSetting } = useContext(AppContext);
  const { t } = useTranslation();

  return (
    <Stack space="space.100">
      <Heading size="small">{t('settings.tray.title')}</Heading>

      {window.atlassify.platform.isMacOS() && (
        <Checkbox
          isChecked={settings.showNotificationsCountInTray}
          label={t('settings.tray.show_count_in_tray')}
          name="showNotificationsCountInTray"
          onChange={(evt) =>
            updateSetting('showNotificationsCountInTray', evt.target.checked)
          }
        />
      )}

      <Inline space="space.100">
        <Checkbox
          isChecked={settings.useUnreadActiveIcon}
          label={t('settings.tray.unread_active_icon')}
          name="useUnreadActiveIcon"
          onChange={(evt) =>
            updateSetting('useUnreadActiveIcon', evt.target.checked)
          }
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
          isChecked={settings.useAlternateIdleIcon}
          label={t('settings.tray.alternate_icon')}
          name="useAlternateIdleIcon"
          onChange={(evt) =>
            updateSetting('useAlternateIdleIcon', evt.target.checked)
          }
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
