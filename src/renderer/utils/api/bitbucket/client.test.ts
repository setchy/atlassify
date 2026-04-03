import axios from 'axios';

import { mockAtlassianCloudAccount } from '../../../__mocks__/account-mocks';

import type { BitbucketYourWorkResponse } from './types';

import { getBitbucketWorkspaceYourWork } from './client';

const mockedAxios = vi.mocked(axios);

const mockResponse: BitbucketYourWorkResponse = {
  pullRequests: {
    reviewing: [
      {
        id: 1,
        title: 'Fix bug in auth',
        state: 'OPEN',
        author: {
          display_name: 'Alice',
          uuid: '{alice-uuid}',
          account_id: 'alice-id',
          links: {
            avatar: { href: 'https://avatar/alice' },
            html: { href: 'https://bitbucket.org/alice' },
          },
        },
        created_on: '2026-01-01T00:00:00Z',
        updated_on: '2026-01-02T00:00:00Z',
        links: {
          html: {
            href: 'https://bitbucket.org/my-workspace/repo/pull-requests/1',
          },
        },
        task_count: 0,
        comment_count: 2,
        destination: {
          repository: {
            name: 'repo',
            full_name: 'my-workspace/repo',
            links: {
              html: { href: 'https://bitbucket.org/my-workspace/repo' },
              avatar: {
                href: 'https://bitbucket.org/my-workspace/repo/avatar',
              },
            },
          },
        },
      },
    ],
    authored: [],
  },
};

describe('renderer/utils/api/bitbucket/client.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getBitbucketWorkspaceYourWork', () => {
    it('calls the internal API with the correct URL and returns the response', async () => {
      mockedAxios.mockResolvedValueOnce({ data: mockResponse });

      const result = await getBitbucketWorkspaceYourWork(
        mockAtlassianCloudAccount,
        'my-workspace',
      );

      expect(mockedAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining(
            'https://api.bitbucket.org/internal/workspaces/my-workspace/overview-view-state',
          ),
        }),
      );
      expect(result).toEqual(mockResponse);
    });

    it('encodes workspace slugs that contain special characters', async () => {
      mockedAxios.mockResolvedValueOnce({ data: mockResponse });

      await getBitbucketWorkspaceYourWork(
        mockAtlassianCloudAccount,
        'my workspace',
      );

      expect(mockedAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('my%20workspace'),
        }),
      );
    });

    it('includes the expected fields query parameter', async () => {
      mockedAxios.mockResolvedValueOnce({ data: mockResponse });

      await getBitbucketWorkspaceYourWork(
        mockAtlassianCloudAccount,
        'my-workspace',
      );

      expect(mockedAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('pullRequests.reviewing.id'),
        }),
      );
      expect(mockedAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('pullRequests.authored.id'),
        }),
      );
    });
  });
});
