import type { ReactNode } from 'react';

interface ContentsProps {
  readonly children: ReactNode;
}

/**
 * Contents component holds the main content of a page.
 * It provides proper padding and handles scrolling.
 */
export function Contents(props: ContentsProps) {
  return (
    <div className="grow overflow-x-hidden overflow-y-auto">
      {props.children}
    </div>
  );
}
