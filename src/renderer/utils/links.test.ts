import { mockSingleAtlassifyNotification } from '../__mocks__/notifications-mocks';
import { mockAtlassianCloudAccount } from '../__mocks__/state-mocks';
import * as comms from './comms';
import {
  URLs,
  openAccountProfile,
  openAtlassianCreateToken,
  openAtlassianSecurityDocs,
  openAtlassifyReleaseNotes,
  openMyNotifications,
  openMyPullRequests,
  openNotification,
} from './links';

describe('renderer/utils/links.ts', () => {
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

  it('openAtlassianSecurityDocs', () => {
    openAtlassianSecurityDocs();
    expect(openExternalLinkMock).toHaveBeenCalledWith(
      URLs.ATLASSIAN.DOCS.API_TOKEN,
    );
  });

  it('openAtlassianCreateToken', () => {
    openAtlassianCreateToken();
    expect(openExternalLinkMock).toHaveBeenCalledWith(
      URLs.ATLASSIAN.WEB.SECURITY_TOKENS,
    );
  });

  it('openMyNotifications', () => {
    openMyNotifications();
    expect(openExternalLinkMock).toHaveBeenCalledWith(
      URLs.ATLASSIAN.WEB.MY_NOTIFICATIONS,
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
    const mockNotificationUrl = mockSingleAtlassifyNotification.entity.url;
    await openNotification(mockSingleAtlassifyNotification);
    expect(openExternalLinkMock).toHaveBeenCalledWith(mockNotificationUrl);
  });
});
