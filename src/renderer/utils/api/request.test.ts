import axios from 'axios';

import { mockAtlassianCloudAccount } from '../../__mocks__/state-mocks';
import type { Link, Token, Username } from '../../types';
import type { MeQuery, TypedDocumentString } from './graphql/generated/graphql';
import {
  performRequestForAccount,
  performRequestForCredentials,
} from './request';

jest.mock('axios');

const url = 'https://team.atlassian.net/gateway/api/graphql' as Link;

describe('renderer/utils/api/request.ts', () => {
  beforeEach(() => {
    (axios as jest.MockedFunction<typeof axios>).mockResolvedValue({
      data: {
        data: {},
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('performRequestForAccount - should execute graphql request with the correct parameters', async () => {
    const data = {
      query: 'foo',
      variables: {
        key: 'value',
      },
    };

    await performRequestForAccount(
      mockAtlassianCloudAccount,
      'foo' as unknown as TypedDocumentString<MeQuery, unknown>,
      {
        key: 'value',
      },
    );

    expect(axios).toHaveBeenCalledWith({
      url,
      data,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Basic dXNlckBhdGxhc3NpZnkuaW86ZGVjcnlwdGVk',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
      },
    });
  });

  it('performRequestForCredentials - should execute graphql request with the correct parameters', async () => {
    const data = {
      query: 'foo',
      variables: {
        key: 'value',
      },
    };

    await performRequestForCredentials(
      'some-username' as Username,
      'some-password' as Token,
      'foo' as unknown as TypedDocumentString<MeQuery, unknown>,
      {
        key: 'value',
      },
    );

    expect(axios).toHaveBeenCalledWith({
      url,
      data,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Basic c29tZS11c2VybmFtZTpzb21lLXBhc3N3b3Jk',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
      },
    });
  });
});
