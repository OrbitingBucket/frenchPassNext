// src/components/exercise/Timer/TimerBar.tsx
import React from 'react';
import { useTimer } from '../../../contexts/TimerContext';

const TimerBar: React.FC = () => {
  const { state } = useTimer();
  const progress = (state.timeRemaining / state.timeLimit) * 100;
  
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`h-full transition-all duration-200 ease-linear rounded-full
          ${state.isExpired ? 'bg-error-500' : 'bg-primary-500'}`}
        style={{ 
          width: `${Math.max(0, progress)}%`,
        }}
      />
    </div>
  );
};

export default TimerBar;
