import type { FC, ReactNode } from 'react';

interface ContentsProps {
  children: ReactNode;
}

/**
 * Contents component holds the main content of a page.
 * It provides proper padding and handles scrolling.
 */
export const Contents: FC<ContentsProps> = (props: ContentsProps) => {
  return (
    <div className="grow overflow-x-hidden overflow-y-auto">
      {props.children}
    </div>
  );
};
