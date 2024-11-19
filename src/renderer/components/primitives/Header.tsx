import { type FC, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { IconButton } from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import { Box, Inline } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

import { AppContext } from '../../context/App';

interface IHeader {
  children: string;
  fetchOnBack?: boolean;
}

export const Header: FC<IHeader> = (props: IHeader) => {
  const navigate = useNavigate();

  const { fetchNotifications } = useContext(AppContext);

  return (
    <Box
      paddingInlineStart="space.200"
      paddingInlineEnd="space.500"
      paddingBlock="space.200"
    >
      <Inline grow="fill" spread="space-between" alignBlock="center">
        <Tooltip content="Go back" position="right">
          <IconButton
            label="Go Back"
            icon={ArrowLeftIcon}
            appearance="subtle"
            shape="circle"
            onClick={() => {
              navigate(-1);
              if (props.fetchOnBack) {
                fetchNotifications();
              }
            }}
            testId="header-nav-back"
          />
        </Tooltip>

        <Heading size="medium">{props.children}</Heading>
      </Inline>
    </Box>
  );
};
