import { mockAtlassianCloudAccount } from '../../__mocks__/account-mocks';
import {
  mockSingleAtlassifyNotification,
  mockSystemAtlassifyNotification,
} from '../../__mocks__/notifications-mocks';

import * as comms from './comms';
import {
  openAccountProfile,
  openAtlassianCreateToken,
  openAtlassianSecurityDocs,
  openAtlassifyReleaseNotes,
  openMyNotifications,
  openMyPullRequests,
  openNotification,
  resolveNotificationUrl,
  URLs,
} from './links';

describe('renderer/utils/system/links.ts', () => {
  const openExternalLinkSpy = vi
    .spyOn(comms, 'openExternalLink')
    .mockImplementation(vi.fn());

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
      'https://home.atlassian.com/people/123456789',
    );
  });

  describe('resolveNotificationUrl', () => {
    it('uses entity url when available', () => {
      expect(resolveNotificationUrl(mockSingleAtlassifyNotification)).toBe(
        mockSingleAtlassifyNotification.entity.url,
      );
    });

    it('falls back to content url when entity is absent', () => {
      expect(resolveNotificationUrl(mockSystemAtlassifyNotification)).toBe(
        mockSystemAtlassifyNotification.url,
      );
    });

    it('falls back to my-notifications when neither entity url nor content url is available', () => {
      const notification = {
        ...mockSystemAtlassifyNotification,
        url: null,
      };

      expect(resolveNotificationUrl(notification)).toBe(
        URLs.ATLASSIAN.WEB.MY_NOTIFICATIONS,
      );
    });
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

    it('openNotification should fallback to my notifications when both entity url and notification url are not available', async () => {
      const mockNotif = { ...mockSingleAtlassifyNotification };
      mockNotif.entity = { ...mockNotif.entity, url: null };
      mockNotif.url = null;

      await openNotification(mockNotif);

      expect(openExternalLinkSpy).toHaveBeenCalledWith(
        URLs.ATLASSIAN.WEB.MY_NOTIFICATIONS,
      );
    });
  });
});
