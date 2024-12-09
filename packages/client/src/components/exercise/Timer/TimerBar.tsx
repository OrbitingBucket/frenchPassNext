// src/components/exercise/Timer/TimerBar.tsx
import React from 'react';
import { useTimer } from '../../../contexts/TimerContext';

const TimerBar: React.FC = () => {
  const { state } = useTimer();
  const progress = (state.timeRemaining / state.timeLimit) * 100;
  
  return (
    <div 
      className={`w-full h-2 rounded-full ${state.isExpired ? 'bg-red-200' : 'bg-gray-200'}`}
    >
      <div
        className="h-full bg-blue-200 rounded-full transition-all"
        style={{ 
          width: `${state.isExpired ? 0 : progress}%`,
          transition: 'width 0.1s linear'
        }}
      />
    </div>
  );
};

export default TimerBar;