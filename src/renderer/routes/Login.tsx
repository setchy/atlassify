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
import LinkExternalIcon from '@atlaskit/icon/core/link-external';
import LogInIcon from '@atlaskit/icon/core/log-in';
import LockLockedIcon from '@atlaskit/icon/utility/lock-locked';
import { Box, Inline } from '@atlaskit/primitives';
import TextField from '@atlaskit/textfield';
import Tooltip from '@atlaskit/tooltip';

import { useNavigate } from 'react-router-dom';
import { logError } from '../../shared/logger';
import { Header } from '../components/primitives/Header';
import { AppContext } from '../context/App';
import type { Token, Username } from '../types';
import { checkIfCredentialsAreValid } from '../utils/api/client';
import type { LoginOptions } from '../utils/auth/types';
import {
  openAtlassianCreateToken,
  openAtlassianSecurityDocs,
} from '../utils/links';

interface IValues {
  username: Username;
  token: Token;
}

export const LoginRoute: FC = () => {
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
        logError('loginUser', 'failed to login with provided credentials', err);

        setIsValidToken(false);
      }
    },
    [login],
  );

  return (
    <Fragment>
      <Header>Login with Atlassian</Header>

      <Box paddingInline="space.400">
        <Form<IValues> onSubmit={loginUser}>
          {({ formProps, submitting }) => (
            <form {...formProps}>
              <FormSection>
                <Field
                  aria-required={true}
                  name="username"
                  label="Username"
                  defaultValue={''}
                  // FIXME: isRequired causes the renderer process on Windows devices to crash upon mouse enter
                  // isRequired
                  testId="login-username"
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
                  // FIXME: isRequired causes the renderer process on Windows devices to crash upon mouse enter
                  // isRequired
                  testId="login-token"
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
                              iconBefore={LockLockedIcon}
                              onClick={() => openAtlassianCreateToken()}
                              testId="login-create-token"
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
                        iconBefore={LinkExternalIcon}
                        onClick={() => openAtlassianSecurityDocs()}
                        testId="login-docs"
                      >
                        Docs
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
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        iconBefore={LogInIcon}
                        appearance="primary"
                        isLoading={submitting}
                        testId="login-submit"
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
