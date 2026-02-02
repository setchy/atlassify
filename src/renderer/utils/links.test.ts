import { vi } from 'vitest';

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
  const openExternalLinkSpy = vi
    .spyOn(comms, 'openExternalLink')
    .mockImplementation();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('openAtlassifyReleaseNotes', () => {
    openAtlassifyReleaseNotes('v1.0.0');
    expect(openExternalLinkSpy).toHaveBeenCalledWith(
      'https://github.com/setchy/atlassify/releases/tag/v1.0.0',
    );
  });

  it('openAtlassianSecurityDocs', () => {
    openAtlassianSecurityDocs();
    expect(openExternalLinkSpy).toHaveBeenCalledWith(
      URLs.ATLASSIAN.DOCS.API_TOKEN,
    );
  });

  it('openAtlassianCreateToken', () => {
    openAtlassianCreateToken();
    expect(openExternalLinkSpy).toHaveBeenCalledWith(
      URLs.ATLASSIAN.WEB.SECURITY_TOKENS,
    );
  });

  it('openMyNotifications', () => {
    openMyNotifications();
    expect(openExternalLinkSpy).toHaveBeenCalledWith(
      URLs.ATLASSIAN.WEB.MY_NOTIFICATIONS,
    );
  });

  it('openMyPullRequests', () => {
    openMyPullRequests();
    expect(openExternalLinkSpy).toHaveBeenCalledWith('https://bitbucket.org/');
  });

  it('openAccountProfile', () => {
    openAccountProfile(mockAtlassianCloudAccount);
    expect(openExternalLinkSpy).toHaveBeenCalledWith(
      'https://team.atlassian.com/people/123456789',
    );
  });

  describe('openNotification', () => {
    it('openNotification should use entity url when available', async () => {
      const mockNotificationUrl = mockSingleAtlassifyNotification.entity.url;
      await openNotification(mockSingleAtlassifyNotification);
      expect(openExternalLinkSpy).toHaveBeenCalledWith(mockNotificationUrl);
    });

    it('openNotification should fallback to notification url when entity url is not available', async () => {
      const mockNotif = mockSingleAtlassifyNotification;
      mockNotif.entity.url = null;
      const mockNotificationUrl = mockNotif.url;

      await openNotification(mockNotif);
      expect(openExternalLinkSpy).toHaveBeenCalledWith(mockNotificationUrl);
    });
  });
});
