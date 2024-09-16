import { type FC, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import Avatar, { AvatarItem } from '@atlaskit/avatar';
import { IconButton } from '@atlaskit/button/new';
import InviteTeamIcon from '@atlaskit/icon/glyph/invite-team';
import RefreshIcon from '@atlaskit/icon/glyph/refresh';
import SignOutIcon from '@atlaskit/icon/glyph/sign-out';
import StarIcon from '@atlaskit/icon/glyph/star';
import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';
import { Box, Flex, Inline } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

import { Header } from '../components/Header';
import { AppContext } from '../context/App';
import type { Account } from '../types';
import { getAccountUUID, refreshAccount } from '../utils/auth/utils';
import { updateTrayIcon, updateTrayTitle } from '../utils/comms';
import { openAccountProfile } from '../utils/links';
import { saveState } from '../utils/storage';

export const AccountsRoute: FC = () => {
  const { auth, settings, logoutFromAccount } = useContext(AppContext);
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

  const setAsPrimaryAccount = useCallback((account: Account) => {
    auth.accounts = [account, ...auth.accounts.filter((a) => a !== account)];
    saveState({ auth, settings });
    navigate('/accounts', { replace: true });
  }, []);

  const login = useCallback(() => {
    return navigate('/login-api-token', { replace: true });
  }, []);

  return (
    <div className="flex h-screen flex-col" data-testid="accounts">
      <Header>Accounts</Header>
      <div className="flex-grow overflow-x-auto px-8">
        <div className="mt-4 flex flex-col text-sm">
          {auth.accounts.map((account, i) => {
            const isPrimaryAccount = i === 0;
            const AccountIcon = isPrimaryAccount ? StarFilledIcon : StarIcon;
            const accountLabel = isPrimaryAccount
              ? 'Primary account'
              : 'Set as primary account';

            return (
              <div
                key={getAccountUUID(account)}
                className="mb-4 flex items-center justify-between rounded-md bg-gray-100 p-2 dark:bg-gray-sidebar"
              >
                <Inline grow="fill" spread="space-between" alignBlock="center">
                  <Tooltip content="Open account profile">
                    <AvatarItem
                      label="Open account profile"
                      avatar={
                        <Avatar
                          name={account.user.name}
                          src={account.user.avatar}
                          size="medium"
                          appearance="circle"
                        />
                      }
                      primaryText={account.user.name}
                      secondaryText={account.user.login}
                      onClick={() => openAccountProfile(account)}
                    />
                  </Tooltip>

                  <Inline>
                    <IconButton
                      label={accountLabel}
                      title={accountLabel}
                      icon={(iconProps) => (
                        <AccountIcon {...iconProps} primaryColor="gold" />
                      )}
                      appearance="subtle"
                      isDisabled={isPrimaryAccount}
                      onClick={() => setAsPrimaryAccount(account)}
                    />

                    <IconButton
                      label={`Refresh ${account.user.login}`}
                      title={`Refresh ${account.user.login}`}
                      icon={RefreshIcon}
                      appearance="subtle"
                      onClick={async () => {
                        await refreshAccount(account);
                        navigate('/accounts', { replace: true });
                      }}
                    />

                    <IconButton
                      label={`Logout ${account.user.login}`}
                      title={`Logout ${account.user.login}`}
                      icon={SignOutIcon}
                      appearance="subtle"
                      onClick={() => logoutAccount(account)}
                    />
                  </Inline>
                </Inline>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-sm px-8 bg-gray-200 dark:bg-gray-darker">
        <Box padding="space.050">
          <Flex justifyContent="end">
            <IconButton
              label="Add new account"
              title="Add new account"
              icon={InviteTeamIcon}
              appearance="subtle"
              shape="circle"
              onClick={() => login()}
            />
          </Flex>
        </Box>
      </div>
    </div>
  );
};
