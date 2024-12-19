// client/src/hooks/useExerciseSession.ts
import { useContext, useCallback } from 'react';
import { Exercise, ExerciseResult } from '../types/exercise';
import { ExerciseSessionContext } from '../contexts/ExerciseSessionContext';

export function useExerciseSession() {
  const context = useContext(ExerciseSessionContext);

  if (!context) {
    throw new Error('useExerciseSession must be used within an ExerciseSessionProvider');
  }

  const { state, dispatch, currentExercise, stats } = context;

  const startSession = useCallback((exercises: Exercise[]) => {
    dispatch({ type: 'START_SESSION', payload: exercises });
  }, [dispatch]);

  const nextExercise = useCallback(() => {
    dispatch({ type: 'NEXT_EXERCISE' });
  }, [dispatch]);

  const addResult = useCallback((result: ExerciseResult) => {
    dispatch({ type: 'ADD_RESULT', payload: result });
  }, [dispatch]);

  const completeSession = useCallback(() => {
    dispatch({ type: 'COMPLETE_SESSION' });
  }, [dispatch]);

  const resetSession = useCallback(() => {
    dispatch({ type: 'RESET_SESSION' });
  }, [dispatch]);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, [dispatch]);

  const setError = useCallback((error: string) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, [dispatch]);

  return {
    // State
    session: state.session,
    currentExercise,
    loading: state.loading,
    error: state.error,
    stats,
    isComplete: state.session?.isComplete ?? false,
    currentIndex: state.session?.currentExerciseIndex ?? 0,
    totalExercises: state.session?.exercises.length ?? 0,

    // Actions
    startSession,
    nextExercise,
    addResult,
    completeSession,
    resetSession,
    setLoading,
    setError,
  };
}