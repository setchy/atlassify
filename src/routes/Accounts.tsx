import { PersonIcon as PersonIconOld } from '@primer/octicons-react';

import { type FC, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import Avatar from '@atlaskit/avatar';
import InviteTeamIcon from '@atlaskit/icon/glyph/invite-team';
import LockIcon from '@atlaskit/icon/glyph/lock';
import PersonIcon from '@atlaskit/icon/glyph/person';
import RefreshIcon from '@atlaskit/icon/glyph/refresh';
import SignOutIcon from '@atlaskit/icon/glyph/sign-out';
import StarIcon from '@atlaskit/icon/glyph/star';
import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';
import Tooltip from '@atlaskit/tooltip';

import { Header } from '../components/Header';
import { AppContext } from '../context/App';
import { BUTTON_CLASS_NAME } from '../styles/atlasify';
import type { Account } from '../types';
import { getAccountUUID, refreshAccount } from '../utils/auth/utils';
import { cn } from '../utils/cn';
import { updateTrayIcon, updateTrayTitle } from '../utils/comms';
import { openAccountProfile, openManageProfileSecurity } from '../utils/links';
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
    return navigate('/login', { replace: true });
  }, []);

  return (
    <div className="flex h-screen flex-col" data-testid="accounts">
      <Header icon={PersonIconOld}>Accounts</Header>
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
                <div className="text-xs">
                  <button
                    type="button"
                    className="flex flex-1 gap-11 cursor-pointer align-middle"
                  >
                    <Tooltip content="Username">
                      <PersonIcon label="Username" size="small" />
                      {account.user.login}
                    </Tooltip>
                  </button>
                </div>
                <div className="text-xs">
                  <button
                    type="button"
                    className="flex flex-1 gap-1 cursor-pointer align-middle"
                    onClick={() => openManageProfileSecurity()}
                  >
                    <Tooltip content="Open profile security">
                      <LockIcon label="Authentication method" size="small" />
                      {account.method}
                    </Tooltip>
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  className={cn(BUTTON_CLASS_NAME, 'px-0', 'cursor-default')}
                  hidden={i !== 0}
                >
                  <Tooltip content="Primary account">
                    <StarFilledIcon
                      label="Primary account"
                      primaryColor="gold"
                      size="medium"
                    />
                  </Tooltip>
                </button>

                <button
                  type="button"
                  className={cn(BUTTON_CLASS_NAME, 'px-0')}
                  onClick={() => setAsPrimaryAccount(account)}
                  hidden={i === 0}
                >
                  <Tooltip content="Set as primary account">
                    <StarIcon label="Set as primary account" size="medium" />
                  </Tooltip>
                </button>

                <button
                  type="button"
                  className={cn(BUTTON_CLASS_NAME, 'px-0')}
                  onClick={async () => {
                    await refreshAccount(account);
                    navigate('/accounts', { replace: true });
                  }}
                >
                  <Tooltip content={`Refresh ${account.user.login}`}>
                    <RefreshIcon
                      label={`Refresh ${account.user.login}`}
                      size="medium"
                    />
                  </Tooltip>
                </button>

                <button
                  type="button"
                  className={cn(BUTTON_CLASS_NAME, 'px-0')}
                  onClick={() => logoutAccount(account)}
                >
                  <Tooltip content={`Logout ${account.user.login}`}>
                    <SignOutIcon
                      label={`Logout ${account.user.login}`}
                      size="medium"
                    />
                  </Tooltip>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between bg-gray-200 px-8 py-1 text-sm dark:bg-gray-darker">
        <div className="font-semibold italic">Add new account</div>
        <div>
          <button
            type="button"
            className={BUTTON_CLASS_NAME}
            title="Add new account"
            onClick={login}
          >
            <InviteTeamIcon label="Add new account" size="medium" />
          </button>
        </div>
      </div>
    </div>
  );
};
