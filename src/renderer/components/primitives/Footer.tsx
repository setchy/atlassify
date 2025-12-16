import type { FC, ReactNode } from 'react';

import { Box, Flex } from '@atlaskit/primitives';

interface FooterProps {
  children: ReactNode;
  justify: 'end' | 'space-between';
}

export const Footer: FC<FooterProps> = (props: FooterProps) => {
  return (
    <Box
      backgroundColor="color.background.accent.gray.subtlest"
      paddingBlock="space.050"
      paddingInline="space.200"
    >
      <Flex justifyContent={props.justify}>{props.children}</Flex>
    </Box>
  );
};
