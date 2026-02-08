import { vi } from 'vitest';

import { mockFilterStoreState } from '../../../__helpers__/test-utils';
import {
  mockAccountNotifications,
  mockSingleAtlassifyNotification,
} from '../../../__mocks__/notifications-mocks';

import type { AtlassifyNotification } from '../../../types';

import { PRODUCTS } from '../../products';
import { actorFilter, inferNotificationActor } from '.';

// Mock the useFiltersStore
vi.mock('../../../hooks/useFiltersStore', () => ({
  default: {
    getState: vi.fn(),
  },
}));

import useFiltersStore from '../../../stores/useFiltersStore';

describe('renderer/utils/notifications/filters/actor.ts', () => {
  it('hasActorFilters', () => {
    mockFilterStoreState(useFiltersStore);

    expect(actorFilter.hasFilters()).toBe(false);

    mockFilterStoreState(useFiltersStore, { actors: ['user'] });

    expect(actorFilter.hasFilters()).toBe(true);
  });

  it('isActorFilterSet', () => {
    mockFilterStoreState(useFiltersStore, { actors: ['user'] });

    expect(actorFilter.isFilterSet('user')).toBe(true);

    expect(actorFilter.isFilterSet('automation')).toBe(false);
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
