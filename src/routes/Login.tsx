import log from 'electron-log';
import { type FC, Fragment, useCallback, useContext, useState } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import Form, {
  ErrorMessage,
  Field,
  FormFooter,
  FormSection,
  HelperMessage,
} from '@atlaskit/form';
import LockIcon from '@atlaskit/icon/glyph/lock';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import SignInIcon from '@atlaskit/icon/glyph/sign-in';
import { Box, Inline } from '@atlaskit/primitives';
import TextField from '@atlaskit/textfield';
import Tooltip from '@atlaskit/tooltip';

import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { AppContext } from '../context/App';
import type { Token, Username } from '../types';
import { checkIfCredentialsAreValid } from '../utils/api/client';
import type { LoginAPITokenOptions } from '../utils/auth/types';
import {
  openAtlassianCreateToken,
  openAtlassianSecurityDocs,
} from '../utils/links';

interface IValues {
  username: Username;
  token: Token;
}

export const LoginRoute: FC = () => {
  const { loginWithAPIToken } = useContext(AppContext);
  const navigate = useNavigate();
  const [isValidToken, setIsValidToken] = useState<boolean>(true);

  const login = useCallback(
    async (data: IValues) => {
      try {
        await checkIfCredentialsAreValid(data.username, data.token);

        await loginWithAPIToken(data as LoginAPITokenOptions);
        navigate(-1);
      } catch (err) {
        log.error('Auth: failed to login with provided credentials', err);
        setIsValidToken(false);
      }
    },
    [loginWithAPIToken],
  );

  return (
    <Fragment>
      <Header>Login with Atlassian</Header>

      <Box paddingInline="space.400">
        <Form<IValues> onSubmit={login}>
          {({ formProps, submitting }) => (
            <form {...formProps}>
              <FormSection>
                <Field
                  aria-required={true}
                  name="username"
                  label="Username"
                  defaultValue={''}
                  isRequired
                >
                  {({ fieldProps }) => (
                    <Fragment>
                      <TextField autoComplete="off" {...fieldProps} />
                      <HelperMessage>
                        Your Atlassian username / email address
                      </HelperMessage>
                    </Fragment>
                  )}
                </Field>
                <Field
                  aria-required={true}
                  name="token"
                  label="API Token"
                  defaultValue={''}
                  isRequired
                >
                  {({ fieldProps }) => (
                    <Fragment>
                      <TextField type="password" {...fieldProps} />
                      <HelperMessage>
                        <Inline alignBlock="center" space="space.050">
                          <Tooltip content="Create an API Token">
                            <Button
                              appearance="discovery"
                              spacing="compact"
                              iconBefore={LockIcon}
                              onClick={() => openAtlassianCreateToken()}
                            >
                              Create an API Token
                            </Button>
                          </Tooltip>
                          <Box>for your account and paste above</Box>
                        </Inline>
                      </HelperMessage>
                    </Fragment>
                  )}
                </Field>
              </FormSection>

              <Box paddingBlock="space.050">
                {!isValidToken && (
                  <ErrorMessage>
                    Oops! The username + token combination provided are not
                    valid. Please try again.
                  </ErrorMessage>
                )}
                <Inline alignBlock="center" spread="space-between">
                  <Box paddingBlockStart="space.300">
                    <Tooltip
                      content="See Atlassian documentation"
                      position="top"
                    >
                      <Button
                        appearance="subtle"
                        iconBefore={ShortcutIcon}
                        onClick={() => openAtlassianSecurityDocs()}
                      >
                        Docs
                      </Button>
                    </Tooltip>
                  </Box>
                  <FormFooter>
                    <ButtonGroup label="Form submit options">
                      <Button appearance="subtle" onClick={() => navigate(-1)}>
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        iconBefore={SignInIcon}
                        appearance="primary"
                        isLoading={submitting}
                      >
                        Login
                      </Button>
                    </ButtonGroup>
                  </FormFooter>
                </Inline>
              </Box>
            </form>
          )}
        </Form>
      </Box>
    </Fragment>
  );
};
