import { mockAtlassianCloudAccount } from '../__mocks__/state-mocks';
import { mockSingleNotification } from './api/__mocks__/response-mocks';
import * as comms from './comms';
import {
  openAccountProfile,
  openAtlasifyReleaseNotes,
  openAtlasifyRepository,
  openMyIssues,
  openMyNotifications,
  openMyPullRequests,
  openNotification,
} from './links';

describe('utils/links.ts', () => {
  const openExternalLinkMock = jest
    .spyOn(comms, 'openExternalLink')
    .mockImplementation();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('openAtlasifyRepository', () => {
    openAtlasifyRepository();
    expect(openExternalLinkMock).toHaveBeenCalledWith(
      'https://github.com/setchy/atlasify',
    );
  });

  it('openAtlasifyReleaseNotes', () => {
    openAtlasifyReleaseNotes('v1.0.0');
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

  it('openNotification', async () => {
    const mockNotificationUrl = mockSingleNotification.url;
    await openNotification(mockSingleNotification);
    expect(openExternalLinkMock).toHaveBeenCalledWith(mockNotificationUrl);
  });
});
