// packages/src/hooks/useExercise.ts

import { useContext, useCallback } from 'react';
import { Exercise, ExerciseResult, ExerciseStatus, MCQExerciseResult, TextInputExerciseResult } from '../types/exercise';
import { ExerciseContext } from '../contexts/ExerciseContext';
import { useExerciseSession } from './useExerciseSession';

export function useExercise() {
  const context = useContext(ExerciseContext);
  const sessionContext = useExerciseSession();
  
  if (!context) {
    throw new Error('useExercise must be used within an ExerciseProvider');
  }

  const { exercise, state, loading, error, dispatch } = context;
  
  const setAnswer = useCallback(async (answer: string, isCorrect: boolean, points: number) => {
    if (!exercise || (state?.status !== ExerciseStatus.IN_PROGRESS && 
        state?.status !== ExerciseStatus.ANSWERED)) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Update exercise state
      dispatch({ 
        type: 'SET_ANSWER', 
        payload: { answer, isCorrect, points } 
      });

      // Create result for the session
      const baseResult = {
        exerciseId: exercise.id,
        isCorrect,
        points,
        timeTaken: exercise.timeLimit ? exercise.timeLimit - (state?.timeRemaining ?? 0) : 0,
      };

      const result: ExerciseResult = exercise.type === 'mcq'
        ? {
            ...baseResult,
            type: 'mcq' as const,
            selectedAnswer: answer,
          } as MCQExerciseResult
        : {
            ...baseResult,
            type: 'text_input' as const,
            userInput: answer,
          } as TextInputExerciseResult;

      // Add result to session
      sessionContext.addResult(result);

      // Move to next exercise if available
      if (sessionContext.currentIndex < sessionContext.totalExercises - 1) {
        sessionContext.nextExercise();
      } else {
        sessionContext.completeSession();
      }
    } catch (err) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: err instanceof Error ? err.message : 'An error occurred' 
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state?.status, state?.timeRemaining, exercise, dispatch, sessionContext]);

  const updateTime = useCallback((time: number) => {
    dispatch({ type: 'UPDATE_TIME', payload: time });
  }, [dispatch]);

  const handleTimerExpire = useCallback(() => {
    if (state?.status !== ExerciseStatus.IN_PROGRESS) return;
    dispatch({ type: 'SET_STATUS', payload: ExerciseStatus.TIMER_EXPIRED });
    
    // Auto-submit with incorrect answer on timeout
    setAnswer('', false, 0);
  }, [state?.status, dispatch, setAnswer]);

  const setResult = useCallback((result: ExerciseResult) => {
    dispatch({ type: 'SET_RESULT', payload: result });
    sessionContext.addResult(result);
  }, [dispatch, sessionContext]);

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
    // State
    exercise,
    state,
    loading,
    error,
    isComplete: sessionContext.isComplete,
    currentIndex: sessionContext.currentIndex,
    totalExercises: sessionContext.totalExercises,
    sessionStats: sessionContext.stats,

    // Actions
    setAnswer,
    updateTime,
    handleTimerExpire,
    setResult,
    resetExercise,
    startExercise,
    setStatus,
    
    // Session actions
    startSession: sessionContext.startSession,
    completeSession: sessionContext.completeSession,
    resetSession: sessionContext.resetSession,
  };
}
