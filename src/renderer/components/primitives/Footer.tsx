import type { FC, ReactNode } from 'react';

import { cssMap } from '@atlaskit/css';
import { Box, Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

interface FooterProps {
  children: ReactNode;
  justify: 'end' | 'space-between';
}

const styles = cssMap({
  root: {
    backgroundColor: token('color.background.accent.gray.subtlest'),
    paddingBlock: token('space.050'),
    paddingInline: token('space.200'),
  },
});

export const Footer: FC<FooterProps> = (props: FooterProps) => {
  return (
    <Box xcss={styles.root}>
      <Flex justifyContent={props.justify}>{props.children}</Flex>
    </Box>
  );
};
