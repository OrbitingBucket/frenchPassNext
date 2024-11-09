// client/src/components/Layout.tsx
import React from 'react';
import NavBar from '../navigation/NavBar';
import ProgressBar from '../exercise/ProgressBar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden pt-4">
      <NavBar />
      <div className="w-full max-w-screen-md mx-auto px-4 my-4">
        <ProgressBar progress={50} />
      </div>
      <main className="flex-grow w-full max-w-screen-md mx-auto px-4 py-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;