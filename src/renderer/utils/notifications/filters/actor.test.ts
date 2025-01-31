import {
  mockAccountNotifications,
  mockSingleAtlassifyNotification,
} from '../../../__mocks__/notifications-mocks';
import { defaultSettings } from '../../../context/App';
import type { AtlassifyNotification, SettingsState } from '../../../types';
import {
  filterNotificationByActor,
  getActorFilterCount,
  hasActorFilters,
  inferNotificationActor,
  isActorFilterSet,
} from './actor';

describe('renderer/utils/notifications/filters/actor.ts', () => {
  it('hasActorFilters', () => {
    expect(hasActorFilters(defaultSettings)).toBe(false);

    expect(
      hasActorFilters({
        ...defaultSettings,
        filterActors: ['user'],
      } as SettingsState),
    ).toBe(true);
  });

  it('isActorFilterSet', () => {
    const settings = {
      ...defaultSettings,
      filterActors: ['user'],
    } as SettingsState;

    expect(isActorFilterSet(settings, 'user')).toBe(true);

    expect(isActorFilterSet(settings, 'automation')).toBe(false);
  });

  it('getActorFilterCount', () => {
    const mockAcctNotifications = mockAccountNotifications;
    mockAccountNotifications[0].notifications[0].actor.displayName =
      'Automation for Jira';

    expect(getActorFilterCount(mockAcctNotifications, 'user')).toBe(1);

    expect(getActorFilterCount(mockAcctNotifications, 'automation')).toBe(1);
  });

  it('filterNotificationByActor', () => {
    const mockNotification = {
      ...mockSingleAtlassifyNotification,
      actor: {
        displayName: 'Automation for Jira',
      },
    } as AtlassifyNotification;

    expect(filterNotificationByActor(mockNotification, 'user')).toBe(false);

    expect(filterNotificationByActor(mockNotification, 'automation')).toBe(
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

    it('should infer automation actor', () => {
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
