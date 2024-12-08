// src/components/layout/Layout.tsx
import React from 'react';
import NavBar from '../navigation/NavBar';
import Timer from '../exercise/Timer';

interface LayoutProps {
  children: React.ReactNode;
  timeLimit: number;
  isActive: boolean;
  onTimeUp: () => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  timeLimit,
  isActive,
  onTimeUp
}) => {
  console.log('[Layout] Rendering with:', {
    timeLimit,
    isActive
  });

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 bg-white ">
        <div className="max-w-3xl mx-auto">
          <Timer
            timeLimit={timeLimit}
            onTimeUp={onTimeUp}
            isActive={isActive}
          />
        </div>
      </div>

      <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-3xl mx-auto rounded-lg p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;