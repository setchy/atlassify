import { getAPIUrl } from './utils';

describe('utils/api/utils.ts', () => {
  it('getAPIUrl', () => {
    const result = getAPIUrl();
    expect(result.toString()).toBe(
      'https://team.atlassian.net/gateway/api/graphql',
    );
  });
});
