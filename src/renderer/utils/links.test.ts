import { mockAtlassianCloudAccount } from '../__mocks__/account-mocks';
import { mockSingleAtlassifyNotification } from '../__mocks__/notifications-mocks';
import * as comms from './comms';
import {
  openAccountProfile,
  openAtlassianCreateToken,
  openAtlassianSecurityDocs,
  openAtlassifyReleaseNotes,
  openMyNotifications,
  openMyPullRequests,
  openNotification,
  URLs,
} from './links';

describe('renderer/utils/links.ts', () => {
  const mockOpenExternalLink = jest
    .spyOn(comms, 'openExternalLink')
    .mockImplementation();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('openAtlassifyReleaseNotes', () => {
    openAtlassifyReleaseNotes('v1.0.0');
    expect(mockOpenExternalLink).toHaveBeenCalledWith(
      'https://github.com/setchy/atlassify/releases/tag/v1.0.0',
    );
  });

  it('openAtlassianSecurityDocs', () => {
    openAtlassianSecurityDocs();
    expect(mockOpenExternalLink).toHaveBeenCalledWith(
      URLs.ATLASSIAN.DOCS.API_TOKEN,
    );
  });

  it('openAtlassianCreateToken', () => {
    openAtlassianCreateToken();
    expect(mockOpenExternalLink).toHaveBeenCalledWith(
      URLs.ATLASSIAN.WEB.SECURITY_TOKENS,
    );
  });

  it('openMyNotifications', () => {
    openMyNotifications();
    expect(mockOpenExternalLink).toHaveBeenCalledWith(
      URLs.ATLASSIAN.WEB.MY_NOTIFICATIONS,
    );
  });

  it('openMyPullRequests', () => {
    openMyPullRequests();
    expect(mockOpenExternalLink).toHaveBeenCalledWith('https://bitbucket.org/');
  });

  it('openAccountProfile', () => {
    openAccountProfile(mockAtlassianCloudAccount);
    expect(mockOpenExternalLink).toHaveBeenCalledWith(
      'https://team.atlassian.com/people/123456789',
    );
  });

  describe('openNotification', () => {
    it('openNotification should use entity url when available', async () => {
      const mockNotificationUrl = mockSingleAtlassifyNotification.entity.url;
      await openNotification(mockSingleAtlassifyNotification);
      expect(mockOpenExternalLink).toHaveBeenCalledWith(mockNotificationUrl);
    });

    it('openNotification should fallback to notification url when entity url is not available', async () => {
      const mockNotif = mockSingleAtlassifyNotification;
      mockNotif.entity.url = null;
      const mockNotificationUrl = mockNotif.url;

      await openNotification(mockNotif);
      expect(mockOpenExternalLink).toHaveBeenCalledWith(mockNotificationUrl);
    });
  });
});
