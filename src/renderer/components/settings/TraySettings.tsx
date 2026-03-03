import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Checkbox } from '@atlaskit/checkbox';
import Heading from '@atlaskit/heading';
import InlineMessage from '@atlaskit/inline-message';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives';
import { Radio } from '@atlaskit/radio';

import { useSettingsStore } from '../../stores';

import trayActiveIcon from '../../../../assets/images/tray-active@2x.png';
import trayIdleWhiteIcon from '../../../../assets/images/tray-idle-white@2x.png';
import trayIdleIcon from '../../../../assets/images/tray-idleTemplate@2x.png';

export const TraySettings: FC = () => {
  const { t } = useTranslation();

  // Setting store actions
  const toggleSetting = useSettingsStore((s) => s.toggleSetting);
  const updateSetting = useSettingsStore((s) => s.updateSetting);

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

      <Box paddingInlineStart="space.050">
        <div className="flex items-center gap-2">
          <Text weight="medium">{t('settings.tray.alternate_icon')}:</Text>
          <Radio
            isChecked={!useAlternateIdleIcon}
            label={
              <span className="inline-flex items-center gap-1.5">
                <img alt="" className="h-3 w-3" src={trayIdleIcon} />
                <span>{t('settings.tray.idle_icon_default')}</span>
              </span>
            }
            name="useAlternateIdleIcon"
            onChange={() => updateSetting('useAlternateIdleIcon', false)}
            value="false"
          />
          <Radio
            isChecked={useAlternateIdleIcon}
            label={
              <span className="inline-flex items-center gap-1.5 rounded bg-slate-700 px-1">
                <img alt="" className="h-3 w-3" src={trayIdleWhiteIcon} />
                <span className="text-white">
                  {t('settings.tray.idle_icon_alternate')}
                </span>
              </span>
            }
            name="useAlternateIdleIcon"
            onChange={() => updateSetting('useAlternateIdleIcon', true)}
            value="true"
          />
          <InlineMessage appearance="info">
            <div className="w-60 text-xs">
              {t('settings.tray.alternate_icon_help')}
            </div>
          </InlineMessage>
        </div>
      </Box>

      <Box paddingInlineStart="space.050">
        <div className="flex items-center gap-2">
          <Text weight="medium">{t('settings.tray.unread_active_icon')}:</Text>
          <Radio
            isChecked={!useUnreadActiveIcon}
            label={
              <span className="inline-flex items-center gap-1.5">
                <img alt="" className="h-3 w-3" src={trayIdleIcon} />
                <span>{t('settings.tray.unread_icon_stealth')}</span>
              </span>
            }
            name="useUnreadActiveIcon"
            onChange={() => updateSetting('useUnreadActiveIcon', false)}
            value="false"
          />
          <Radio
            isChecked={useUnreadActiveIcon}
            label={
              <span className="inline-flex items-center gap-1.5">
                <img alt="" className="h-3 w-3" src={trayActiveIcon} />
                <span>{t('settings.tray.unread_icon_highlighted')}</span>
              </span>
            }
            name="useUnreadActiveIcon"
            onChange={() => updateSetting('useUnreadActiveIcon', true)}
            value="true"
          />
          <InlineMessage appearance="info">
            <div className="w-60 text-xs">
              {t('settings.tray.unread_active_icon_help')}
            </div>
          </InlineMessage>
        </div>
      </Box>
    </Stack>
  );
};
