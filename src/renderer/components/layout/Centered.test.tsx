import { renderWithAppContext } from '../../__helpers__/test-utils';

import { Centered } from './Centered';

describe('renderer/components/layout/Centered.tsx', () => {
  it('should render itself & its children', () => {
    const tree = renderWithAppContext(<Centered>Test</Centered>);

    expect(tree).toMatchSnapshot();
  });
});
