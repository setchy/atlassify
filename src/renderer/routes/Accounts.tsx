import { type FC, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import Avatar, { AvatarItem } from '@atlaskit/avatar';
import { IconButton } from '@atlaskit/button/new';
import LogOutIcon from '@atlaskit/icon/core/log-out';
import PersonAddIcon from '@atlaskit/icon/core/person-add';
import RefreshIcon from '@atlaskit/icon/core/refresh';
import { Box, Inline, xcss } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

import { Contents } from '../components/layout/Contents';
import { Page } from '../components/layout/Page';
import { Footer } from '../components/primitives/Footer';
import { Header } from '../components/primitives/Header';
import { AppContext } from '../context/App';
import type { Account } from '../types';
import { refreshAccount } from '../utils/auth/utils';
import { updateTrayIcon, updateTrayTitle } from '../utils/comms';
import { openAccountProfile } from '../utils/links';
import { isLightMode } from '../utils/theme';

export const AccountsRoute: FC = () => {
  const { auth, logoutFromAccount } = useContext(AppContext);
  const navigate = useNavigate();

  const logoutAccount = useCallback(
    (account: Account) => {
      logoutFromAccount(account);
      navigate(-1);
      updateTrayIcon();
      updateTrayTitle();
    },
    [logoutFromAccount],
  );

  const login = useCallback(() => {
    return navigate('/login', { replace: true });
  }, []);

  const boxStyles = xcss({
    borderRadius: 'border.radius.200',
    marginInline: 'space.400',
  });

  return (
    <Page id="accounts">
      <Header>Accounts</Header>

      <Contents>
        {auth.accounts.map((account) => {
          return (
            <Box
              key={account.id}
              padding="space.150"
              backgroundColor={
                isLightMode()
                  ? 'color.background.accent.blue.subtlest'
                  : 'color.background.accent.gray.subtlest'
              }
              xcss={boxStyles}
            >
              <Inline grow="fill" spread="space-between" alignBlock="center">
                <Tooltip content="Open account profile" position="bottom">
                  <AvatarItem
                    label="Open account profile"
                    avatar={
                      <Avatar
                        name={account.name}
                        src={account.avatar}
                        size="medium"
                        appearance="circle"
                        borderColor={isLightMode() ? 'white' : 'gray'}
                      />
                    }
                    primaryText={account.name}
                    secondaryText={account.username}
                    onClick={() => openAccountProfile(account)}
                    testId="account-profile"
                  />
                </Tooltip>

                <Inline>
                  <Tooltip
                    content={`Refresh ${account.username}`}
                    position="bottom"
                  >
                    <IconButton
                      label={`Refresh ${account.username}`}
                      icon={RefreshIcon}
                      shape="circle"
                      appearance="subtle"
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
                      testId="account-refresh"
                    />
                  </Tooltip>

                  <Tooltip
                    content={`Logout ${account.username}`}
                    position="bottom"
                  >
                    <IconButton
                      label={`Logout ${account.username}`}
                      icon={LogOutIcon}
                      shape="circle"
                      appearance="subtle"
                      onClick={() => logoutAccount(account)}
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
        <Tooltip content="Add new account" position="left">
          <IconButton
            label="Add new account"
            icon={PersonAddIcon}
            appearance="subtle"
            shape="circle"
            onClick={() => login()}
            testId="account-add-new"
          />
        </Tooltip>
      </Footer>
    </Page>
  );
};
