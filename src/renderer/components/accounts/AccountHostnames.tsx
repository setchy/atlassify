import { type FC, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IconButton } from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import Form, { ErrorMessage, Field } from '@atlaskit/form';
import Heading from '@atlaskit/heading';
import AddIcon from '@atlaskit/icon/core/add';
import WarningIcon from '@atlaskit/icon/core/status-warning';
import InlineMessage from '@atlaskit/inline-message';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import Tag from '@atlaskit/tag';
import TagGroup from '@atlaskit/tag-group';
import TextField from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

import { APPLICATION } from '../../../shared/constants';

import { useAccountsStore } from '../../stores';

import type { Account, Hostname } from '../../types';

const styles = cssMap({
  indented: {
    paddingInlineStart: token('space.200'),
  },
});

// @atlaskit/form's Field always adds its own space.100 margin-block-start,
// which we cancel out here so our own tight Stack spacing is what's visible.
// cssMap's types only allow literal space tokens, not calc(), so this is a plain style.
const formOffsetStyle = {
  marginBlockStart: `calc(${token('space.100')} * -1)`,
};

interface HostnameHintFormData {
  hostname: string;
}

interface AccountHostnamesProps {
  account: Account;
}

export const AccountHostnames: FC<AccountHostnamesProps> = ({ account }) => {
  const { t } = useTranslation();

  const addHostnameHint = useAccountsStore((s) => s.addHostnameHint);
  const removeHostnameHint = useAccountsStore((s) => s.removeHostnameHint);

  const [resolutionError, setResolutionError] = useState(false);

  const submitHostname = async (
    data: HostnameHintFormData,
    formApi: { reset: () => void },
  ) => {
    const resolved = await addHostnameHint(
      account,
      data.hostname.trim() as Hostname,
    );
    setResolutionError(!resolved);
    if (resolved) {
      formApi.reset();
    }
  };

  return (
    <Stack space="space.100">
      <Inline alignBlock="start" space="space.050">
        <Heading size="small">
          {t('accounts.manage_account.hostname.title')}
        </Heading>

        <InlineMessage appearance="info">
          <div className="settings-help-text">
            <Stack space="space.100">
              <Text as="p" size="small">
                {t('accounts.manage_account.hostname.description_1', {
                  appName: APPLICATION.NAME,
                })}
              </Text>
              <Text as="p" size="small">
                {t('accounts.manage_account.hostname.description_2')}
              </Text>
              <Text
                as="p"
                color="color.text.warning"
                size="small"
                weight="medium"
              >
                {t('accounts.manage_account.hostname.description_warning')}
              </Text>
            </Stack>
          </div>
        </InlineMessage>
      </Inline>

      <Box xcss={styles.indented}>
        <Stack space="space.025">
          {account.hostnameHints.length > 0 && (
            <Stack space="space.050">
              <Text
                as="span"
                id="hostname-hints-heading"
                size="small"
                weight="medium"
              >
                {t('accounts.manage_account.hostname.configured_hostnames')}
              </Text>

              <TagGroup alignment="start" titleId="hostname-hints-heading">
                {account.hostnameHints.map((hint) => (
                  <Tag
                    color={hint.cloudId === null ? 'red' : undefined}
                    elemBefore={
                      hint.cloudId === null ? (
                        <WarningIcon
                          color={token('color.icon.warning')}
                          label={t(
                            'accounts.manage_account.hostname.invalid_hint',
                          )}
                        />
                      ) : undefined
                    }
                    key={hint.hostname}
                    onAfterRemoveAction={() =>
                      removeHostnameHint(account, hint.hostname)
                    }
                    removeButtonLabel={t(
                      'accounts.manage_account.hostname.remove_hint',
                    )}
                    testId={`hostname-hint-${hint.hostname}`}
                    text={hint.hostname}
                  />
                ))}
              </TagGroup>
            </Stack>
          )}

          <Box style={formOffsetStyle}>
            <Form<HostnameHintFormData> onSubmit={submitHostname}>
              {({ formProps, submitting }) => (
                <form {...formProps} id="hostname-hint-form">
                  <Field
                    defaultValue=""
                    isRequired
                    label={t('accounts.manage_account.hostname.add_hostname')}
                    name="hostname"
                    testId="hostname-hint-input"
                  >
                    {({ fieldProps }) => (
                      <Fragment>
                        <Inline
                          alignBlock="center"
                          grow="fill"
                          space="space.100"
                          spread="space-between"
                        >
                          <TextField
                            {...fieldProps}
                            isCompact
                            placeholder={t(
                              'accounts.manage_account.hostname.hostname_helper',
                            )}
                          />
                          <IconButton
                            appearance="subtle"
                            icon={AddIcon}
                            isDisabled={submitting}
                            label={t('common.add')}
                            shape="circle"
                            testId="hostname-hint-add"
                            type="submit"
                          />
                        </Inline>
                        {resolutionError && (
                          <ErrorMessage>
                            {t(
                              'accounts.manage_account.hostname.resolution_error',
                            )}
                          </ErrorMessage>
                        )}
                      </Fragment>
                    )}
                  </Field>
                </form>
              )}
            </Form>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
};
