import { type FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { Checkbox } from '@atlaskit/checkbox';
import Heading from '@atlaskit/heading';
import InlineMessage from '@atlaskit/inline-message';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives';
import { RadioGroup } from '@atlaskit/radio';
import type { OptionsPropType } from '@atlaskit/radio/types';

import { APPLICATION } from '../../../shared/constants';
import { AppContext } from '../../context/App';
import { OpenPreference } from '../../types';

export const SystemSettings: FC = () => {
  const { settings, updateSetting } = useContext(AppContext);
  const { t } = useTranslation();

  const openLinksOptions: OptionsPropType = [
    {
      name: 'openLinks',
      label: t('settings.open_links_foreground'),
      value: OpenPreference.FOREGROUND,
    },
    {
      name: 'openLinks',
      label: t('settings.open_links_background'),
      value: OpenPreference.BACKGROUND,
    },
  ];

  return (
    <Stack space="space.100">
      <Heading size="small">{t('settings.title')}</Heading>

      <Box paddingInlineStart="space.050">
        <Inline space="space.100">
          <Text id="openLinks-label" weight="medium">
            {t('settings.open_links')}:
          </Text>
          <RadioGroup
            options={openLinksOptions}
            defaultValue={settings.openLinks}
            value={settings.openLinks}
            onChange={(evt) => {
              updateSetting('openLinks', evt.target.value as OpenPreference);
            }}
            aria-labelledby="openLinks-label"
          />
        </Inline>
      </Box>

      <Inline space="space.100">
        <Checkbox
          name="keyboardShortcutEnabled"
          label={t('settings.keyboard_shortcut')}
          isChecked={settings.keyboardShortcutEnabled}
          onChange={(evt) =>
            updateSetting('keyboardShortcutEnabled', evt.target.checked)
          }
        />
        <InlineMessage appearance="info">
          <div className="w-60 text-xs">
            {t('settings.keyboard_shortcut_help', {
              shortcut: APPLICATION.DEFAULT_KEYBOARD_SHORTCUT,
              appName: APPLICATION.NAME,
            })}
          </div>
        </InlineMessage>
      </Inline>

      {window.atlassify.platform.isMacOS() && (
        <Checkbox
          name="showNotificationsCountInTray"
          label={t('settings.show_count_in_tray')}
          isChecked={settings.showNotificationsCountInTray}
          onChange={(evt) =>
            updateSetting('showNotificationsCountInTray', evt.target.checked)
          }
        />
      )}

      <Checkbox
        name="showNotifications"
        label={t('settings.system_notifications')}
        isChecked={settings.showSystemNotifications}
        onChange={(evt) =>
          updateSetting('showSystemNotifications', evt.target.checked)
        }
      />

      <Checkbox
        name="playSoundNewNotifications"
        label={t('settings.play_sound')}
        isChecked={settings.playSoundNewNotifications}
        onChange={(evt) =>
          updateSetting('playSoundNewNotifications', evt.target.checked)
        }
      />

      <Inline space="space.100">
        <Checkbox
          name="useAlternateIdleIcon"
          label={t('settings.alternate_icon')}
          isChecked={settings.useAlternateIdleIcon}
          onChange={(evt) =>
            updateSetting('useAlternateIdleIcon', evt.target.checked)
          }
        />
        <InlineMessage appearance="info">
          <div className="w-60 text-xs">
            {t('settings.alternate_icon_help', { appName: APPLICATION.NAME })}
          </div>
        </InlineMessage>
      </Inline>

      {!window.atlassify.platform.isLinux() && (
        <Checkbox
          name="openAtStartUp"
          label={t('settings.startup')}
          isChecked={settings.openAtStartup}
          onChange={(evt) => updateSetting('openAtStartup', evt.target.checked)}
        />
      )}
    </Stack>
  );
};
