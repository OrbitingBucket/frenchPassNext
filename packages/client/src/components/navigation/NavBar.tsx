// client/components/navigation/NavBar.tsx
import React from 'react';

const NavBar: React.FC = () => {
  return (
    <nav className="w-full px-4 pt-4 pb-4">
      <div className="max-w-screen-md mx-auto flex justify-between items-center">
        {/* Left Chevron Icon */}
        <button aria-label="Back" className="text-gray-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>


        {/* Menu Icon */}
        <button aria-label="Menu" className="text-gray-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default NavBar;