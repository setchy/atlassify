import {
  mockAccountNotifications,
  mockSingleAtlassifyNotification,
} from '../../../__mocks__/notifications-mocks';

import { defaultSettings } from '../../../context/defaults';

import type { AtlassifyNotification, SettingsState } from '../../../types';

import { PRODUCTS } from '../../products';
import { actorFilter, inferNotificationActor } from '.';

describe('renderer/utils/notifications/filters/actor.ts', () => {
  it('hasActorFilters', () => {
    expect(actorFilter.hasFilters(defaultSettings)).toBe(false);

    expect(
      actorFilter.hasFilters({
        ...defaultSettings,
        filterActors: ['user'],
      } as SettingsState),
    ).toBe(true);
  });

  it('isActorFilterSet', () => {
    const settings: SettingsState = {
      ...defaultSettings,
      filterActors: ['user'],
    };

    expect(actorFilter.isFilterSet(settings, 'user')).toBe(true);

    expect(actorFilter.isFilterSet(settings, 'automation')).toBe(false);
  });

  it('getActorFilterCount', () => {
    const mockAcctNotifications = mockAccountNotifications;
    mockAccountNotifications[0].notifications[0].actor.displayName =
      'Automation for Jira';

    expect(actorFilter.getFilterCount(mockAcctNotifications, 'user')).toBe(1);

    expect(
      actorFilter.getFilterCount(mockAcctNotifications, 'automation'),
    ).toBe(1);
  });

  it('filterNotificationByActor', () => {
    const mockNotification = {
      ...mockSingleAtlassifyNotification,
      actor: {
        displayName: 'Automation for Jira',
      },
    } as AtlassifyNotification;

    expect(actorFilter.filterNotification(mockNotification, 'user')).toBe(
      false,
    );

    expect(actorFilter.filterNotification(mockNotification, 'automation')).toBe(
      true,
    );
  });

  describe('inferNotificationActor', () => {
    it('should infer user actor', () => {
      const mockNotification = {
        ...mockSingleAtlassifyNotification,
        actor: {
          displayName: 'Atlassify',
        },
      } as AtlassifyNotification;

      expect(inferNotificationActor(mockNotification)).toBe('user');
    });

    it('should infer automation actor when displayName is null', () => {
      const mockNotification = {
        ...mockSingleAtlassifyNotification,
        actor: {
          displayName: null,
        },
      } as AtlassifyNotification;

      expect(inferNotificationActor(mockNotification)).toBe('automation');
    });

    it('should infer automation actor from compass scorecard', () => {
      const mockNotification = {
        ...mockSingleAtlassifyNotification,
        product: PRODUCTS.compass,
        message: 'some-component is failing a scorecard',
      } as AtlassifyNotification;

      expect(inferNotificationActor(mockNotification)).toBe('automation');
    });

    it('should infer automation actor from rovo dev', () => {
      const mockNotification = {
        ...mockSingleAtlassifyNotification,
        product: PRODUCTS.rovo_dev,
        message: 'AI generated code is ready',
      } as AtlassifyNotification;

      expect(inferNotificationActor(mockNotification)).toBe('automation');
    });

    it('should infer automation actor from displayName', () => {
      const mockNotification = {
        ...mockSingleAtlassifyNotification,
        actor: {
          displayName: 'Automation for Jira',
        },
      } as AtlassifyNotification;

      expect(inferNotificationActor(mockNotification)).toBe('automation');
    });
  });
});
