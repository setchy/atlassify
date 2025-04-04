import type { FC, ReactNode } from 'react';

import { Sidebar } from '../Sidebar';

interface IAppLayout {
  children: ReactNode;
}

/**
 * AppLayout is the main container for the application.
 * It handles the basic layout with sidebar and content area.
 */
export const AppLayout: FC<IAppLayout> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      {/* Fixed-width sidebar */}
      <div className="w-sidebar flex-shrink-0">
        <Sidebar />
      </div>
      {/* Content area with left padding to make space for the sidebar */}
      <div className="flex-1">{children}</div>
    </div>
  );
};
