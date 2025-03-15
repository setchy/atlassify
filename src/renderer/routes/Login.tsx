import { type FC, Fragment, useCallback, useContext, useState } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import Form, { ErrorMessage, Field, FormFooter } from '@atlaskit/form';
import LinkExternalIcon from '@atlaskit/icon/core/link-external';
import LogInIcon from '@atlaskit/icon/core/log-in';
import LockLockedIcon from '@atlaskit/icon/utility/lock-locked';
import { Box, Inline, Stack } from '@atlaskit/primitives';
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
    [login, navigate],
  );

  const labelClasses = 'font-bold text-sm text-gray-700';
  const requiredClasses = 'text-red-500';
  const inputClasses = 'border border-gray-400 rounded px-2 py-1 w-full';
  const helpTextClasses = 'text-xs text-gray-500 mt-1';

  return (
    <Fragment>
      <Header>Login with Atlassian</Header>

      <Box paddingInline="space.400">
        <Form<IValues> onSubmit={loginUser}>
          {({ formProps, submitting }) => (
            <form {...formProps}>
              <Stack space="space.400">
                <Stack space="space.050">
                  <Inline alignBlock="center" space="space.050">
                    <label htmlFor="username" className={labelClasses}>
                      Username
                    </label>
                    <span className={requiredClasses}>*</span>
                  </Inline>
                  <Field name="username" defaultValue="" isRequired>
                    {({ fieldProps }) => (
                      <Box>
                        <input
                          {...fieldProps}
                          type="text"
                          id="username"
                          name="username"
                          required
                          className={inputClasses}
                        />
                      </Box>
                    )}
                  </Field>
                  <Box>
                    <div className={helpTextClasses}>
                      Your Atlassian username / email address
                    </div>
                  </Box>
                </Stack>
                <Stack space="space.050">
                  <Inline alignBlock="center" space="space.050">
                    <label htmlFor="token" className={labelClasses}>
                      API Token
                    </label>
                    <span className={requiredClasses}>*</span>
                  </Inline>
                  <Field name="token" defaultValue="" isRequired>
                    {({ fieldProps }) => (
                      <Box>
                        <input
                          {...fieldProps}
                          type="password"
                          id="token"
                          name="token"
                          required
                          className={inputClasses}
                        />
                      </Box>
                    )}
                  </Field>
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
                    <Box>
                      <div className={helpTextClasses}>
                        for your account and paste above
                      </div>
                    </Box>
                  </Inline>
                </Stack>
              </Stack>

              {/* Error message for invalid token */}
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
