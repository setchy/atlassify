import { render } from '@testing-library/react';

import { Centered } from './Centered';

describe('renderer/components/layout/Centered.tsx', () => {
  it('should render itself & its children', () => {
    const tree = render(<Centered>Test</Centered>);

    expect(tree).toMatchSnapshot();
  });
});
