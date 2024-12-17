import { type FC, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import Avatar, { AvatarItem } from '@atlaskit/avatar';
import { IconButton } from '@atlaskit/button/new';
import InviteTeamIcon from '@atlaskit/icon/glyph/invite-team';
import RefreshIcon from '@atlaskit/icon/glyph/refresh';
import SignOutIcon from '@atlaskit/icon/glyph/sign-out';
import { Box, Flex, Inline, xcss } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

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
  });

  return (
    <div className="flex h-screen flex-col" data-testid="accounts">
      <Header>Accounts</Header>
      <div className="flex-grow overflow-x-auto px-8">
        <div className="mt-4 flex flex-col text-sm">
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
                        onClick={async () => {
                          await refreshAccount(account);
                          navigate('/accounts', { replace: true });
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
                        icon={SignOutIcon}
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
        </div>
      </div>

      <Box
        paddingBlock="space.050"
        paddingInline="space.200"
        backgroundColor="color.background.accent.gray.subtlest"
      >
        <Flex justifyContent="end">
          <Tooltip content="Add new account" position="left">
            <IconButton
              label="Add new account"
              icon={InviteTeamIcon}
              appearance="subtle"
              shape="circle"
              onClick={() => login()}
              testId="account-add-new"
            />
          </Tooltip>
        </Flex>
      </Box>
    </div>
  );
};
