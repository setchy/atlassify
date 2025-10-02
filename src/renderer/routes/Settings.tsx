import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Stack } from '@atlaskit/primitives';

import { Contents } from '../components/layout/Contents';
import { Page } from '../components/layout/Page';
import { Header } from '../components/primitives/Header';
import { AppearanceSettings } from '../components/settings/AppearanceSettings';
import { NotificationSettings } from '../components/settings/NotificationSettings';
import { SettingsFooter } from '../components/settings/SettingsFooter';
import { SettingsReset } from '../components/settings/SettingsReset';
import { SystemSettings } from '../components/settings/SystemSettings';
import { TraySettings } from '../components/settings/TraySettings';

export const SettingsRoute: FC = () => {
  const { t } = useTranslation();

  return (
    <Page id="settings">
      <Header fetchOnBack>{t('settings.title')}</Header>

      <Contents>
        <Box paddingBlockEnd="space.200" paddingInline="space.400">
          <Stack space="space.200">
            <AppearanceSettings />
            <NotificationSettings />
            <TraySettings />
            <SystemSettings />
            <SettingsReset />
          </Stack>
        </Box>
      </Contents>

      <SettingsFooter />
    </Page>
  );
};
