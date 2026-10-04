import type { FC } from 'react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import Heading from '@atlaskit/heading';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives';

import type { KeybindingEntry } from '../../constants/keybindings';
import { keybindings } from '../../constants/keybindings';

interface KeybindingRowProps {
  label: string;
  keys: readonly string[];
}

const KeybindingRow: FC<KeybindingRowProps> = ({ label, keys }) => {
  return (
    <Box paddingInlineEnd="space.150">
      <Inline alignBlock="center" space="space.200" spread="space-between">
        <Text>{label}</Text>
        <Inline alignBlock="center" space="space.050">
          {keys.map((key, index) => (
            <Fragment key={`${label}-${key}`}>
              {index > 0 && <Text size="small">+</Text>}
              <span className="keycap">{key}</span>
            </Fragment>
          ))}
        </Inline>
      </Inline>
    </Box>
  );
};

const getDisplayKeys = (entry: KeybindingEntry) =>
  entry.display ?? [entry.eventKey];

export const KeyboardShortcutsSettings: FC = () => {
  const { t } = useTranslation();

  return (
    <Stack space="space.100">
      <Heading size="small">
        {t('settings.keyboard_shortcuts.title', {
          defaultValue: 'Keyboard Shortcuts',
        })}
      </Heading>

      <Box paddingInlineStart="space.050">
        <Stack space="space.250">
          <Stack space="space.100">
            <Text weight="bold">
              {t('settings.keyboard_shortcuts.general', {
                defaultValue: 'General',
              })}
            </Text>
            <Box paddingInlineStart="space.250">
              <Stack space="space.075">
                <KeybindingRow
                  keys={getDisplayKeys(keybindings.shortcuts.home)}
                  label={t('settings.keyboard_shortcuts.home', {
                    defaultValue: 'Home',
                  })}
                />
                <KeybindingRow
                  keys={getDisplayKeys(keybindings.shortcuts.myNotifications)}
                  label={t('settings.keyboard_shortcuts.my_notifications', {
                    defaultValue: 'Open My Notifications',
                  })}
                />
                <KeybindingRow
                  keys={getDisplayKeys(keybindings.shortcuts.toggleReadUnread)}
                  label={t('settings.keyboard_shortcuts.toggle_unread', {
                    defaultValue: 'Toggle unread only',
                  })}
                />
                <KeybindingRow
                  keys={getDisplayKeys(keybindings.shortcuts.groupByProduct)}
                  label={t('settings.keyboard_shortcuts.group_by_product', {
                    defaultValue: 'Group by product',
                  })}
                />
                <KeybindingRow
                  keys={getDisplayKeys(keybindings.shortcuts.groupByTitle)}
                  label={t('settings.keyboard_shortcuts.group_by_title', {
                    defaultValue: 'Group by title',
                  })}
                />
                <KeybindingRow
                  keys={getDisplayKeys(keybindings.shortcuts.filters)}
                  label={t('settings.keyboard_shortcuts.filters', {
                    defaultValue: 'Filters',
                  })}
                />
                <KeybindingRow
                  keys={getDisplayKeys(keybindings.shortcuts.refresh)}
                  label={t('settings.keyboard_shortcuts.refresh', {
                    defaultValue: 'Refresh notifications',
                  })}
                />
                <KeybindingRow
                  keys={getDisplayKeys(keybindings.shortcuts.settings)}
                  label={t('settings.keyboard_shortcuts.settings', {
                    defaultValue: 'Open settings',
                  })}
                />
                <KeybindingRow
                  keys={getDisplayKeys(keybindings.shortcuts.accounts)}
                  label={t('settings.keyboard_shortcuts.accounts', {
                    defaultValue: 'Open accounts (from Settings)',
                  })}
                />
                <KeybindingRow
                  keys={getDisplayKeys(keybindings.shortcuts.quit)}
                  label={t('settings.keyboard_shortcuts.quit', {
                    defaultValue: 'Quit app',
                  })}
                />
              </Stack>
            </Box>
          </Stack>
          <Stack space="space.100">
            <Text weight="bold">
              {t('settings.keyboard_shortcuts.notifications', {
                defaultValue: 'Notifications list',
              })}
            </Text>
            <Box paddingInlineStart="space.250">
              <Stack space="space.075">
                <KeybindingRow
                  keys={keybindings.notifications.navigate.display}
                  label={t('settings.keyboard_shortcuts.navigate', {
                    defaultValue: 'Move between notifications',
                  })}
                />
                <KeybindingRow
                  keys={keybindings.notifications.first.display}
                  label={t('settings.keyboard_shortcuts.first', {
                    defaultValue: 'First notification',
                  })}
                />
                <KeybindingRow
                  keys={keybindings.notifications.last.display}
                  label={t('settings.keyboard_shortcuts.last', {
                    defaultValue: 'Last notification',
                  })}
                />
                <KeybindingRow
                  keys={getDisplayKeys(keybindings.notifications.action)}
                  label={t('settings.keyboard_shortcuts.expand', {
                    defaultValue: 'Expand notification',
                  })}
                />
                <KeybindingRow
                  keys={getDisplayKeys(keybindings.notifications.toggleRead)}
                  label={t('settings.keyboard_shortcuts.toggle_read', {
                    defaultValue: 'Change read state',
                  })}
                />
              </Stack>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};
