// src/contexts/TimerContext.tsx
import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';

interface TimerState {
  timeLimit: number;
  timeRemaining: number;
  isRunning: boolean;
  isExpired: boolean;
}

type TimerAction =
  | { type: 'START'; payload: number }
  | { type: 'STOP' }
  | { type: 'RESET' }
  | { type: 'UPDATE_TIME'; payload: number }
  | { type: 'EXPIRE' };

interface TimerContextValue {
  state: TimerState;
  startTimer: (timeLimit: number) => void;
  stopTimer: () => void;
  resetTimer: () => void;
}

const initialState: TimerState = {
  timeLimit: 0,
  timeRemaining: 0,
  isRunning: false,
  isExpired: false,
};

const timerReducer = (state: TimerState, action: TimerAction): TimerState => {
  let newTimeRemaining: number;
  let isExpired: boolean;

  switch (action.type) {
    case 'START':
      return {
        ...state,
        timeLimit: action.payload,
        timeRemaining: action.payload,
        isRunning: true,
        isExpired: false,
      };
    case 'STOP':
      return {
        ...state,
        isRunning: false,
      };
    case 'RESET':
      return initialState;
    case 'UPDATE_TIME':
      newTimeRemaining = Math.max(0, action.payload);
      isExpired = newTimeRemaining === 0;
      return {
        ...state,
        timeRemaining: newTimeRemaining,
        isExpired,
        isRunning: !isExpired,
      };
    case 'EXPIRE':
      return {
        ...state,
        timeRemaining: 0,
        isRunning: false,
        isExpired: true,
      };
    default:
      return state;
  }
};

const TimerContext = createContext<TimerContextValue | undefined>(undefined);

interface TimerProviderProps {
  children: React.ReactNode;
  onTimeUp: () => void;
  initialTimeLimit: number;
}

export function TimerProvider({ children, onTimeUp, initialTimeLimit }: TimerProviderProps) {
  const [state, dispatch] = useReducer(timerReducer, initialState);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const startTimer = useCallback((timeLimit: number) => {
    startTimeRef.current = performance.now();
    dispatch({ type: 'START', payload: timeLimit });
  }, []);

  const stopTimer = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    dispatch({ type: 'STOP' });
  }, []);

  const resetTimer = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    startTimeRef.current = null;
    dispatch({ type: 'RESET' });
  }, []);

  useEffect(() => {
    let isComponentMounted = true;
    let lastUpdateTime = 0;
    const updateInterval = 1000 / 60; // 60 FPS

    const updateTimer = (timestamp: number) => {
      if (!startTimeRef.current || !state.isRunning) return;

      // Throttle updates to 60 FPS for smoother animation
      if (timestamp - lastUpdateTime < updateInterval) {
        animationFrameRef.current = requestAnimationFrame(updateTimer);
        return;
      }

      const currentTime = performance.now();
      const elapsedSeconds = (currentTime - startTimeRef.current) / 1000;
      const remainingTime = state.timeLimit - elapsedSeconds;

      if (remainingTime <= 0) {
        dispatch({ type: 'EXPIRE' });
        if (isComponentMounted) {
          onTimeUp();
        }
        return;
      }

      lastUpdateTime = timestamp;
      dispatch({ type: 'UPDATE_TIME', payload: remainingTime });
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    };

    if (state.isRunning) {
      lastUpdateTime = performance.now();
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    }

    return () => {
      isComponentMounted = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state.isRunning, state.timeLimit, onTimeUp]);

  // Start timer with initialTimeLimit when provider mounts
  useEffect(() => {
    startTimer(initialTimeLimit);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initialTimeLimit, startTimer]); // Run when initialTimeLimit changes

  const value = {
    state,
    startTimer,
    stopTimer,
    resetTimer,
  };

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}
