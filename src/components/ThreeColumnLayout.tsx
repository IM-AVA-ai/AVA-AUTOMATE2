tsx
import React, { ReactNode } from 'react';

interface ThreeColumnLayoutProps {
  children: ReactNode;
}

export const ThreeColumnLayout: React.FC<ThreeColumnLayoutProps> = ({ children }) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {children}
      </div>
    </div>
  );
};