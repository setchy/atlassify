import { render } from '@testing-library/react';
import { Size } from '../../types';
import { type IPlatformIcon, PlatformIcon } from './PlatformIcon';

describe('components/icons/PlatformIcon.tsx', () => {
  it('should render Atlassian Cloud icon', () => {
    const props: IPlatformIcon = {
      type: 'Atlassian Cloud',
      size: Size.MEDIUM,
    };
    const tree = render(<PlatformIcon {...props} />);
    expect(tree).toMatchSnapshot();
  });
});
