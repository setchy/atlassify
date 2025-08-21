import type { FC, ReactNode } from 'react';

interface IContents {
  children: ReactNode;
}

/**
 * Contents component holds the main content of a page.
 * It provides proper padding and handles scrolling.
 */
export const Contents: FC<IContents> = (props: IContents) => {
  return <div className="grow overflow-x-auto">{props.children}</div>;
};
