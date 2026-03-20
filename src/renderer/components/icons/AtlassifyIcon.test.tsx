import { renderWithProviders } from '../../__helpers__/test-utils';

import { AtlassifyIcon } from './AtlassifyIcon';

describe('renderer/components/icons/AtlassifyIconBlue.tsx', () => {
  it('renders logo - default size and color', () => {
    const tree = renderWithProviders(<AtlassifyIcon />);

    expect(tree.container).toMatchSnapshot();
  });

  it('renders logo - custom size', () => {
    const tree = renderWithProviders(<AtlassifyIcon size={48} />);

    expect(tree.container).toMatchSnapshot();
  });

  it('renders logo - brand color', () => {
    const tree = renderWithProviders(<AtlassifyIcon color="brand" />);

    expect(tree.container).toMatchSnapshot();
  });
});
