import type { FC, ReactNode } from 'react';

import { Box, Flex } from '@atlaskit/primitives';

interface IFooter {
  children: ReactNode;
  justify: 'end' | 'space-between';
}

export const Footer: FC<IFooter> = (props: IFooter) => {
  return (
    <Box
      paddingBlock="space.050"
      paddingInline="space.200"
      backgroundColor="color.background.accent.gray.subtlest"
    >
      <Flex justifyContent={props.justify}>{props.children}</Flex>
    </Box>
  );
};
