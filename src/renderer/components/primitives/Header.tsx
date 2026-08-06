import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { IconButton } from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import ArrowLeftIcon from '@atlaskit/icon/core/arrow-left';
import { Box, Inline, Stack } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

import { useAppContext } from '../../hooks/useAppContext';

interface HeaderProps {
  children: string;
  subheading?: string;
  fetchOnBack?: boolean;
}

export const Header: FC<HeaderProps> = (props: HeaderProps) => {
  const navigate = useNavigate();

  const { fetchNotifications } = useAppContext();

  return (
    <Box
      paddingBlock="space.200"
      paddingInlineEnd="space.300"
      paddingInlineStart="space.150"
    >
      <Inline alignBlock="center" grow="fill" spread="space-between">
        <Tooltip content="Go back" position="right">
          <IconButton
            appearance="subtle"
            icon={ArrowLeftIcon}
            label="Go Back"
            onClick={() => {
              navigate(-1);
              if (props.fetchOnBack) {
                fetchNotifications();
              }
            }}
            shape="circle"
            testId="header-nav-back"
          />
        </Tooltip>

        <Stack alignBlock="end" alignInline="end">
          <Heading size="medium">{props.children}</Heading>
          {props.subheading && (
            <Heading size="xxsmall">{props.subheading}</Heading>
          )}
        </Stack>
      </Inline>
    </Box>
  );
};
