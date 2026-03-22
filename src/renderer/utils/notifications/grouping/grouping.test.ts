import { cycleGroupBy, GROUP_BY_OPTIONS, GROUPING_CONFIGS } from './grouping';

describe('renderer/utils/notifications/grouping/grouping.ts', () => {
  describe('GROUP_BY_OPTIONS', () => {
    it('should contain all grouping types except none', () => {
      expect(GROUP_BY_OPTIONS).toContain('product');
      expect(GROUP_BY_OPTIONS).toContain('actor');
      expect(GROUP_BY_OPTIONS).toContain('engagement');
      expect(GROUP_BY_OPTIONS).toContain('category');
      expect(GROUP_BY_OPTIONS).not.toContain('none');
    });

    it('should have 4 grouping options', () => {
      expect(GROUP_BY_OPTIONS).toHaveLength(4);
    });
  });

  describe('GROUPING_CONFIGS', () => {
    it('should have configs for all GROUP_BY_OPTIONS', () => {
      for (const groupByType of GROUP_BY_OPTIONS) {
        expect(GROUPING_CONFIGS[groupByType]).toBeDefined();
        expect(GROUPING_CONFIGS[groupByType].groupByType).toBe(groupByType);
      }
    });

    it('should have getGroupKey function for each config', () => {
      for (const groupByType of GROUP_BY_OPTIONS) {
        const config = GROUPING_CONFIGS[groupByType];
        expect(typeof config.getGroupKey).toBe('function');
      }
    });

    it('should have getDetails function for each config', () => {
      for (const groupByType of GROUP_BY_OPTIONS) {
        const config = GROUPING_CONFIGS[groupByType];
        expect(typeof config.getDetails).toBe('function');
      }
    });

    it('product config should return product filter details', () => {
      const config = GROUPING_CONFIGS.product;
      const details = config.getDetails('jira_software');
      expect(details).toBeDefined();
      expect(details.name).toBeDefined();
    });

    it('actor config should return actor filter details', () => {
      const config = GROUPING_CONFIGS.actor;
      const details = config.getDetails('user');
      expect(details).toBeDefined();
      expect(details.name).toBeDefined();
    });

    it('engagement config should return engagement filter details', () => {
      const config = GROUPING_CONFIGS.engagement;
      const details = config.getDetails('mention');
      expect(details).toBeDefined();
      expect(details.name).toBeDefined();
    });

    it('category config should return category filter details', () => {
      const config = GROUPING_CONFIGS.category;
      const details = config.getDetails('direct');
      expect(details).toBeDefined();
      expect(details.name).toBeDefined();
    });
  });

  describe('cycleGroupBy', () => {
    it('should cycle from none to product', () => {
      expect(cycleGroupBy('none')).toBe('product');
    });

    it('should cycle from product to actor', () => {
      expect(cycleGroupBy('product')).toBe('actor');
    });

    it('should cycle from actor to engagement', () => {
      expect(cycleGroupBy('actor')).toBe('engagement');
    });

    it('should cycle from engagement to category', () => {
      expect(cycleGroupBy('engagement')).toBe('category');
    });

    it('should cycle from category back to none', () => {
      expect(cycleGroupBy('category')).toBe('none');
    });

    it('should cycle in order for all valid inputs', () => {
      const order: Array<
        'none' | 'product' | 'actor' | 'engagement' | 'category'
      > = ['none', 'product', 'actor', 'engagement', 'category'];

      for (let i = 0; i < order.length; i++) {
        const current = order[i];
        const next = order[(i + 1) % order.length];
        expect(cycleGroupBy(current)).toBe(next);
      }
    });
  });
});
