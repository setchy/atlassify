import { mockAtlassifyNotifications } from '../../../__mocks__/notifications-mocks';

import { useFiltersStore } from '../../../stores';

import { filterNotifications } from '.';

describe('renderer/utils/notifications/filter.ts', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('filterNotifications', () => {
    it('should filter notifications by engagement state when provided', async () => {
      mockAtlassifyNotifications[0].message = 'Some message';
      mockAtlassifyNotifications[1].message = 'someone mentioned you on a page';

      useFiltersStore.setState({ engagementStates: ['mention'] });

      const result = filterNotifications(mockAtlassifyNotifications);

      expect(mockAtlassifyNotifications.length).toBe(2);
      expect(result.length).toBe(1);
      expect(result).toEqual([mockAtlassifyNotifications[1]]);
    });

    it('should filter notifications by category when provided', async () => {
      mockAtlassifyNotifications[0].category = 'watching';
      mockAtlassifyNotifications[1].category = 'direct';

      useFiltersStore.setState({ categories: ['direct'] });

      const result = filterNotifications(mockAtlassifyNotifications);

      expect(mockAtlassifyNotifications.length).toBe(2);
      expect(result.length).toBe(1);
      expect(result).toEqual([mockAtlassifyNotifications[1]]);
    });

    it('should filter notifications by actor when provided', async () => {
      mockAtlassifyNotifications[0].actor.displayName = 'Some user';
      mockAtlassifyNotifications[1].actor.displayName = 'Automation for Jira';

      useFiltersStore.setState({ actors: ['user'] });

      const result = filterNotifications(mockAtlassifyNotifications);

      expect(mockAtlassifyNotifications.length).toBe(2);
      expect(result.length).toBe(1);
      expect(result).toEqual([mockAtlassifyNotifications[0]]);
    });

    it('should filter notifications by read state when provided', async () => {
      mockAtlassifyNotifications[0].readState = 'read';
      mockAtlassifyNotifications[1].readState = 'unread';

      useFiltersStore.setState({ readStates: ['unread'] });

      const result = filterNotifications(mockAtlassifyNotifications);

      expect(mockAtlassifyNotifications.length).toBe(2);
      expect(result.length).toBe(1);
      expect(result).toEqual([mockAtlassifyNotifications[1]]);
    });

    it('should filter notifications by product when provided', async () => {
      mockAtlassifyNotifications[0].product.type = 'bitbucket';
      mockAtlassifyNotifications[1].product.type = 'compass';

      useFiltersStore.setState({ products: ['compass'] });

      const result = filterNotifications(mockAtlassifyNotifications);

      expect(mockAtlassifyNotifications.length).toBe(2);
      expect(result.length).toBe(1);
      expect(result).toEqual([mockAtlassifyNotifications[1]]);
    });

    it('should do nothing if no filters set', async () => {
      const result = filterNotifications(mockAtlassifyNotifications);

      expect(mockAtlassifyNotifications.length).toBe(2);
      expect(result.length).toBe(2);
    });
  });
});
