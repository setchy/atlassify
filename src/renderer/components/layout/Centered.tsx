import type { ReactNode } from 'react';

interface CenteredProps {
  children: ReactNode;
}

export function Centered(props: CenteredProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-screen">
      {props.children}
    </div>
  );
}
