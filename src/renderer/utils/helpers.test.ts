import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import ChevronLeftIcon from '@atlaskit/icon/core/chevron-left';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';

import { mockSingleAtlassifyNotification } from '../__mocks__/notifications-mocks';

import {
  blockAlignmentByLength,
  getChevronDetails,
  isCompassScorecardNotification,
} from './helpers';
import { PRODUCTS } from './products';

describe('renderer/utils/helpers.ts', () => {
  describe('getChevronDetails', () => {
    it('should return correct chevron details', () => {
      expect(getChevronDetails(true, true, 'account')).toEqual({
        icon: ChevronDownIcon,
        label: 'Hide account notifications',
      });

      expect(getChevronDetails(true, false, 'account')).toEqual({
        icon: ChevronRightIcon,
        label: 'Show account notifications',
      });

      expect(getChevronDetails(false, false, 'product')).toEqual({
        icon: ChevronLeftIcon,
        label: 'No notifications for product',
      });
    });
  });

  it('blockAlignmentByLength', () => {
    expect(blockAlignmentByLength(null)).toEqual('center');

    expect(blockAlignmentByLength('Some short string')).toEqual('center');

    expect(
      blockAlignmentByLength(
        'Some much longer string that should trigger a different format',
      ),
    ).toEqual('start');
  });

  describe('isCompassScorecardNotification', () => {
    it('should return true for compass scorecard notifications', () => {
      const mockNotification = {
        ...mockSingleAtlassifyNotification,
        product: PRODUCTS.compass,
        message: 'some-project improved a scorecard',
      };

      expect(isCompassScorecardNotification(mockNotification)).toBe(true);
    });

    it('should return false for non-compass notifications', () => {
      const mockNotification = {
        ...mockSingleAtlassifyNotification,
        product: PRODUCTS.confluence,
        message: 'This is a scorecard wiki',
      };

      expect(isCompassScorecardNotification(mockNotification)).toBe(false);
    });
  });
});
