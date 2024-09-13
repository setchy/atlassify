import { BookIcon, KeyIcon, SignInIcon } from '@primer/octicons-react';
import log from 'electron-log';
import { type FC, useCallback, useContext, useState } from 'react';
import { Form, type FormRenderProps } from 'react-final-form';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Button } from '../components/buttons/Button';
import { FieldInput } from '../components/fields/FieldInput';
import { AppContext } from '../context/App';
import { type Organization, Size, type Token, type Username } from '../types';
import type { LoginAPITokenOptions } from '../utils/auth/types';
import { isValidAPIToken } from '../utils/auth/utils';
import { Constants } from '../utils/constants';

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
  } else if (!isValidAPIToken(values.token)) {
    errors.token = 'Invalid app password.';
  }

  return errors;
};

export const LoginWithAPIToken: FC = () => {
  const { loginWithAPIToken } = useContext(AppContext);
  const navigate = useNavigate();
  const [isValidToken, setIsValidToken] = useState<boolean>(true);

  const renderForm = (formProps: FormRenderProps) => {
    const { handleSubmit, submitting, pristine, values } = formProps;

    // TODO - Correctly set account.id and account.hostname
    return (
      <form onSubmit={handleSubmit}>
        <FieldInput
          name="username"
          label="Username"
          placeholder="Your Atlassian username"
          helpText={
            <div>
              <div className="mt-3">
                <Button
                  label="Create API token"
                  disabled={!values.hostname}
                  icon={{ icon: KeyIcon, size: Size.XSMALL }}
                  url={Constants.ATLASSIAN_WEB.SECURITY_TOKENS}
                  size="xs"
                >
                  Create an API Token
                </Button>
                <span className="mx-1">
                  for your Atlassian account and then paste your{' '}
                  <span className="italic">API Token</span> below.
                </span>
              </div>
            </div>
          }
        />

        <FieldInput
          name="token"
          label="API Token"
          placeholder="The 24 characters API Token"
        />

        {!isValidToken && (
          <div className="mt-4 text-sm font-medium text-red-500">
            This token could not be validated with {values.workspace}.
          </div>
        )}

        <div className="flex items-end justify-between mt-2">
          <Button
            label="Atlassian Docs"
            icon={{ icon: BookIcon, size: Size.XSMALL }}
            size="xs"
            url={Constants.ATLASSIAN_DOCS.API_TOKEN_URL}
          >
            Docs
          </Button>
          <Button
            label="Login"
            className="px-4 py-2 !text-sm"
            icon={{ icon: SignInIcon, size: Size.MEDIUM }}
            disabled={submitting || pristine}
            type="submit"
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
      <Header icon={KeyIcon}>Login with Atlassian Account</Header>

      <div className="px-8">
        <Form
          initialValues={{
            username: '' as Username,
            token: '' as Token,
            workspace: '' as Organization,
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
