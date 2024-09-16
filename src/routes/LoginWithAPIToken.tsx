import log from 'electron-log';
import { type FC, useCallback, useContext, useState } from 'react';

import Button from '@atlaskit/button/new';
import LockIcon from '@atlaskit/icon/glyph/lock';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import SignInIcon from '@atlaskit/icon/glyph/sign-in';
import Tooltip from '@atlaskit/tooltip';

import { Form, type FormRenderProps } from 'react-final-form';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { FieldInput } from '../components/fields/FieldInput';
import { AppContext } from '../context/App';
import type { Token, Username } from '../types';
import type { LoginAPITokenOptions } from '../utils/auth/types';
import {
  openAtlassianCreateToken,
  openAtlassianSecurityDocs,
} from '../utils/links';
interface IValues {
  username: Username;
  token?: Token;
}

interface IFormErrors {
  username?: string;
  token?: string;
}

export const validate = (values: IValues): IFormErrors => {
  const errors: IFormErrors = {};

  if (!values.username) {
    errors.username = 'Required';
  }

  if (!values.token) {
    errors.token = 'Required';
  }

  return errors;
};

export const LoginWithAPIToken: FC = () => {
  const { loginWithAPIToken } = useContext(AppContext);
  const navigate = useNavigate();
  const [isValidToken, setIsValidToken] = useState<boolean>(true);

  const renderForm = (formProps: FormRenderProps) => {
    const { handleSubmit, submitting, pristine, values } = formProps;

    return (
      <form onSubmit={handleSubmit}>
        <FieldInput
          name="username"
          label="Username"
          placeholder="Your Atlassian username"
        />

        <FieldInput
          name="token"
          label="API Token"
          placeholder="The 24 characters API Token"
          helpText={
            <div>
              <div className="mt-3">
                <Tooltip content="Create API Token">
                  <Button
                    appearance="discovery"
                    spacing="compact"
                    iconBefore={LockIcon}
                    onClick={() => openAtlassianCreateToken()}
                  >
                    Create API Token
                  </Button>
                </Tooltip>
              </div>
            </div>
          }
        />

        {!isValidToken && (
          <div className="mt-4 text-sm font-medium text-red-500">
            This token could not be validated with {values.workspace}.
          </div>
        )}

        <div className="mt-10 flex items-end justify-between">
          <Tooltip content="See Atlassian documentation">
            <Button
              appearance="subtle"
              iconBefore={ShortcutIcon}
              onClick={() => openAtlassianSecurityDocs()}
            >
              Docs
            </Button>
          </Tooltip>

          <Button
            type="submit"
            iconBefore={SignInIcon}
            appearance="primary"
            isDisabled={submitting || pristine}
          >
            Login
          </Button>
        </div>
      </form>
    );
  };

  const login = useCallback(
    async (data: IValues) => {
      setIsValidToken(true);
      try {
        await loginWithAPIToken(data as LoginAPITokenOptions);
        navigate(-1);
      } catch (err) {
        log.error('Auth: failed to login with personal access token', err);
        setIsValidToken(false);
      }
    },
    [loginWithAPIToken],
  );

  return (
    <>
      <Header>Login with Atlassian Account</Header>

      <div className="px-8">
        <Form
          initialValues={{
            username: '' as Username,
            token: '' as Token,
          }}
          onSubmit={login}
          validate={validate}
        >
          {renderForm}
        </Form>
      </div>
    </>
  );
};
