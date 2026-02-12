import type { CSSProperties, FC } from 'react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import Heading from '@atlaskit/heading';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { useShortcutActions } from '../../hooks/useShortcutActions';

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
  keys: string[];
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
  const { shortcuts } = useShortcutActions();

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
                  keys={[shortcuts.home.key]}
                  label={t('settings.keyboard_shortcuts.home')}
                />
                <KeybindingRow
                  keys={[shortcuts.myNotifications.key]}
                  label={t('settings.keyboard_shortcuts.my_notifications')}
                />
                <KeybindingRow
                  keys={[shortcuts.toggleReadUnread.key]}
                  label={t('settings.keyboard_shortcuts.toggle_unread')}
                />
                <KeybindingRow
                  keys={[shortcuts.groupByProduct.key]}
                  label={t('settings.keyboard_shortcuts.group_by_product')}
                />
                <KeybindingRow
                  keys={[shortcuts.groupByTitle.key]}
                  label={t('settings.keyboard_shortcuts.group_by_title')}
                />
                <KeybindingRow
                  keys={[shortcuts.filters.key]}
                  label={t('settings.keyboard_shortcuts.filters')}
                />
                <KeybindingRow
                  keys={[shortcuts.refresh.key]}
                  label={t('settings.keyboard_shortcuts.refresh')}
                />
                <KeybindingRow
                  keys={[shortcuts.settings.key]}
                  label={t('settings.keyboard_shortcuts.settings')}
                />
                <KeybindingRow
                  keys={[shortcuts.accounts.key]}
                  label={t('settings.keyboard_shortcuts.accounts')}
                />
                <KeybindingRow
                  keys={[shortcuts.quit.key]}
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
                  keys={['↑', '↓']}
                  label={t('settings.keyboard_shortcuts.navigate')}
                />
                <KeybindingRow
                  keys={['Shift', '↑']}
                  label={t('settings.keyboard_shortcuts.first')}
                />
                <KeybindingRow
                  keys={['Shift', '↓']}
                  label={t('settings.keyboard_shortcuts.last')}
                />
                <KeybindingRow
                  keys={['Enter']}
                  label={t('settings.keyboard_shortcuts.expand')}
                />
                <KeybindingRow
                  keys={['a']}
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
