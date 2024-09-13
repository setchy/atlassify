import { render } from '@testing-library/react';
import { Size } from '../../types';
import { AuthMethodIcon, type IAuthMethodIcon } from './AuthMethodIcon';

describe('components/icons/AuthMethodIcon.tsx', () => {
  it('should render API Token icon', () => {
    const props: IAuthMethodIcon = {
      type: 'API Token',
      size: Size.MEDIUM,
    };
    const tree = render(<AuthMethodIcon {...props} />);
    expect(tree).toMatchSnapshot();
  });
});
