import {
  type ChangeEvent,
  type FC,
  Fragment,
  useCallback,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import Form, {
  ErrorMessage,
  Field,
  FormSection,
  HelperMessage,
} from '@atlaskit/form';
import LinkExternalIcon from '@atlaskit/icon/core/link-external';
import LockLockedIcon from '@atlaskit/icon/core/lock-locked';
import LogInIcon from '@atlaskit/icon/core/log-in';
import { Box, Inline } from '@atlaskit/primitives';
import TextField from '@atlaskit/textfield';
import Tooltip from '@atlaskit/tooltip';

import { useAppContext } from '../hooks/useAppContext';
import useAccountsStore from '../stores/useAccountsStore';

import { Contents } from '../components/layout/Contents';
import { Page } from '../components/layout/Page';
import { Footer } from '../components/primitives/Footer';
import { Header } from '../components/primitives/Header';

import type { Token, Username } from '../types';
import type { LoginOptions } from '../utils/auth/types';

import { checkIfCredentialsAreValid } from '../utils/api/client';
import {
  openAtlassianCreateToken,
  openAtlassianSecurityDocs,
} from '../utils/links';
import { rendererLogError } from '../utils/logger';

interface LoginProps {
  username: Username;
  token: Token;
}

export const LoginRoute: FC = () => {
  const navigate = useNavigate();

  const { login } = useAppContext();
  const hasUsernameAlready = useAccountsStore((s) => s.hasUsernameAlready);

  const { t } = useTranslation();

  const [isValidCredentials, setIsValidCredentials] = useState(true);
  const [isDuplicateUsername, setIsDuplicateUsername] = useState(false);

  const loginUser = useCallback(
    async (data: LoginProps) => {
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
        setIsValidCredentials(false);
      }
    },
    [login],
  );

  return (
    <Page testId="login">
      <Header>{t('login.title')}</Header>

      <Form<LoginProps> onSubmit={loginUser}>
        {({ formProps, submitting }) => (
          <>
            <Contents>
              <Box paddingInline="space.250">
                <Box>
                  {isDuplicateUsername && (
                    <ErrorMessage>{t('login.duplicate_username')}</ErrorMessage>
                  )}
                  {!isValidCredentials && (
                    <ErrorMessage>{t('login.error_message')}</ErrorMessage>
                  )}
                </Box>
                <form {...formProps} id="login-form">
                  <FormSection>
                    <Field
                      defaultValue={''}
                      // isRequired={true} // Causes app crash on Windows.  Needs investigation.
                      label={t('common.username')}
                      name="username"
                      testId="login-username"
                    >
                      {({ fieldProps }) => {
                        const onChange = (e: ChangeEvent<HTMLInputElement>) => {
                          fieldProps.onChange(e);
                          setIsDuplicateUsername(
                            hasUsernameAlready(e.target.value as Username),
                          );
                        };
                        return (
                          <Fragment>
                            <TextField
                              autoComplete="off"
                              {...fieldProps}
                              onChange={onChange}
                            />
                            <HelperMessage>
                              {t('login.username_helper')}
                            </HelperMessage>
                          </Fragment>
                        );
                      }}
                    </Field>
                    <Field
                      defaultValue={''}
                      // isRequired={true} // Causes app crash on Windows.  Needs investigation.
                      label={t('login.token')}
                      name="token"
                      testId="login-token"
                    >
                      {({ fieldProps }) => (
                        <Fragment>
                          <TextField type="password" {...fieldProps} />
                          <HelperMessage>
                            <Inline alignBlock="center" space="space.050">
                              <Tooltip content={t('login.create_token')}>
                                <Button
                                  appearance="discovery"
                                  iconBefore={(iconProps) => (
                                    <LockLockedIcon
                                      {...iconProps}
                                      size="small"
                                    />
                                  )}
                                  onClick={() => openAtlassianCreateToken()}
                                  spacing="compact"
                                  testId="login-create-token"
                                >
                                  {t('login.create_token')}
                                </Button>
                              </Tooltip>
                              <Box>{t('login.token_helper')}</Box>
                            </Inline>
                          </HelperMessage>
                        </Fragment>
                      )}
                    </Field>
                  </FormSection>
                </form>
              </Box>
            </Contents>

            <Footer justify="space-between">
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
                  form="login-form"
                  iconBefore={LogInIcon}
                  isDisabled={isDuplicateUsername}
                  isLoading={submitting}
                  testId="login-submit"
                  type="submit"
                >
                  {t('common.login')}
                </Button>
              </ButtonGroup>
            </Footer>
          </>
        )}
      </Form>
    </Page>
  );
};
