import { describe, expect, it } from 'vitest';

import { notificationsKeys } from './queryKeys';

describe('renderer/utils/queryKeys.ts', () => {
  describe('notificationsKeys', () => {
    it('should return base key for all notifications', () => {
      expect(notificationsKeys.all).toEqual(['notifications']);
    });

    it('should generate list key with parameters', () => {
      const key = notificationsKeys.list(2, true);
      expect(key).toEqual(['notifications', 2, true]);
    });

    it('should generate different keys for different parameters', () => {
      const key1 = notificationsKeys.list(1, false);
      const key2 = notificationsKeys.list(2, true);

      expect(key1).toEqual(['notifications', 1, false]);
      expect(key2).toEqual(['notifications', 2, true]);
      expect(key1).not.toEqual(key2);
    });

    it('should maintain consistent structure', () => {
      const key1 = notificationsKeys.list(2, true);
      const key2 = notificationsKeys.list(2, true);

      // While the arrays are different objects, they have the same values
      expect(key1).toEqual(key2);
    });
  });
});
