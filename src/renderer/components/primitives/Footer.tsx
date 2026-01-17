import type { FC, ReactNode } from 'react';

import { cssMap, cx } from '@atlaskit/css';
import { Box, Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

interface FooterProps {
  children: ReactNode;
  justify: 'end' | 'space-between';
}

export const Footer: FC<FooterProps> = (props: FooterProps) => {
  const styles = cssMap({
    footerBox: {
      backgroundColor: token('color.background.accent.gray.subtlest'),
    },
  });

  return (
    <Box
      paddingBlock="space.050"
      paddingInline="space.200"
      xcss={cx(styles.footerBox)}
    >
      <Flex justifyContent={props.justify}>{props.children}</Flex>
    </Box>
  );
};
