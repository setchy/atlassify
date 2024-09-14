import { type FC, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import Avatar from '@atlaskit/avatar';
import { IconButton } from '@atlaskit/button/new';
import InviteTeamIcon from '@atlaskit/icon/glyph/invite-team';
import LockIcon from '@atlaskit/icon/glyph/lock';
import PersonIcon from '@atlaskit/icon/glyph/person';
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
          {auth.accounts.map((account, i) => (
            <div
              key={getAccountUUID(account)}
              className="mb-4 flex items-center justify-between rounded-md bg-gray-100 p-2 dark:bg-gray-sidebar"
            >
              <div className="ml-2">
                <div>
                  <Tooltip content={account.user.name}>
                    <Avatar
                      name={account.user.name}
                      src={account.user.avatar}
                      size="medium"
                      onClick={() => openAccountProfile(account)}
                    />
                  </Tooltip>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-sm font-semibold">{account.user.name}</div>
                <div className="flex flex-1 gap-1 align-center text-xs">
                  <div>
                    <Tooltip content="Username">
                      <PersonIcon label="Username" size="small" />
                    </Tooltip>
                  </div>
                  <div>{account.user.login}</div>
                </div>
                <div className="flex flex-1 gap-1 align-center text-xs">
                  <div>
                    <Tooltip content="Authentication method">
                      <LockIcon label="Authentication method" size="small" />
                    </Tooltip>
                  </div>
                  <div>{account.method}</div>
                </div>
              </div>

              <div>
                <Inline>
                  {i === 0 ? (
                    <Tooltip content="Primary account">
                      <IconButton
                        label="Primary account"
                        icon={(iconProps) => (
                          <StarFilledIcon {...iconProps} primaryColor="gold" />
                        )}
                        appearance="subtle"
                        isDisabled={true}
                        hidden={i !== 0}
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip content="Set as primary account">
                      <IconButton
                        label="Set as primary account"
                        icon={StarIcon}
                        appearance="subtle"
                        onClick={() => setAsPrimaryAccount(account)}
                        hidden={i === 0}
                      />
                    </Tooltip>
                  )}

                  <Tooltip content={`Refresh ${account.user.login}`}>
                    <IconButton
                      label={`Refresh ${account.user.login}`}
                      icon={RefreshIcon}
                      appearance="subtle"
                      onClick={async () => {
                        await refreshAccount(account);
                        navigate('/accounts', { replace: true });
                      }}
                    />
                  </Tooltip>

                  <Tooltip content={`Logout ${account.user.login}`}>
                    <IconButton
                      label={`Logout ${account.user.login}`}
                      icon={SignOutIcon}
                      appearance="subtle"
                      onClick={() => logoutAccount(account)}
                    />
                  </Tooltip>
                </Inline>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-sm px-8 bg-gray-200 dark:bg-gray-darker">
        <Box padding="space.050">
          <Flex justifyContent="end">
            <Tooltip content="Add new account">
              <IconButton
                label="Add new account"
                icon={InviteTeamIcon}
                appearance="subtle"
                shape="circle"
                onClick={() => login()}
              />
            </Tooltip>
          </Flex>
        </Box>
      </div>
    </div>
  );
};
