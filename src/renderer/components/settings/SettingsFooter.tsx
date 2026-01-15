import { type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Button, { IconButton } from '@atlaskit/button/new';
import CrossCircleIcon from '@atlaskit/icon/core/cross-circle';
import PeopleGroupIcon from '@atlaskit/icon/core/people-group';
import { Inline } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { APPLICATION } from '../../../shared/constants';

import { Footer } from '../primitives/Footer';

import { getAppVersion, quitApp } from '../../utils/comms';
import { openAtlassifyReleaseNotes } from '../../utils/links';

export const SettingsFooter: FC = () => {
  const [appVersion, setAppVersion] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

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
        position="top"
      >
        <Button
          appearance="subtle"
          onClick={() => openAtlassifyReleaseNotes(appVersion)}
          testId="settings-release-notes"
          title={t('settings.view_release_notes', {
            appName: APPLICATION.NAME,
          })}
        >
          <span className="font-medium">
            {APPLICATION.NAME} {appVersion}
          </span>
        </Button>
      </Tooltip>

      <Inline space="space.200">
        <Tooltip content={t('settings.accounts')} position="top">
          <IconButton
            appearance="subtle"
            icon={() => (
              <PeopleGroupIcon
                color={token('color.icon.accent.blue')}
                label={t('settings.accounts')}
              />
            )}
            label={t('settings.accounts')}
            onClick={() => navigate('/accounts')}
            shape="circle"
            testId="settings-accounts"
          />
        </Tooltip>
        <Tooltip
          content={t('sidebar.quit.tooltip', { appName: APPLICATION.NAME })}
          position="top"
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
            onClick={() => quitApp()}
            shape="circle"
            testId="settings-quit"
          />
        </Tooltip>
      </Inline>
    </Footer>
  );
};
