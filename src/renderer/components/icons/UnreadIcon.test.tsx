import { render } from '@testing-library/react';

import { UnreadIcon } from './UnreadIcon';

describe('renderer/components/icons/UnreadIcon.tsx', () => {
  it('renders icon - default size and color', () => {
    const tree = render(<UnreadIcon />);

    expect(tree).toMatchSnapshot();
  });

  it('renders icon - custom size', () => {
    const tree = render(<UnreadIcon size={32} />);

    expect(tree).toMatchSnapshot();
  });

  it('renders icon - brand color', () => {
    const tree = render(<UnreadIcon color="brand" />);

    expect(tree).toMatchSnapshot();
  });
});
