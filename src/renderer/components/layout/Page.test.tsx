import { render } from '@testing-library/react';
import { Page } from '../layout/Page';

describe('renderer/components/layout/Page.tsx', () => {
  it('should render itself & its children', () => {
    const tree = render(<Page id="test">Test</Page>);

    expect(tree).toMatchSnapshot();
  });
});
