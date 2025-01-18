import { type FC, useContext } from 'react';

import { Checkbox } from '@atlaskit/checkbox';
import Heading from '@atlaskit/heading';
import InlineMessage from '@atlaskit/inline-message';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives';
import { RadioGroup } from '@atlaskit/radio';
import type { OptionsPropType } from '@atlaskit/radio/types';

import { APPLICATION } from '../../../shared/constants';
import { AppContext } from '../../context/App';
import { OpenPreference } from '../../types';
import { Constants } from '../../utils/constants';
import { isLinux, isMacOS } from '../../utils/platform';

export const SystemSettings: FC = () => {
  const { settings, updateSetting } = useContext(AppContext);

  const openLinksOptions: OptionsPropType = [
    {
      name: 'openLinks',
      label: 'Foreground',
      value: OpenPreference.FOREGROUND,
    },
    {
      name: 'openLinks',
      label: 'Background',
      value: OpenPreference.BACKGROUND,
    },
  ];

  return (
    <Stack space="space.100">
      <Heading size="small">System</Heading>

      <Box paddingInlineStart="space.050">
        <Inline space="space.100">
          <Text id="openLinks-label" weight="medium">
            Open Links:
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
          label="Enable keyboard shortcut"
          isChecked={settings.keyboardShortcutEnabled}
          onChange={(evt) =>
            updateSetting('keyboardShortcutEnabled', evt.target.checked)
          }
        />
        <InlineMessage appearance="info">
          <div className="w-60 text-xs">
            When enabled, you can use the hotkeys{' '}
            <span className="text-atlassify-attention">
              {Constants.DEFAULT_KEYBOARD_SHORTCUT}
            </span>{' '}
            to show or hide {APPLICATION.NAME}.
          </div>
        </InlineMessage>
      </Inline>

      {isMacOS() && (
        <Checkbox
          name="showNotificationsCountInTray"
          label="Show notifications count in tray"
          isChecked={settings.showNotificationsCountInTray}
          onChange={(evt) =>
            updateSetting('showNotificationsCountInTray', evt.target.checked)
          }
        />
      )}

      <Checkbox
        name="showNotifications"
        label="Show system notifications"
        isChecked={settings.showSystemNotifications}
        onChange={(evt) =>
          updateSetting('showSystemNotifications', evt.target.checked)
        }
      />

      <Checkbox
        name="playSoundNewNotifications"
        label="Play sound for new notifications"
        isChecked={settings.playSoundNewNotifications}
        onChange={(evt) =>
          updateSetting('playSoundNewNotifications', evt.target.checked)
        }
      />

      <Inline space="space.100">
        <Checkbox
          name="useAlternateIdleIcon"
          label="Use alternate idle icon"
          isChecked={settings.useAlternateIdleIcon}
          onChange={(evt) =>
            updateSetting('useAlternateIdleIcon', evt.target.checked)
          }
        />
        <InlineMessage appearance="info">
          <div className="w-60 text-xs">
            <p>
              Use a white {APPLICATION.NAME} logo (instead of the default black
              logo) when all notifications are read.
            </p>
            <p>
              This setting is particularly useful for devices which have a
              dark-themed menubar or taskbar.
            </p>
          </div>
        </InlineMessage>
      </Inline>

      {!isLinux() && (
        <Checkbox
          name="openAtStartUp"
          label="Open at startup"
          isChecked={settings.openAtStartup}
          onChange={(evt) => updateSetting('openAtStartup', evt.target.checked)}
        />
      )}
    </Stack>
  );
};
