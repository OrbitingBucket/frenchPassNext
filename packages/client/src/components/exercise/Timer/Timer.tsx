// src/components/exercise/Timer/Timer.tsx
import React from 'react';
import { useTimer } from '../../../contexts/TimerContext';

const Timer: React.FC = () => {
  const { state } = useTimer();
  
  const formatTime = (seconds: number): string => {
    return `Temps restant: ${Math.ceil(seconds)} sec`;
  };

  return (
    <div 
      className={`text-base font-medium px-4 py-2 rounded-lg 
        ${state.isExpired ? 'bg-red-100' : 'bg-transparent'}`}
    >
      {formatTime(state.timeRemaining)}
    </div>
  );
};

export default Timer;