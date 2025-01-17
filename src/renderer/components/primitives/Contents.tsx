import type { FC, ReactNode } from 'react';

interface IContents {
  children: ReactNode;
}

export const Contents: FC<IContents> = (props: IContents) => {
  return <div className="flex-grow overflow-x-auto">{props.children}</div>;
};
