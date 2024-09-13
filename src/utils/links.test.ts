import { partialMockUser } from '../__mocks__/partial-mocks';
import { mockAtlassianCloudAccount } from '../__mocks__/state-mocks';
import { mockSingleNotification } from './api/__mocks__/response-mocks';
import type { Repository } from './api/types';
import * as comms from './comms';
import {
  openAccountProfile,
  openGitifyReleaseNotes,
  openGitifyRepository,
  openMyIssues,
  openMyNotifications,
  openMyPullRequests,
  openNotification,
  openRepository,
  openUserProfile,
} from './links';

describe('utils/links.ts', () => {
  const openExternalLinkMock = jest
    .spyOn(comms, 'openExternalLink')
    .mockImplementation();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('openGitifyRepository', () => {
    openGitifyRepository();
    expect(openExternalLinkMock).toHaveBeenCalledWith(
      'https://github.com/setchy/atlasify',
    );
  });

  it('openGitifyReleaseNotes', () => {
    openGitifyReleaseNotes('v1.0.0');
    expect(openExternalLinkMock).toHaveBeenCalledWith(
      'https://github.com/setchy/atlasify/releases/tag/v1.0.0',
    );
  });

  it('openGitHubNotifications', () => {
    openMyNotifications();
    expect(openExternalLinkMock).toHaveBeenCalledWith(
      'https://github.com/notifications',
    );
  });

  it('openGitHubIssues', () => {
    openMyIssues();
    expect(openExternalLinkMock).toHaveBeenCalledWith(
      'https://github.com/issues',
    );
  });

  it('openGitHubPulls', () => {
    openMyPullRequests();
    expect(openExternalLinkMock).toHaveBeenCalledWith(
      'https://github.com/pulls',
    );
  });

  it('openAccountProfile', () => {
    openAccountProfile(mockAtlassianCloudAccount);
    expect(openExternalLinkMock).toHaveBeenCalledWith(
      'https://github.com/octocat',
    );
  });

  it('openUserProfile', () => {
    const mockUser = partialMockUser('mock-user');
    openUserProfile(mockUser);
    expect(openExternalLinkMock).toHaveBeenCalledWith(
      'https://github.com/mock-user',
    );
  });

  it('openRepository', () => {
    const mockHtmlUrl = 'https://github.com/setchy/atlasify';

    const repo = {
      html_url: mockHtmlUrl,
    } as Repository;

    openRepository(repo);
    expect(openExternalLinkMock).toHaveBeenCalledWith(mockHtmlUrl);
  });

  it('openNotification', async () => {
    const mockNotificationUrl = mockSingleNotification.repository.html_url;
    await openNotification(mockSingleNotification);
    expect(openExternalLinkMock).toHaveBeenCalledWith(mockNotificationUrl);
  });
});
