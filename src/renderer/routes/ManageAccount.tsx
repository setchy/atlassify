import { type FC, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Box, Stack } from '@atlaskit/primitives';

import { t } from 'i18next';

import { useAccountsStore } from '../stores';

import { AccountHostnames } from '../components/accounts/AccountHostnames';
import { Contents } from '../components/layout/Contents';
import { Page } from '../components/layout/Page';
import { Header } from '../components/primitives/Header';

export const ManageAccountRoute: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accountId = searchParams.get('accountId');

  const accounts = useAccountsStore((s) => s.accounts);
  const account = accounts.find((a) => a.id === accountId);

  useEffect(() => {
    if (!account) {
      navigate('/accounts', { replace: true });
    }
  }, [account]);

  if (!account) {
    return null;
  }

  return (
    <Page testId="manage-account">
      <Header subheading={account.username}>
        {t('accounts.manage_account.title')}
      </Header>

      <Contents>
        <Box paddingBlockEnd="space.200" paddingInline="space.250">
          <Stack space="space.200">
            <AccountHostnames account={account} />
          </Stack>
        </Box>
      </Contents>
    </Page>
  );
};
