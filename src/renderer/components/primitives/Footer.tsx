import type { FC, ReactNode } from 'react';

import { xcss } from '@atlaskit/primitives';
import { Box, Flex } from '@atlaskit/primitives/compiled';

interface FooterProps {
  children: ReactNode;
  justify: 'end' | 'space-between';
}

export const Footer: FC<FooterProps> = (props: FooterProps) => {
  const footerBoxStyles = xcss({
    backgroundColor: 'color.background.accent.gray.subtlest',
  });

  return (
    <Box
      paddingBlock="space.050"
      paddingInline="space.200"
      xcss={footerBoxStyles}
    >
      <Flex justifyContent={props.justify}>{props.children}</Flex>
    </Box>
  );
};
