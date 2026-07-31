import { blockAlignmentByLength, getChevronDetails } from './display';

describe('renderer/utils/ui/display.ts', () => {
  describe('getChevronDetails', () => {
    it('should return correct chevron details', () => {
      expect(getChevronDetails(true, true, 'account')).toEqual({
        icon: 'down',
        label: 'Hide account notifications',
      });

      expect(getChevronDetails(true, false, 'account')).toEqual({
        icon: 'right',
        label: 'Show account notifications',
      });

      expect(getChevronDetails(false, false, 'product')).toEqual({
        icon: 'left',
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
