// packages/client/src/components/layout/Layout.tsx

import React from 'react';
import NavBar from '../navigation/NavBar';
import ProgressBar from '../exercise/ProgressBar';

interface LayoutProps {
  children: React.ReactNode;
  progress: number;
}

const Layout: React.FC<LayoutProps> = ({ children, progress }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto my-4">
          <ProgressBar progress={progress} />
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
