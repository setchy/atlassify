import { type FC, useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Avatar, { AvatarItem } from '@atlaskit/avatar';
import { IconButton } from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import LogOutIcon from '@atlaskit/icon/core/log-out';
import PersonAddIcon from '@atlaskit/icon/core/person-add';
import RefreshIcon from '@atlaskit/icon/core/refresh';
import { Box, Inline } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { Contents } from '../components/layout/Contents';
import { Page } from '../components/layout/Page';
import { Footer } from '../components/primitives/Footer';
import { Header } from '../components/primitives/Header';
import { AppContext } from '../context/App';
import type { Account } from '../types';
import { refreshAccount } from '../utils/auth/utils';
import { updateTrayColor, updateTrayTitle } from '../utils/comms';
import { openAccountProfile } from '../utils/links';
import { isLightMode } from '../utils/theme';

const styles = cssMap({
  box: {
    borderRadius: 'border.radius.200',
    marginInline: token('space.400'),
  },
});

export const AccountsRoute: FC = () => {
  const { auth, logoutFromAccount } = useContext(AppContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const logoutAccount = useCallback(
    (account: Account) => {
      logoutFromAccount(account);
      navigate(-1);
      updateTrayColor();
      updateTrayTitle();
    },
    [logoutFromAccount],
  );

  const login = useCallback(() => {
    return navigate('/login', { replace: true });
  }, []);

  return (
    <Page id="accounts">
      <Header>{t('accounts.title')}</Header>

      <Contents>
        {auth.accounts.map((account) => {
          return (
            <Box
              backgroundColor={
                isLightMode()
                  ? 'color.background.accent.blue.subtlest'
                  : 'color.background.accent.gray.subtlest'
              }
              key={account.id}
              padding="space.150"
              xcss={styles.box}
            >
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
