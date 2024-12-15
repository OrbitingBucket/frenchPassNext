// src/components/layout/Layout.tsx
import React from 'react';
import NavBar from '../navigation/NavBar';
import { Timer, TimerBar } from '../exercise/Timer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 bg-white">
        <div className="max-w-3xl mx-auto space-y-2">
          <Timer />
          <TimerBar />
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
