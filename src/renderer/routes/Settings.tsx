import type { FC } from 'react';

import { Box, Stack } from '@atlaskit/primitives';

import { Header } from '../components/primitives/Header';
import { AppearanceSettings } from '../components/settings/AppearanceSettings';
import { NotificationSettings } from '../components/settings/NotificationSettings';
import { SettingsFooter } from '../components/settings/SettingsFooter';
import { SettingsReset } from '../components/settings/SettingsReset';
import { SystemSettings } from '../components/settings/SystemSettings';

// FIXME: InlineMessage findDOMNode errors. See issue #90
export const SettingsRoute: FC = () => {
  return (
    <div className="flex h-screen flex-col" data-testid="settings">
      <Header fetchOnBack>Settings</Header>

      <div className="flex flex-col flex-grow overflow-x-auto">
        <Box paddingInline="space.400" paddingBlockEnd="space.200">
          <Stack space="space.200">
            <AppearanceSettings />
            <NotificationSettings />
            <SystemSettings />
            <SettingsReset />
          </Stack>
        </Box>
      </div>

      <SettingsFooter />
    </div>
  );
};
