import { type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button, { IconButton } from '@atlaskit/button/new';
import CrossCircleIcon from '@atlaskit/icon/core/cross-circle';
import PeopleGroupIcon from '@atlaskit/icon/core/people-group';
import { Inline } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { APPLICATION } from '../../../shared/constants';

import { useGlobalShortcuts } from '../../hooks/useGlobalShortcuts';

import { Footer } from '../primitives/Footer';

import { getAppVersion } from '../../utils/comms';
import { openAtlassifyReleaseNotes } from '../../utils/links';

export const SettingsFooter: FC = () => {
  const { t } = useTranslation();

  const { shortcuts } = useGlobalShortcuts();

  const [appVersion, setAppVersion] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const result = await getAppVersion();
      setAppVersion(result);
    })();
  }, []);

  return (
    <Footer justify="space-between">
      <Tooltip
        content={t('settings.view_release_notes', {
          appName: APPLICATION.NAME,
        })}
        position="top-start"
      >
        <Button
          appearance="subtle"
          onClick={() => openAtlassifyReleaseNotes(appVersion)}
          testId="settings-release-notes"
        >
          <span className="font-medium">
            {APPLICATION.NAME} {appVersion}
          </span>
        </Button>
      </Tooltip>

      <Inline space="space.200">
        <Tooltip
          content={t('settings.accounts')}
          position="top"
          shortcut={[shortcuts.accounts.key]}
        >
          <IconButton
            appearance="subtle"
            icon={() => (
              <PeopleGroupIcon
                color={token('color.icon.accent.blue')}
                label={t('settings.accounts')}
              />
            )}
            label={t('settings.accounts')}
            onClick={() => shortcuts.accounts.action()}
            shape="circle"
            testId="settings-accounts"
          />
        </Tooltip>
        <Tooltip
          content={t('sidebar.quit.tooltip', { appName: APPLICATION.NAME })}
          position="top"
          shortcut={[shortcuts.quit.key]}
        >
          <IconButton
            appearance="subtle"
            color="danger"
            icon={() => (
              <CrossCircleIcon
                color={token('color.icon.accent.red')}
                label={t('sidebar.quit.label', { appName: APPLICATION.NAME })}
              />
            )}
            label={t('sidebar.quit.label', { appName: APPLICATION.NAME })}
            onClick={() => shortcuts.quit.action()}
            shape="circle"
            testId="settings-quit"
          />
        </Tooltip>
      </Inline>
    </Footer>
  );
};
