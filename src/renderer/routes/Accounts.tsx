import { type FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Avatar, { AvatarItem } from '@atlaskit/avatar';
import { IconButton } from '@atlaskit/button/new';
import LogOutIcon from '@atlaskit/icon/core/log-out';
import PersonAddIcon from '@atlaskit/icon/core/person-add';
import RefreshIcon from '@atlaskit/icon/core/refresh';
import { Box, Inline, xcss } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

import useAccountsStore from '../stores/useAccountsStore';

import { Contents } from '../components/layout/Contents';
import { Page } from '../components/layout/Page';
import { Footer } from '../components/primitives/Footer';
import { Header } from '../components/primitives/Header';

import type { Account } from '../types';

import { openAccountProfile } from '../utils/links';
import { isLightMode } from '../utils/theme';

export const AccountsRoute: FC = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const accounts = useAccountsStore((s) => s.accounts);
  const removeAccount = useAccountsStore((s) => s.removeAccount);
  const refreshAccount = useAccountsStore((s) => s.refreshAccount);

  const logoutAccount = useCallback(
    (account: Account) => {
      removeAccount(account);
      navigate(-1);
    },
    [removeAccount],
  );

  const login = useCallback(() => {
    return navigate('/login', { replace: true });
  }, []);

  const boxStyles = xcss({
    backgroundColor: isLightMode()
      ? 'color.background.accent.blue.subtlest'
      : 'color.background.accent.gray.subtlest',

    borderRadius: 'radius.large',

    marginInline: 'space.250',
  });

  return (
    <Page testId="accounts">
      <Header>{t('accounts.title')}</Header>

      <Contents>
        {accounts.map((account) => {
          return (
            <Box key={account.id} padding="space.150" xcss={boxStyles}>
              <Inline alignBlock="center" grow="fill" spread="space-between">
                <Tooltip content={t('accounts.open_profile')} position="bottom">
                  <AvatarItem
                    avatar={
                      <Avatar
                        appearance="circle"
                        borderColor={isLightMode() ? 'white' : 'gray'}
                        name={account.name}
                        size="medium"
                        src={account.avatar}
                      />
                    }
                    label={t('accounts.open_profile')}
                    onClick={() => openAccountProfile(account)}
                    primaryText={account.name}
                    secondaryText={account.username}
                    testId="account-profile"
                  />
                </Tooltip>

                <Inline>
                  <Tooltip
                    content={t('accounts.refresh_account', {
                      username: account.username,
                    })}
                    position="bottom"
                  >
                    <IconButton
                      appearance="subtle"
                      icon={RefreshIcon}
                      label={t('accounts.refresh_account', {
                        username: account.username,
                      })}
                      onClick={async (e) => {
                        const button = e.currentTarget;
                        button.classList.add('animate-spin');

                        await refreshAccount(account);
                        navigate('/accounts', {
                          replace: true,
                        });

                        /**
                         * Typically the above refresh API call completes very quickly,
                         * so we add an brief artificial delay to allow the icon to spin a few times
                         */
                        setTimeout(() => {
                          button.classList.remove('animate-spin');
                        }, 250);
                      }}
                      shape="circle"
                      testId="account-refresh"
                    />
                  </Tooltip>

                  <Tooltip
                    content={t('accounts.logout_account', {
                      username: account.username,
                    })}
                    position="bottom"
                  >
                    <IconButton
                      appearance="subtle"
                      icon={LogOutIcon}
                      label={t('accounts.logout_account', {
                        username: account.username,
                      })}
                      onClick={() => logoutAccount(account)}
                      shape="circle"
                      testId="account-logout"
                    />
                  </Tooltip>
                </Inline>
              </Inline>
            </Box>
          );
        })}
      </Contents>

      <Footer justify="end">
        <Tooltip content={t('accounts.add_new')} position="left">
          <IconButton
            appearance="subtle"
            icon={PersonAddIcon}
            label={t('accounts.add_new')}
            onClick={() => login()}
            shape="circle"
            testId="account-add-new"
          />
        </Tooltip>
      </Footer>
    </Page>
  );
};
