import type { CSSProperties, FC } from 'react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import Heading from '@atlaskit/heading';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { keybindings } from '../../constants/keybindings';

const keycapStyle: CSSProperties = {
  backgroundColor: token('color.background.neutral.subtle'),
  border: `1px solid ${token('color.border')}`,
  borderRadius: 4,
  padding: '2px 6px',
  fontSize: '0.75rem',
  fontWeight: 600,
  lineHeight: '1.2',
};

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
              <Box as="span" style={keycapStyle}>
                {key}
              </Box>
            </Fragment>
          ))}
        </Inline>
      </Inline>
    </Box>
  );
};

export const KeyboardShortcutsSettings: FC = () => {
  const { t } = useTranslation();

  return (
    <Stack space="space.100">
      <Heading size="small">{t('settings.keyboard_shortcuts.title')}</Heading>

      <Box paddingInlineStart="space.050">
        <Stack space="space.250">
          <Stack space="space.100">
            <Text weight="bold">
              {t('settings.keyboard_shortcuts.general')}
            </Text>
            <Box paddingInlineStart="space.250">
              <Stack space="space.075">
                <KeybindingRow
                  keys={keybindings.shortcuts.home.display}
                  label={t('settings.keyboard_shortcuts.home')}
                />
                <KeybindingRow
                  keys={keybindings.shortcuts.myNotifications.display}
                  label={t('settings.keyboard_shortcuts.my_notifications')}
                />
                <KeybindingRow
                  keys={keybindings.shortcuts.toggleReadUnread.display}
                  label={t('settings.keyboard_shortcuts.toggle_unread')}
                />
                <KeybindingRow
                  keys={keybindings.shortcuts.groupByProduct.display}
                  label={t('settings.keyboard_shortcuts.group_by_product')}
                />
                <KeybindingRow
                  keys={keybindings.shortcuts.groupByTitle.display}
                  label={t('settings.keyboard_shortcuts.group_by_title')}
                />
                <KeybindingRow
                  keys={keybindings.shortcuts.filters.display}
                  label={t('settings.keyboard_shortcuts.filters')}
                />
                <KeybindingRow
                  keys={keybindings.shortcuts.refresh.display}
                  label={t('settings.keyboard_shortcuts.refresh')}
                />
                <KeybindingRow
                  keys={keybindings.shortcuts.settings.display}
                  label={t('settings.keyboard_shortcuts.settings')}
                />
                <KeybindingRow
                  keys={keybindings.shortcuts.accounts.display}
                  label={t('settings.keyboard_shortcuts.accounts')}
                />
                <KeybindingRow
                  keys={keybindings.shortcuts.quit.display}
                  label={t('settings.keyboard_shortcuts.quit')}
                />
              </Stack>
            </Box>
          </Stack>
          <Stack space="space.100">
            <Text weight="bold">
              {t('settings.keyboard_shortcuts.notifications')}
            </Text>
            <Box paddingInlineStart="space.250">
              <Stack space="space.075">
                <KeybindingRow
                  keys={keybindings.notifications.navigate.display}
                  label={t('settings.keyboard_shortcuts.navigate')}
                />
                <KeybindingRow
                  keys={keybindings.notifications.first.display}
                  label={t('settings.keyboard_shortcuts.first')}
                />
                <KeybindingRow
                  keys={keybindings.notifications.last.display}
                  label={t('settings.keyboard_shortcuts.last')}
                />
                <KeybindingRow
                  keys={keybindings.notifications.action.display}
                  label={t('settings.keyboard_shortcuts.expand')}
                />
                <KeybindingRow
                  keys={keybindings.notifications.toggleRead.display}
                  label={t('settings.keyboard_shortcuts.toggle_read')}
                />
              </Stack>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};
