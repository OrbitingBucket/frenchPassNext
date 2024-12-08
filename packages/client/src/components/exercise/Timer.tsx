// src/components/exercise/Timer.tsx
import React, { useEffect, useState, useCallback, useRef } from 'react';
import TimerBar from './TimerBar';

interface TimerProps {
  timeLimit: number;
  onTimeUp: () => void;
  isActive: boolean;
}

const Timer: React.FC<TimerProps> = ({ timeLimit, onTimeUp, isActive }) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const timerRef = useRef<number | null>(null);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    console.log('[Timer] Resetting timer with new time limit:', timeLimit);
    setTimeLeft(timeLimit);
    setIsTimeUp(false);
  }, [timeLimit]);

  const handleTimeUp = useCallback(() => {
    if (!isTimeUp) {
      setIsTimeUp(true);
      if (onTimeUp) {
        onTimeUp();
      }
    }
  }, [onTimeUp, isTimeUp]);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;

    const updateTimer = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;
      const newTimeLeft = Math.max(0, timeLimit - elapsed);

      setTimeLeft(newTimeLeft);

      if (newTimeLeft <= 0) {
        handleTimeUp();
      } else if (isActive) {
        animationFrameId = requestAnimationFrame(updateTimer);
      }
    };

    if (isActive && timeLeft > 0) {
      animationFrameId = requestAnimationFrame(updateTimer);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isActive, timeLimit, handleTimeUp]);

  const progress = Math.max(0, (timeLeft / timeLimit) * 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-medium text-gray-600">Time Remaining</h2>
        <div className="text-lg font-semibold">
          {formatTime(Math.ceil(timeLeft))}
        </div>
      </div>
      <TimerBar progress={progress} isTimeUp={timeLeft <= 0} />
    </div>
  );
};

export default Timer;