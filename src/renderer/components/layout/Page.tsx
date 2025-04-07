import type { FC, ReactNode } from 'react';

interface IPage {
  children: ReactNode;
  id: string;
}

/**
 * Page component represents a single page view.
 * It creates a column layout for header, content, and footer.
 * The height is 100% to fill the parent container.
 */
export const Page: FC<IPage> = (props: IPage) => {
  return (
    <div className="flex h-screen flex-col" data-testid={props.id}>
      {props.children}
    </div>
  );
};
