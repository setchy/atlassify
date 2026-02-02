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
import { Box, Inline, Stack } from '@atlaskit/primitives';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
import TextField from '@atlaskit/textfield';
import Tooltip from '@atlaskit/tooltip';

import { useAppContext } from '../hooks/useAppContext';

import { Contents } from '../components/layout/Contents';
import { Page } from '../components/layout/Page';
import { Footer } from '../components/primitives/Footer';
import { Header } from '../components/primitives/Header';

import type { Token, Username } from '../types';
import { AuthMethod } from '../types';

import { checkIfCredentialsAreValid } from '../utils/api/client';
import {
  ATLASSIAN_OAUTH_CONFIG,
  exchangeCodeForTokens,
  getUserInfo,
} from '../utils/auth/oauth';
import { hasUsernameAlready } from '../utils/auth/utils';
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

  const { login, auth } = useAppContext();

  const { t } = useTranslation();

  const [isValidCredentials, setIsValidCredentials] = useState(true);
  const [isDuplicateUsername, setIsDuplicateUsername] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const [oAuthError, setOAuthError] = useState<string | null>(null);

  const loginUser = useCallback(
    async (data: LoginProps) => {
      try {
        await checkIfCredentialsAreValid(data.username, data.token);
        await login({
          authMethod: AuthMethod.API_TOKEN,
          username: data.username,
          token: data.token,
        });
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

  const loginWithOAuth = useCallback(async () => {
    try {
      setIsOAuthLoading(true);
      setOAuthError(null);

      // Note: In a real implementation, the clientId would be configurable
      // For now, using a placeholder that users need to configure
      const clientId = 'YOUR_OAUTH_CLIENT_ID'; // TODO: Make this configurable

      if (clientId === 'YOUR_OAUTH_CLIENT_ID') {
        setOAuthError(
          'OAuth Client ID not configured. Please set up an OAuth app in Atlassian Developer Console.',
        );
        setIsOAuthLoading(false);
        return;
      }

      const redirectUri = ATLASSIAN_OAUTH_CONFIG.redirectUri;
      const scopes = ATLASSIAN_OAUTH_CONFIG.scopes;

      // Start OAuth flow via IPC
      const result = await window.atlassify.oauth.startFlow(
        clientId,
        redirectUri,
        scopes,
      );

      if (!result || !result.code) {
        throw new Error('OAuth flow failed: No authorization code received');
      }

      // Exchange code for tokens
      const tokens = await exchangeCodeForTokens(
        result.code,
        result.codeVerifier,
        clientId,
        redirectUri,
      );

      // Get user info
      const userInfo = await getUserInfo(tokens.accessToken);

      // Login with OAuth credentials
      await login({
        authMethod: AuthMethod.OAUTH,
        username: userInfo.email as Username,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });

      navigate(-1);
    } catch (err) {
      rendererLogError('loginWithOAuth', 'OAuth login failed', err);
      setOAuthError(
        err instanceof Error
          ? err.message
          : 'OAuth login failed. Please try again.',
      );
    } finally {
      setIsOAuthLoading(false);
    }
  }, [login, navigate]);

  return (
    <Page testId="login">
      <Header>{t('login.title')}</Header>

      <Contents>
        <Box paddingInline="space.250">
          <Tabs id="login-tabs">
            <TabList>
              <Tab>API Token</Tab>
              <Tab>OAuth (SSO)</Tab>
            </TabList>
            <TabPanel>
              <Form<LoginProps> onSubmit={loginUser}>
                {({ formProps, submitting }) => (
                  <Stack space="space.200">
                    <Box>
                      {isDuplicateUsername && (
                        <ErrorMessage>
                          {t('login.duplicate_username')}
                        </ErrorMessage>
                      )}
                      {!isValidCredentials && (
                        <ErrorMessage>{t('login.error_message')}</ErrorMessage>
                      )}
                    </Box>
                    <form {...formProps} id="login-form">
                      <FormSection>
                        <Field
                          defaultValue={''}
                          label={t('common.username')}
                          name="username"
                          testId="login-username"
                        >
                          {({ fieldProps }) => {
                            const onChange = (
                              e: ChangeEvent<HTMLInputElement>,
                            ) => {
                              fieldProps.onChange(e);
                              setIsDuplicateUsername(
                                hasUsernameAlready(
                                  auth,
                                  e.target.value as Username,
                                ),
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
                    <Footer justify="space-between">
                      <Tooltip
                        content={t('login.security_docs')}
                        position="top"
                      >
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
                  </Stack>
                )}
              </Form>
            </TabPanel>
            <TabPanel>
              <Stack space="space.300">
                {oAuthError && <ErrorMessage>{oAuthError}</ErrorMessage>}
                <Box>
                  <p>
                    Sign in with your Atlassian account using OAuth 2.0 (SSO).
                  </p>
                  <p>
                    This will open your browser to authenticate with Atlassian.
                    After authentication, you'll be redirected back to
                    Atlassify.
                  </p>
                </Box>
                <Footer justify="space-between">
                  <Tooltip content={t('login.security_docs')} position="top">
                    <Button
                      appearance="subtle"
                      iconBefore={LinkExternalIcon}
                      onClick={() => openAtlassianSecurityDocs()}
                      testId="login-docs-oauth"
                    >
                      {t('common.docs')}
                    </Button>
                  </Tooltip>
                  <ButtonGroup label="OAuth login options">
                    <Button
                      appearance="subtle"
                      onClick={() => navigate(-1)}
                      testId="login-cancel-oauth"
                    >
                      {t('common.cancel')}
                    </Button>
                    <Button
                      appearance="primary"
                      iconBefore={LogInIcon}
                      isLoading={isOAuthLoading}
                      onClick={loginWithOAuth}
                      testId="login-oauth"
                    >
                      Sign in with Atlassian
                    </Button>
                  </ButtonGroup>
                </Footer>
              </Stack>
            </TabPanel>
          </Tabs>
        </Box>
      </Contents>
    </Page>
  );
};
