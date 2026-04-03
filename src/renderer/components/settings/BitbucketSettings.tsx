import { type ChangeEvent, type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Heading from '@atlaskit/heading';
import InlineMessage from '@atlaskit/inline-message';
import { Inline, Stack } from '@atlaskit/primitives';
import Textfield from '@atlaskit/textfield';

import { useSettingsStore } from '../../stores';

import type { EncryptedToken } from '../../types';

import { encryptValue } from '../../utils/system/comms';

export const BitbucketSettings: FC = () => {
  const { t } = useTranslation();

  const updateSetting = useSettingsStore((s) => s.updateSetting);
  const bitbucketUsername = useSettingsStore((s) => s.bitbucketUsername);
  const bitbucketWorkspaces = useSettingsStore((s) => s.bitbucketWorkspaces);

  // Local state for the raw (plain-text) app password input
  const [rawToken, setRawToken] = useState('');

  return (
    <Stack space="space.100">
      <Heading size="small">{t('settings.bitbucket.title')}</Heading>

      <Inline alignBlock="start" space="space.100">
        <Textfield
          aria-label={t('settings.bitbucket.username')}
          name="bitbucketUsername"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            updateSetting('bitbucketUsername', e.target.value)
          }
          placeholder={t('settings.bitbucket.username_placeholder')}
          value={bitbucketUsername}
        />
      </Inline>

      <Inline alignBlock="start" space="space.100">
        <Textfield
          aria-label={t('settings.bitbucket.token')}
          name="bitbucketToken"
          onBlur={async () => {
            if (rawToken) {
              const encrypted = (await encryptValue(
                rawToken,
              )) as EncryptedToken;
              updateSetting('bitbucketToken', encrypted);
              setRawToken('');
            }
          }}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setRawToken(e.target.value)
          }
          placeholder={t('settings.bitbucket.token_placeholder')}
          type="password"
          value={rawToken}
        />
        <InlineMessage appearance="info">
          <div className="settings-help-text">
            {t('settings.bitbucket.token_help')}
          </div>
        </InlineMessage>
      </Inline>

      <Inline alignBlock="start" space="space.100">
        <Textfield
          aria-label={t('settings.bitbucket.workspaces')}
          name="bitbucketWorkspaces"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const workspaces = e.target.value
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean);
            updateSetting('bitbucketWorkspaces', workspaces);
          }}
          placeholder={t('settings.bitbucket.workspaces_placeholder')}
          value={bitbucketWorkspaces.join(', ')}
        />
        <InlineMessage appearance="info">
          <div className="settings-help-text">
            {t('settings.bitbucket.workspaces_help')}
          </div>
        </InlineMessage>
      </Inline>
    </Stack>
  );
};
