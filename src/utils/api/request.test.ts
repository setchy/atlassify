import axios from 'axios';
import { mockAtlassianCloudAccount } from '../../__mocks__/state-mocks';
import type { Link } from '../../types';
import { performPostRequest } from './request';

jest.mock('axios');

const url = 'https://team.atlassian.net/gateway/api/graphql' as Link;
const method = 'POST';

describe('utils/api/request.ts', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should make a request with the correct parameters', async () => {
    const data = { key: 'value' };

    await performPostRequest(mockAtlassianCloudAccount, data);

    expect(axios).toHaveBeenCalledWith({
      method,
      url,
      data,
    });

    expect(axios.defaults.headers.common).toMatchSnapshot();
  });

  it('should make a request with the correct parameters and default data', async () => {
    const data = {};
    await performPostRequest(mockAtlassianCloudAccount, data);

    expect(axios).toHaveBeenCalledWith({
      method,
      url,
      data,
    });

    expect(axios.defaults.headers.common).toMatchSnapshot();
  });
});
