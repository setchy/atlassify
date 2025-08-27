import { type FC, Fragment, useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import Form, {
  ErrorMessage,
  Field,
  FormFooter,
  FormSection,
  HelperMessage,
} from '@atlaskit/form';
import LinkExternalIcon from '@atlaskit/icon/core/link-external';
import LockLockedIcon from '@atlaskit/icon/core/lock-locked';
import LogInIcon from '@atlaskit/icon/core/log-in';
import { Box, Inline, Stack } from '@atlaskit/primitives';
import TextField from '@atlaskit/textfield';
import Tooltip from '@atlaskit/tooltip';

import { Page } from '../components/layout/Page';
import { Header } from '../components/primitives/Header';
import { AppContext } from '../context/App';
import type { Token, Username } from '../types';
import { checkIfCredentialsAreValid } from '../utils/api/client';
import type { LoginOptions } from '../utils/auth/types';
import {
  openAtlassianCreateToken,
  openAtlassianSecurityDocs,
} from '../utils/links';
import { rendererLogError } from '../utils/logger';

interface IValues {
  username: Username;
  token: Token;
}

export const LoginRoute: FC = () => {
  const { t } = useTranslation();
  const { login } = useContext(AppContext);
  const navigate = useNavigate();
  const [isValidToken, setIsValidToken] = useState<boolean>(true);

  const loginUser = useCallback(
    async (data: IValues) => {
      try {
        await checkIfCredentialsAreValid(data.username, data.token);

        await login(data as LoginOptions);
        navigate(-1);
      } catch (err) {
        rendererLogError(
          'loginUser',
          'failed to login with provided credentials',
          err,
        );

        setIsValidToken(false);
      }
    },
    [login],
  );

  return (
    <Page id="login">
      <Header>{t('login.title')}</Header>

      <Box paddingInline="space.400">
        <Box>
          {!isValidToken && (
            <ErrorMessage>{t('login.error_message')}</ErrorMessage>
          )}
        </Box>
        <Form<IValues> onSubmit={loginUser}>
          {({ formProps, submitting }) => (
            <form {...formProps}>
              <FormSection>
                <Field
                  aria-required={true}
                  defaultValue={''}
                  label={t('common.username')}
                  name="username"
                  // FIXME #568 isRequired causes the renderer process on Windows devices to crash upon mouse enter
                  // isRequired
                  testId="login-username"
                >
                  {({ fieldProps }) => (
                    <Fragment>
                      <TextField autoComplete="off" {...fieldProps} />
                      <HelperMessage>
                        {t('login.username_helper')}
                      </HelperMessage>
                    </Fragment>
                  )}
                </Field>
                <Field
                  aria-required={true}
                  defaultValue={''}
                  label={t('login.token')}
                  name="token"
                  // FIXME #568 isRequired causes the renderer process on Windows devices to crash upon mouse enter
                  // isRequired
                  testId="login-token"
                >
                  {({ fieldProps }) => (
                    <Fragment>
                      <TextField type="password" {...fieldProps} />
                      <HelperMessage>
                        <Stack alignBlock="center" space="space.050">
                          <Tooltip content={t('login.create_token')}>
                            <Button
                              appearance="discovery"
                              iconBefore={(iconProps) => (
                                <LockLockedIcon {...iconProps} size="small" />
                              )}
                              onClick={() => openAtlassianCreateToken()}
                              spacing="compact"
                              testId="login-create-token"
                            >
                              {t('login.create_token')}
                            </Button>
                          </Tooltip>
                          <Box>{t('login.token_helper')}</Box>
                        </Stack>
                      </HelperMessage>
                    </Fragment>
                  )}
                </Field>
              </FormSection>

              <Inline alignBlock="center" spread="space-between">
                <Box paddingBlockStart="space.300">
                  <Tooltip content={t('login.security_docs')} position="top">
                    <Button
                      appearance="subtle"
                      iconBefore={LinkExternalIcon}
                      onClick={() => openAtlassianSecurityDocs()}
                      testId="login-docs"
                    >
                      {t('common.docs')}
                    </Button>
                  </Tooltip>
                </Box>
                <FormFooter>
                  <ButtonGroup label="Form submit options">
                    <Button
                      appearance="subtle"
                      onClick={() => navigate(-1)}
                      testId="login-cancel"
                    >
                      {t('common.cancel')}
                    </Button>
                    <Button
                      appearance="primary"
                      iconBefore={LogInIcon}
                      isLoading={submitting}
                      testId="login-submit"
                      type="submit"
                    >
                      {t('common.login')}
                    </Button>
                  </ButtonGroup>
                </FormFooter>
              </Inline>
            </form>
          )}
        </Form>
      </Box>
    </Page>
  );
};
