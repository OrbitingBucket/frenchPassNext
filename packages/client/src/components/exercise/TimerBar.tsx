// src/components/exercise/TimerBar.tsx
import React from 'react';

interface TimerBarProps {
  progress: number;
  isTimeUp: boolean;
}

const TimerBar: React.FC<TimerBarProps> = ({ progress, isTimeUp }) => {
  return (
    <div 
      className={`w-full ${isTimeUp ? 'bg-red-200' : 'bg-gray-200'} rounded-full h-2 overflow-hidden transition-colors duration-300`}
    >
      <div
        className="h-full bg-blue-500 transition-all duration-300 ease-linear"
        style={{ 
          width: `${progress}%`,
          transition: 'width 0.3s linear'
        }}
      />
    </div>
  );
};

export default TimerBar;