// src/types/timer.ts
export interface TimerState {
    timeLimit: number;
    timeRemaining: number;
    isRunning: boolean;
    isExpired: boolean;
    progress: number;
  }
  
  export interface TimerContextValue {
    state: TimerState;
    startTimer: (timeLimit: number) => void;
    stopTimer: () => void;
    resetTimer: () => void;
  }