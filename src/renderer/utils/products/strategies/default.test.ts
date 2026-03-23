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

  describe('actorType', () => {

    it('actorType infers automation actor', () => {
      const automationNotification = {
        ...mockSingleAtlassifyNotification,
        actor: {
          displayName: 'Automation for Jira',
        },
      } as AtlassifyNotification;

      expect(defaultStrategy.actorType(automationNotification)).toBe('automation');
    });

    it('actorType infers user actor', () => {
      const userNotification = {
        ...mockSingleAtlassifyNotification,
        actor: {
          displayName: 'John Doe',
        },
      } as AtlassifyNotification;

      expect(defaultStrategy.actorType(userNotification)).toBe('user');
    });

    it('actorType infers automation actor when displayName is missing', () => {
      const noDisplayNameNotification = {
        ...mockSingleAtlassifyNotification,
        actor: {
          displayName: '',
        },
      } as AtlassifyNotification;

      expect(defaultStrategy.actorType(noDisplayNameNotification)).toBe(
        'automation',
      );
    });
  });

  describe('engagementState', () => {
    it('returns mention when message includes "mentioned"', () => {
      const notification = {
        ...mockSingleAtlassifyNotification,
        message: 'someone mentioned you on a page',
      } as AtlassifyNotification;

      expect(defaultStrategy.engagementState(notification)).toBe('mention');
    });

    it('returns comment when message includes "replied"', () => {
      const notification = {
        ...mockSingleAtlassifyNotification,
        message: 'someone replied on a page',
      } as AtlassifyNotification;

      expect(defaultStrategy.engagementState(notification)).toBe('comment');
    });

    it('returns reaction when message matches reaction regex', () => {
      const notification = {
        ...mockSingleAtlassifyNotification,
        message: 'someone reacted with 🍻 to your comment',
      } as AtlassifyNotification;

      expect(defaultStrategy.engagementState(notification)).toBe('reaction');
    });

    it('returns other when message does not match any engagement state', () => {
      const notification = {
        ...mockSingleAtlassifyNotification,
        message: 'John assigned you to a task',
      } as AtlassifyNotification;

      expect(defaultStrategy.engagementState(notification)).toBe('other');
    })
  });
});
