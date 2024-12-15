// src/components/exercise/Timer/Timer.tsx
import React from 'react';
import { useTimer } from '../../../contexts/TimerContext';

const Timer: React.FC = () => {
  const { state } = useTimer();
  
  const formatTime = (seconds: number): string => {
    const roundedSeconds = Math.ceil(seconds);
    const minutes = Math.floor(roundedSeconds / 60);
    const remainingSeconds = roundedSeconds % 60;
    
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${remainingSeconds}s`;
  };

  return (
    <div 
      className="text-base font-medium px-4 py-2 rounded-lg text-gray-700"
    >
      Temps restant: {formatTime(state.timeRemaining)}
    </div>
  );
};

export default Timer;
