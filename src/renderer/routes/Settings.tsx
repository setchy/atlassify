import type { FC } from 'react';

import { Box, Stack } from '@atlaskit/primitives';

import { Contents } from '../components/primitives/Contents';
import { Header } from '../components/primitives/Header';
import { Page } from '../components/primitives/Page';
import { AppearanceSettings } from '../components/settings/AppearanceSettings';
import { NotificationSettings } from '../components/settings/NotificationSettings';
import { SettingsFooter } from '../components/settings/SettingsFooter';
import { SettingsReset } from '../components/settings/SettingsReset';
import { SystemSettings } from '../components/settings/SystemSettings';

// FIXME #90 InlineMessage findDOMNode errors
export const SettingsRoute: FC = () => {
  return (
    <Page id="settings">
      <Header fetchOnBack>Settings</Header>

      <Contents>
        <Box paddingInline="space.400" paddingBlockEnd="space.200">
          <Stack space="space.200">
            <AppearanceSettings />
            <NotificationSettings />
            <SystemSettings />
            <SettingsReset />
          </Stack>
        </Box>
      </Contents>

      <SettingsFooter />
    </Page>
  );
};
