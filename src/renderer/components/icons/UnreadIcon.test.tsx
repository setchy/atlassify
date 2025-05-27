import { render } from '@testing-library/react';

import { LogoIcon } from './LogoIcon';
import { UnreadIcon } from './UnreadIcon';

describe('renderer/components/icons/UnreadIcon.tsx', () => {
  it('renders correctly - default size and color', () => {
    const tree = render(<UnreadIcon />);

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly - brand  color', () => {
    const tree = render(<UnreadIcon color="brand" />);

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly - custom size', () => {
    const tree = render(<LogoIcon width={32} height={32} />);

    expect(tree).toMatchSnapshot();
  });
});
