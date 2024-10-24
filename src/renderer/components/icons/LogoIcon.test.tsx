import { render } from '@testing-library/react';
import { LogoIcon } from './LogoIcon';

describe('renderer/components/icons/LogoIcon.tsx', () => {
  it('renders correctly - default size', () => {
    const tree = render(<LogoIcon />);

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly - custom size', () => {
    const tree = render(<LogoIcon width={32} height={32} />);

    expect(tree).toMatchSnapshot();
  });
});
