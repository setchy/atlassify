import { mockSettings } from '../../__mocks__/state-mocks';
import { mockAtlassifyNotification } from '../api/__mocks__/response-mocks';
import { filterNotifications } from './filters';

describe('utils/notifications/filters.ts', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('filterNotifications', () => {
    it('should filter notifications by read state when provided', async () => {
      mockAtlassifyNotification[0].readState = 'read';
      mockAtlassifyNotification[1].readState = 'unread';
      const result = filterNotifications(mockAtlassifyNotification, {
        ...mockSettings,
        filterReadStates: ['unread'],
      });

      expect(mockAtlassifyNotification.length).toBe(2);
      expect(result.length).toBe(1);
      expect(result).toEqual([mockAtlassifyNotification[1]]);
    });

    it('should filter notifications by category when provided', async () => {
      mockAtlassifyNotification[0].category = 'watching';
      mockAtlassifyNotification[1].category = 'direct';
      const result = filterNotifications(mockAtlassifyNotification, {
        ...mockSettings,
        filterCategories: ['direct'],
      });

      expect(mockAtlassifyNotification.length).toBe(2);
      expect(result.length).toBe(1);
      expect(result).toEqual([mockAtlassifyNotification[1]]);
    });

    it('should filter notifications by product when provided', async () => {
      mockAtlassifyNotification[0].product.name = 'bitbucket';
      mockAtlassifyNotification[1].product.name = 'compass';
      const result = filterNotifications(mockAtlassifyNotification, {
        ...mockSettings,
        filterProducts: ['compass'],
      });

      expect(mockAtlassifyNotification.length).toBe(2);
      expect(result.length).toBe(1);
      expect(result).toEqual([mockAtlassifyNotification[1]]);
    });
  });
});
