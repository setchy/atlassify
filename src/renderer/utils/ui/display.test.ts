import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import ChevronLeftIcon from '@atlaskit/icon/core/chevron-left';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';

import { blockAlignmentByLength, getChevronDetails } from './display';

describe('renderer/utils/ui/display.ts', () => {
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
});
