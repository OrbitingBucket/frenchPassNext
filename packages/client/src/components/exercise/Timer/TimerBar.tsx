// src/components/exercise/Timer/TimerBar.tsx
import React, { useEffect, useRef } from 'react';
import { useTimer } from '../../../contexts/TimerContext';

const TimerBar: React.FC = () => {
  const { state } = useTimer();
  const barRef = useRef<HTMLDivElement>(null);
  const progress = state.timeRemaining / state.timeLimit;

  useEffect(() => {
    if (!barRef.current) return;
    
    // Use transform for better performance
    barRef.current.style.transform = `scaleX(${Math.max(0, progress)})`;
  }, [progress]);

  return (
    <div
      className={`w-full h-2 rounded-full overflow-hidden
        ${state.isExpired ? 'bg-error-500' : 'bg-gray-200'}`}
    >
      <div
        ref={barRef}
        className="h-full bg-primary-500 rounded-full origin-left"
        style={{
          transform: `scaleX(${Math.max(0, progress)})`,
          willChange: 'transform'
        }}
      />
    </div>
  );
};

export default TimerBar;
