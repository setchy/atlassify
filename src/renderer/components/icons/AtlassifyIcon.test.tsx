import { render } from '@testing-library/react';

import { AtlassifyIcon } from './AtlassifyIcon';

describe('renderer/components/icons/AtlassifyIconBlue.tsx', () => {
  it('renders logo - default size and color', () => {
    const tree = render(<AtlassifyIcon />);

    expect(tree).toMatchSnapshot();
  });

  it('renders logo - custom size', () => {
    const tree = render(<AtlassifyIcon size={48} />);

    expect(tree).toMatchSnapshot();
  });

  it('renders logo - brand color', () => {
    const tree = render(<AtlassifyIcon color="brand" />);

    expect(tree).toMatchSnapshot();
  });
});
