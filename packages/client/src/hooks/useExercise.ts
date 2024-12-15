// packages/src/hooks/useExercise.ts

import { useContext, useCallback } from 'react';
import { Exercise, ExerciseResult, ExerciseStatus } from '../types/exercise';
import { ExerciseContext } from '../contexts/ExerciseContext';

export function useExercise() {
  const context = useContext(ExerciseContext);
  
  if (!context) {
    throw new Error('useExercise must be used within an ExerciseProvider');
  }

  const { exercise, state, dispatch } = context;

  const setAnswer = useCallback((answer: string, isCorrect: boolean, points: number) => {
    if (state?.status !== ExerciseStatus.IN_PROGRESS && 
        state?.status !== ExerciseStatus.ANSWERED) return;
    dispatch({ 
      type: 'SET_ANSWER', 
      payload: { 
        answer,
        isCorrect,
        points
      } 
    });
  }, [state?.status, dispatch]);

  const updateTime = useCallback((time: number) => {
    dispatch({ type: 'UPDATE_TIME', payload: time });
  }, [dispatch]);

  const handleTimerExpire = useCallback(() => {
    if (state?.status !== ExerciseStatus.IN_PROGRESS) return;
    dispatch({ type: 'SET_STATUS', payload: ExerciseStatus.TIMER_EXPIRED });
  }, [state?.status, dispatch]);

  const setResult = useCallback((result: ExerciseResult) => {
    dispatch({ type: 'SET_RESULT', payload: result });
  }, [dispatch]);

  const resetExercise = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, [dispatch]);

  const startExercise = useCallback((exercise: Exercise) => {
    dispatch({ type: 'SET_EXERCISE', payload: exercise });
    dispatch({ type: 'SET_STATUS', payload: ExerciseStatus.IN_PROGRESS });
  }, [dispatch]);

  const setStatus = useCallback((status: ExerciseStatus) => {
    dispatch({ type: 'SET_STATUS', payload: status });
  }, [dispatch]);

  return {
    exercise,
    state,
    setAnswer,
    updateTime,
    handleTimerExpire,
    setResult,
    resetExercise,
    startExercise,
    setStatus,
    dispatch, // Expose dispatch for advanced state management
  };
}
