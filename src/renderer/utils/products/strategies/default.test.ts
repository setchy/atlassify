import {
  mockAtlassifyNotifications,
  mockSingleAtlassifyNotification,
} from '../../../__mocks__/notifications-mocks';

import type { AtlassifyNotification } from '../../../types';

import { defaultStrategy } from './default';

describe('renderer/utils/products/strategies/default', () => {
  it('bodyText returns entity title', () => {
    expect(defaultStrategy.bodyText(mockSingleAtlassifyNotification)).toBe(
      mockSingleAtlassifyNotification.entity.title,
    );
  });

  it('footerText returns path title when path exists', () => {
    const notificationWithPath = mockAtlassifyNotifications[1];
    expect(defaultStrategy.footerText(notificationWithPath)).toBe(
      notificationWithPath.path.title,
    );
  });

  it('footerText returns product display when path is null', () => {
    const notification = {
      ...mockSingleAtlassifyNotification,
      path: null,
    } as AtlassifyNotification;

    expect(defaultStrategy.footerText(notification)).toBe(
      mockSingleAtlassifyNotification.product.display,
    );
  });

  it('avatarAppearance returns circle', () => {
    expect(
      defaultStrategy.avatarAppearance(mockSingleAtlassifyNotification),
    ).toBe('circle');
  });

  describe('isAutomationActor', () => {
    it('isAutomationActor returns false - no display name', () => {
      const mockNotification = {
        ...mockSingleAtlassifyNotification,
        actor: {
          displayName: null,
        },
      } as AtlassifyNotification;

      expect(defaultStrategy.isAutomationActor(mockNotification)).toBe(true);
    });

    it('isAutomationActor returns false - Automation display name prefix', () => {
      const mockNotification = {
        ...mockSingleAtlassifyNotification,
        actor: {
          displayName: 'Automation for Jira',
        },
      } as AtlassifyNotification;

      expect(defaultStrategy.isAutomationActor(mockNotification)).toBe(true);
    });

    it('isAutomationActor returns false', () => {
      expect(
        defaultStrategy.isAutomationActor(mockSingleAtlassifyNotification),
      ).toBe(false);
    });
  });

  it('isRovoActor returns false', () => {
    expect(defaultStrategy.isRovoActor(mockSingleAtlassifyNotification)).toBe(
      false,
    );
  });
});
