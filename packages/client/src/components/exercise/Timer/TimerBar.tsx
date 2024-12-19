// src/components/exercise/Timer/TimerBar.tsx
import React, { useEffect, useRef } from 'react';
import { useTimer } from '../../../contexts/TimerContext';

const TimerBar: React.FC = () => {
  const { state } = useTimer();
  const progressRef = useRef<HTMLDivElement>(null);
  const progress = state.timeRemaining / state.timeLimit;

  useEffect(() => {
    if (!progressRef.current) return;
    progressRef.current.style.transform = `scaleX(${Math.max(0, progress)})`;
  }, [progress]);

  return (
    <div className={`w-full h-2 rounded-full overflow-hidden transition-colors duration-300 ${state.isExpired ? 'bg-error-500' : 'bg-neutral-200'}`}>
      <div
        ref={progressRef}
        className={`h-full rounded-full origin-left transform transition-transform
          ${state.isExpired ? 'bg-error-500' : 'bg-primary-500'}`}
        style={{ 
          transform: `scaleX(${Math.max(0, progress)})`,
          transition: 'transform 0.1s linear'
        }}
      />
    </div>
  );
};

export default TimerBar;
