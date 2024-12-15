// src/contexts/ExerciseContext.tsx

import React, { createContext, useReducer, ReactNode, useCallback } from 'react';
import { Exercise, ExerciseState, ExerciseStatus, ExerciseResult } from '../types/exercise';

interface ExerciseContextType {
  exercise: Exercise | null;
  state: ExerciseState | null;
  dispatch: React.Dispatch<ExerciseAction>;
}

type ExerciseAction =
  | { type: 'SET_EXERCISE'; payload: Exercise }
  | { type: 'UPDATE_TIME'; payload: number }
  | { type: 'SET_ANSWER'; payload: { answer: string; isCorrect: boolean; points: number } }
  | { type: 'SET_STATUS'; payload: ExerciseStatus }
  | { type: 'SET_RESULT'; payload: ExerciseResult }
  | { type: 'RESET' };

export const ExerciseContext = createContext<ExerciseContextType | undefined>(undefined);

const initialState: ExerciseState = {
  status: ExerciseStatus.INITIAL,
  timeRemaining: 0,
  points: 0,
  isCorrect: null,
  selectedAnswer: null,
};

function exerciseReducer(state: ExerciseState, action: ExerciseAction): ExerciseState {
  console.log('Reducer action:', action.type, 'payload:', 
    action.type !== 'RESET' ? action.payload : 'no payload');
  console.log('Current state:', state);
  
  switch (action.type) {
    case 'SET_EXERCISE':
      return {
        ...initialState,
        timeRemaining: action.payload.timeLimit,
        status: ExerciseStatus.IN_PROGRESS,
      };
    case 'UPDATE_TIME':
      return {
        ...state,
        timeRemaining: action.payload,
      };
    case 'SET_ANSWER':
      return {
        ...state,
        selectedAnswer: action.payload.answer,
        isCorrect: action.payload.isCorrect,
        points: action.payload.points,
        status: ExerciseStatus.COMPLETED,
      };
    case 'SET_STATUS':
      return {
        ...state,
        status: action.payload,
      };
    case 'SET_RESULT':
      return {
        ...state,
        isCorrect: action.payload.isCorrect,
        points: action.payload.points,
        status: ExerciseStatus.COMPLETED,
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export const ExerciseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [exercise, setExercise] = React.useState<Exercise | null>(null);
  const [state, dispatch] = useReducer(exerciseReducer, initialState);

  // Memoize the wrapped dispatch function
  const wrappedDispatch = useCallback((action: ExerciseAction) => {
    console.log('Dispatching action:', action.type);
    if (action.type === 'SET_EXERCISE') {
      setExercise(action.payload);
    }
    dispatch(action);
  }, []);

  const value = React.useMemo(() => ({
    exercise,
    state,
    dispatch: wrappedDispatch,
  }), [exercise, state, wrappedDispatch]);

  return (
    <ExerciseContext.Provider value={value}>
      {children}
    </ExerciseContext.Provider>
  );
};

export default ExerciseContext;
