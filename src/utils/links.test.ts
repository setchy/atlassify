import { mockSingleNotification } from '../__mocks__/notifications-mocks';
import { mockAtlassianCloudAccount } from '../__mocks__/state-mocks';
import * as comms from './comms';
import {
  openAccountProfile,
  openAtlassifyReleaseNotes,
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

  it('openAtlassifyReleaseNotes', () => {
    openAtlassifyReleaseNotes('v1.0.0');
    expect(openExternalLinkMock).toHaveBeenCalledWith(
      'https://github.com/setchy/atlassify/releases/tag/v1.0.0',
    );
  });

  it('openMyNotifications', () => {
    openMyNotifications();
    expect(openExternalLinkMock).toHaveBeenCalledWith(
      'https://team.atlassian.com/notifications',
    );
  });

  it('openMyPullRequests', () => {
    openMyPullRequests();
    expect(openExternalLinkMock).toHaveBeenCalledWith('https://bitbucket.org/');
  });

  it('openAccountProfile', () => {
    openAccountProfile(mockAtlassianCloudAccount);
    expect(openExternalLinkMock).toHaveBeenCalledWith(
      'https://team.atlassian.com/people/123456789',
    );
  });

  it('openNotification', async () => {
    const mockNotificationUrl = mockSingleNotification.entity.url;
    await openNotification(mockSingleNotification);
    expect(openExternalLinkMock).toHaveBeenCalledWith(mockNotificationUrl);
  });
});
