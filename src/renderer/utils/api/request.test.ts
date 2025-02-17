import axios from 'axios';

import { mockAtlassianCloudAccount } from '../../__mocks__/state';
import type { Link } from '../../types';
import type { MeQuery, TypedDocumentString } from './graphql/generated/graphql';
import { performHeadRequest, performPostRequest } from './request';

vi.mock('axios');
const mockedAxios = vi.mocked(axios);
const url = 'https://team.atlassian.net/gateway/api/graphql' as Link;

describe('renderer/utils/api/request.ts', () => {
  beforeEach(() => {
    mockedAxios.mockResolvedValue({
      data: { data: {} },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should execute graphql request with the correct parameters', async () => {
    const data = {
      query: 'foo',
      variables: {
        key: 'value',
      },
    };
    const method = 'POST';

    await performPostRequest(
      mockAtlassianCloudAccount,
      'foo' as unknown as TypedDocumentString<MeQuery, unknown>,
      {
        key: 'value',
      },
    );

    expect(axios).toHaveBeenCalledWith({
      method,
      url,
      data,
    });

    expect(axios.defaults.headers.common).toMatchSnapshot();
  });

  it('should make a head request with the correct parameters', async () => {
    const data = {};
    const method = 'HEAD';

    await performHeadRequest(
      mockAtlassianCloudAccount.username,
      mockAtlassianCloudAccount.token,
    );

    expect(axios).toHaveBeenCalledWith({
      method,
      url,
      data,
    });

    expect(axios.defaults.headers.common).toMatchSnapshot();
  });
});
