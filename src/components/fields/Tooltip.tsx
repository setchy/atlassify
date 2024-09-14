import type { FC, ReactNode } from 'react';

import InlineMessage from '@atlaskit/inline-message';

export interface ITooltip {
  name: string;
  tooltip: ReactNode | string;
}

export const Tooltip: FC<ITooltip> = (props: ITooltip) => {
  return (
    <InlineMessage appearance="info" iconLabel={props.name}>
      <div className="w-60 text-xs">{props.tooltip}</div>
    </InlineMessage>
  );
};
