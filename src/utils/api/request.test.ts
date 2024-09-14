import axios from 'axios';
import { mockAtlassianCloudAccount } from '../../__mocks__/state-mocks';
import type { Link } from '../../types';
import { apiRequestAuth } from './request';

jest.mock('axios');

const url = 'https://example.com' as Link;
const method = 'get';

describe('utils/api/request.ts', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should make a request with the correct parameters', async () => {
    const data = { key: 'value' };

    await apiRequestAuth(mockAtlassianCloudAccount, data);

    expect(axios).toHaveBeenCalledWith({
      method,
      url,
      data,
    });

    expect(axios.defaults.headers.common).toMatchSnapshot();
  });

  it('should make a request with the correct parameters and default data', async () => {
    const data = {};
    await apiRequestAuth(mockAtlassianCloudAccount, data);

    expect(axios).toHaveBeenCalledWith({
      method,
      url,
      data,
    });

    expect(axios.defaults.headers.common).toMatchSnapshot();
  });
});
