import axios from 'axios';
import type { Link } from '../../types';
import { apiRequestAuth } from './request';
import { mockToken, mockUsername } from '../../__mocks__/state-mocks';

jest.mock('axios');

const url = 'https://example.com' as Link;
const method = 'get';

describe('utils/api/request.ts', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should make a request with the correct parameters', async () => {
    const data = { key: 'value' };

    await apiRequestAuth(url, method, mockUsername, mockToken, data);

    expect(axios).toHaveBeenCalledWith({
      method,
      url,
      data,
    });

    expect(axios.defaults.headers.common).toMatchSnapshot();
  });

  it('should make a request with the correct parameters and default data', async () => {
    const data = {};
    await apiRequestAuth(url, method, mockUsername, mockToken, data);

    expect(axios).toHaveBeenCalledWith({
      method,
      url,
      data,
    });

    expect(axios.defaults.headers.common).toMatchSnapshot();
  });
});
