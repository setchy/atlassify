import axios from 'axios';
import { mockAtlassianCloudAccount } from '../../__mocks__/state-mocks';
import type { Link } from '../../types';
import { performHeadRequest, performPostRequest } from './request';
import type { GraphQLRequest } from './types';

jest.mock('axios');

const url = 'https://team.atlassian.net/gateway/api/graphql' as Link;

describe('utils/api/request.ts', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should make a post request with the correct parameters', async () => {
    const data: GraphQLRequest = {
      query: 'foo',
      variables: {
        key: 'value',
      },
    };
    const method = 'POST';

    await performPostRequest(mockAtlassianCloudAccount, data);

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
